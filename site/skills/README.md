# AiGovOps Foundation — Reusable Skills

Procedural skills captured from building and operating this site. Each is a
`SKILL.md` with YAML frontmatter (name + description) and a procedure body.

These hold **procedure, not facts.** Live facts (URLs, framework counts, post
authors) live in `HIBT.md`, which is version-controlled and dated — that's the
right home for things that go stale. Skills describe *how*, not *what's true today*.

| Skill | Use it when |
|-------|-------------|
| `aigovops-deploy-workflow` | Shipping any change: branch → Cloud-Mary → commit → PR → squash-merge → sync |
| `cloud-mary-testing` | Running or extending the test suite; debugging a failing tier |
| `marblism-chatbot-integration` | Connecting a backend (Marblism) to the homepage chatbot safely |

## Installing into the live skill path
These files are version-controlled here in the repo. To make them auto-load in a
Claude environment, place/copy them where the runtime reads user skills (e.g.
`/mnt/skills/user/<name>/SKILL.md`). This repo is the durable source of truth;
the runtime location is a copy.
