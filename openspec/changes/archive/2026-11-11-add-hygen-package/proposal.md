# Proposal

## Why

The `biorate/core` monorepo has no template-based code generation tool: typical artifacts (packages, migrations, configs) are created manually. Forking the proven [hygen](https://github.com/jondot/hygen) generator (v6.2.11, MIT) gives us generators living inside the project itself: templates are stored in `_templates` and reviewed in the same PRs as the code. Porting it into the monorepo package standard makes the tool maintainable and publishable as `@biorate/hygen`.

## What Changes

- A new package `packages/@biorate/hygen/`: upstream `src/` source (core + `ops/`: add, inject, shell, echo, setup) and the built-in templates `src/templates/`.
- Port of upstream tests (Jest → Vitest), **without** the metaverse tests (fragile, pull external repositories).
- Port of the `hygen.io/docs/*.md` documentation (11 pages) into `packages/@biorate/hygen/docs/` as plain markdown, with links rewritten to local ones.
- Runtime errors aligned with the monorepo standard: `BaseError`-derived classes (`@biorate/errors: workspace:*`) instead of raw `Error`.
- The package follows monorepo conventions: root `index.ts` shim, triple build (`dist/cjs|esm|types`), `exports`, exact dependency versions, `.npmignore`, `prepublishOnly`.
- The `hygen` CLI binary (`bin` field) — published as a globally installable command; an assumption not challenged by the author (see design.md, "Open Questions").
- Not ported: `dist/`, `lib/`, the docusaurus site (`hygen.io/`), `media/`, the standalone `pkg` build, the `bin.timed` benchmark, upstream CI, `yarn.lock`.

## Capabilities

### New Capabilities

- `hygen-generator`: the behavior of the `@biorate/hygen` package as a code generator — template resolution (`_templates`, `HYGEN_TMPLS`), EJS rendering with frontmatter, add/inject/shell operations, prompts, CLI interface.

### Modified Capabilities

- (none — no new requirements for existing packages; `@biorate/errors` is used as is)

## Impact

- **New files:** `packages/@biorate/hygen/**` (code, tests, docs, build configs).
- **Dependencies:** 12 upstream runtime deps (`ejs`, `enquirer`, `chalk`, `yargs-parser`, `fs-extra`, `execa`, `front-matter`, `change-case`, `inflection`, `debug`, `ora`, `ignore-walk`) — exact versions; `@types/*` in devDeps.
- **Existing packages:** untouched; `@biorate/errors` is a new incoming workspace dependency.
- **Risks:** EJS templates execute arbitrary template code (as in upstream, risk not amplified); a CLI in a library monorepo package is a first — verify `files`/`bin` so that `src/`, `tests/`, `docs/` never reach npm.
