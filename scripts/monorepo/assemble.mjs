#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import { execSync } from "node:child_process";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function prefixParts(project) {
  const { id, urlPrefix } = project;
  if (
    typeof urlPrefix !== "string" ||
    !urlPrefix.startsWith("/") ||
    !urlPrefix.endsWith("/") ||
    urlPrefix.startsWith("//") ||
    urlPrefix.includes("//") ||
    urlPrefix.includes("\\") ||
    /[?#]/.test(urlPrefix) ||
    urlPrefix.split("/").some((part) => part === "." || part === "..")
  ) {
    throw new Error(`project "${id}" has invalid urlPrefix: ${JSON.stringify(urlPrefix)}`);
  }
  return urlPrefix.split("/").filter(Boolean);
}

function outputDirectory(root, project) {
  if (typeof project.out !== "string" || project.out.length === 0 || isAbsolute(project.out)) {
    throw new Error(`project "${project.id}" must have a relative out directory`);
  }
  const output = resolve(root, project.out);
  const relativeOutput = relative(root, output);
  if (relativeOutput === ".." || relativeOutput.startsWith(`..${sep}`) || isAbsolute(relativeOutput)) {
    throw new Error(`project "${project.id}" out directory must be inside the repo: ${project.out}`);
  }
  return output;
}

async function outputFiles(directory) {
  const files = [];
  async function walk(current, prefix = "") {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolute = join(current, entry.name);
      if (entry.isDirectory()) await walk(absolute, path);
      else files.push(path);
    }
  }
  await walk(directory);
  return files;
}

function findCollision(owned, target) {
  if (owned.has(target)) return [target, owned.get(target)];
  for (const [existing, owner] of owned) {
    if (existing.startsWith(`${target}/`)) return [existing, owner];
    if (target.startsWith(`${existing}/`)) return [target, owner];
  }
  return null;
}

export async function assemble({
  root = ROOT,
  manifestPath = join(root, "monorepo.json"),
  sitePath = join(root, "_site"),
} = {}) {
  root = resolve(root);
  sitePath = resolve(sitePath);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (!manifest || !Array.isArray(manifest.projects) || manifest.projects.length === 0) {
    throw new Error("monorepo.json must contain a non-empty projects array");
  }

  const ids = new Set();
  const projects = [];
  for (const project of manifest.projects) {
    if (!project || typeof project.id !== "string" || project.id.length === 0) {
      throw new Error("each project must have a non-empty id");
    }
    if (ids.has(project.id)) throw new Error(`duplicate project id: ${project.id}`);
    ids.add(project.id);
    if (typeof project.path !== "string" || !project.path) {
      throw new Error(`project "${project.id}" must have a path`);
    }
    const parts = prefixParts(project);
    if (project.build !== null && typeof project.build !== "string") {
      throw new Error(`project "${project.id}" build must be a shell command or null`);
    }
    if (!Array.isArray(project.legacy)) {
      throw new Error(`project "${project.id}" legacy must be an array`);
    }
    const output = outputDirectory(root, project);
    if (project.build) execSync(project.build, { cwd: root, stdio: "inherit", shell: true });
    let outputStat;
    try {
      outputStat = await stat(output);
    } catch {
      throw new Error(`project "${project.id}" output directory is missing: ${project.out}`);
    }
    if (!outputStat.isDirectory()) {
      throw new Error(`project "${project.id}" output is not a directory: ${project.out}`);
    }
    projects.push({ ...project, prefixParts: parts, output });
  }

  for (const project of projects) {
    if (
      sitePath === project.output ||
      sitePath.startsWith(`${project.output}${sep}`) ||
      project.output.startsWith(`${sitePath}${sep}`)
    ) {
      throw new Error(`assembly destination overlaps output directory for project "${project.id}"`);
    }
  }

  const owned = new Map();
  for (const project of projects) {
    for (const file of await outputFiles(project.output)) {
      const target = [...project.prefixParts, ...file.split("/")].join("/");
      const collision = findCollision(owned, target);
      if (collision) {
        throw new Error(
          `output collision at "_site/${collision[0]}" between projects "${collision[1]}" and "${project.id}"`,
        );
      }
      owned.set(target, project.id);
    }
  }

  await rm(sitePath, { recursive: true, force: true });
  await mkdir(sitePath, { recursive: true });
  for (const project of projects) {
    const destination = join(sitePath, ...project.prefixParts);
    await mkdir(destination, { recursive: true });
    await cp(project.output, destination, { recursive: true });
  }
  return sitePath;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assemble().catch((error) => {
    console.error(`assemble: ${error.message}`);
    process.exitCode = 1;
  });
}
