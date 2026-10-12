import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import { assemble } from "./assemble.mjs";
import { mapUrl, renderStub } from "./redirect-stub.mjs";
import { hasAnchor } from "./link-test.mjs";

const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));

async function fileContents(directory) {
  const files = new Map();
  async function walk(current, prefix = "") {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolute = join(current, entry.name);
      if (entry.isDirectory()) await walk(absolute, relative);
      else files.set(relative, await readFile(absolute));
    }
  }
  await walk(directory);
  return files;
}

async function fixtureRoot() {
  const root = await mkdtemp(join(tmpdir(), "monorepo-assemble-"));
  await mkdir(join(root, "a"), { recursive: true });
  await mkdir(join(root, "b"), { recursive: true });
  return root;
}

async function writeManifest(root, projects) {
  await writeFile(join(root, "monorepo.json"), JSON.stringify({ projects }, null, 2));
}

function project(id, out, urlPrefix) {
  return { id, path: out, urlPrefix, build: null, out, legacy: [] };
}

test("real manifest assembles _site byte-for-byte from docs", async () => {
  await assemble();
  const docs = await fileContents(join(ROOT, "docs"));
  const site = await fileContents(join(ROOT, "_site"));
  assert.deepEqual([...site.keys()].sort(), [...docs.keys()].sort());
  for (const [path, contents] of docs) assert.deepEqual(site.get(path), contents, path);
});

test("assembly reports both project ids on a file collision", async () => {
  const root = await fixtureRoot();
  try {
    await writeFile(join(root, "a", "same.txt"), "one");
    await writeFile(join(root, "b", "same.txt"), "two");
    await writeManifest(root, [project("alpha", "a", "/"), project("beta", "b", "/")]);
    await assert.rejects(
      assemble({ root, manifestPath: join(root, "monorepo.json"), sitePath: join(root, "_site") }),
      /collision.*alpha.*beta|collision.*beta.*alpha/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("overlapping prefixes are allowed when output files do not collide", async () => {
  const root = await fixtureRoot();
  try {
    await writeFile(join(root, "a", "index.html"), "a");
    await writeFile(join(root, "b", "index.html"), "b");
    await writeManifest(root, [project("outer", "a", "/a/"), project("inner", "b", "/a/b/")]);
    await assemble({ root, manifestPath: join(root, "monorepo.json"), sitePath: join(root, "_site") });
    assert.equal(await readFile(join(root, "_site", "a", "index.html"), "utf8"), "a");
    assert.equal(await readFile(join(root, "_site", "a", "b", "index.html"), "utf8"), "b");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("mapUrl preserves the path, query, and hash and respects base boundaries", () => {
  const from = "https://aigovops-foundation.github.io/aigovops-beacon/";
  const to = "https://www.aigovops-foundation.com/beacon/";
  assert.equal(
    mapUrl(from, to, from),
    "https://www.aigovops-foundation.com/beacon/",
  );
  assert.equal(
    mapUrl(from, to, `${from}guide/setup.html`),
    "https://www.aigovops-foundation.com/beacon/guide/setup.html",
  );
  assert.equal(
    mapUrl(from, to, `${from}guide/?lang=es`),
    "https://www.aigovops-foundation.com/beacon/guide/?lang=es",
  );
  assert.equal(
    mapUrl(from, to, `${from}guide/#quick-start`),
    "https://www.aigovops-foundation.com/beacon/guide/#quick-start",
  );
  assert.equal(
    mapUrl(from, to, `${from}guide/?lang=es#quick-start`),
    "https://www.aigovops-foundation.com/beacon/guide/?lang=es#quick-start",
  );
  assert.equal(
    mapUrl(
      "https://aigovops-foundation.github.io/aigovops-beacon",
      "https://www.aigovops-foundation.com/beacon",
      "https://aigovops-foundation.github.io/aigovops-beacon?lang=es#demo",
    ),
    "https://www.aigovops-foundation.com/beacon/?lang=es#demo",
  );
  assert.equal(
    mapUrl(from, to, "https://aigovops-foundation.github.io/aigovops-lantern/"),
    null,
  );
  assert.equal(
    mapUrl(from, to, "https://aigovops-foundation.github.io/aigovops-beacon-old/"),
    null,
  );
});

test("link test anchor lookup matches exact id and name values", () => {
  assert.equal(hasAnchor('<main id="demo"></main>', "demo"), true);
  assert.equal(hasAnchor('<a name="quick-start"></a>', "quick-start"), true);
  assert.equal(hasAnchor('<main id="Demo"></main>', "demo"), false);
  assert.equal(hasAnchor('<main data-id="demo"></main>', "demo"), false);
});

test("generated redirect stub maps deep paths in its inline script", async () => {
  const from = "https://aigovops-foundation.github.io/aigovops-beacon/";
  const to = "https://www.aigovops-foundation.com/beacon/";
  const script = renderStub(from, to).match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);

  const hrefs = [
    from,
    `${from}guide/setup.html`,
    `${from}guide/?lang=es#quick-start`,
  ];
  for (const href of hrefs) {
    let redirected;
    const location = {
      href,
      replace(value) {
        redirected = value;
      },
    };
    vm.runInNewContext(script, { URL, window: { location } });
    assert.equal(redirected, mapUrl(from, to, href));
  }
});

test("redirect CLI writes matching index and 404 documents", async () => {
  const root = await mkdtemp(join(tmpdir(), "monorepo-redirect-"));
  try {
    const out = join(root, "stub");
    const command = spawnSync(
      process.execPath,
      [
        join(ROOT, "scripts/monorepo/redirect-stub.mjs"),
        "--from",
        "https://example.github.io/old/",
        "--to",
        "https://example.com/new/",
        "--out",
        out,
      ],
      { encoding: "utf8" },
    );
    assert.equal(command.status, 0, command.stderr);
    const index = await readFile(join(out, "index.html"), "utf8");
    const notFound = await readFile(join(out, "404.html"), "utf8");
    assert.equal(index, notFound);
    assert.match(index, /<meta name="robots" content="noindex">/);
    assert.match(index, /<link rel="canonical" href="https:\/\/example\.com\/new\/">/);
    assert.match(index, /location\.replace\(mapped\)/);
    assert.match(index, /Continue to the new site/);
    assert.doesNotMatch(index, /http-equiv=["']refresh/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("import script preserves source history and drops excluded paths", { timeout: 60_000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), "monorepo-import-"));
  const source = join(root, "source");
  const destination = join(root, "destination");
  const importScript = join(ROOT, "scripts/monorepo/import-repo.sh");
  const git = (cwd, ...args) => {
    const result = spawnSync("git", args, { cwd, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return result.stdout.trim();
  };
  try {
    await mkdir(source);
    await mkdir(destination);
    git(source, "init", "--initial-branch=main");
    git(source, "config", "user.name", "Monorepo Test");
    git(source, "config", "user.email", "monorepo-test@example.invalid");
    await writeFile(join(source, "visible.txt"), "first\n");
    await writeFile(join(source, "secret.txt"), "excluded\n");
    git(source, "add", "visible.txt", "secret.txt");
    git(source, "commit", "-m", "source initial");
    await writeFile(join(source, "visible.txt"), "second\n");
    git(source, "add", "visible.txt");
    git(source, "commit", "-m", "source update");

    git(destination, "init", "--initial-branch=main");
    git(destination, "config", "user.name", "Monorepo Test");
    git(destination, "config", "user.email", "monorepo-test@example.invalid");
    await writeFile(join(destination, "README.md"), "destination\n");
    git(destination, "add", "README.md");
    git(destination, "commit", "-m", "destination initial");

    const imported = spawnSync(
      "bash",
      [importScript, source, "main", "vendor/x", "--drop-path", "secret.txt"],
      { cwd: destination, encoding: "utf8", timeout: 50_000 },
    );
    assert.equal(imported.status, 0, `${imported.stdout}\n${imported.stderr}`);
    assert.equal(await readFile(join(destination, "vendor/x/visible.txt"), "utf8"), "second\n");
    const history = git(destination, "log", "--follow", "--format=%s", "--", "vendor/x/visible.txt");
    assert.deepEqual(history.split("\n"), ["source update", "source initial"]);
    assert.equal(git(destination, "log", "--all", "--", "vendor/x/secret.txt"), "");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
