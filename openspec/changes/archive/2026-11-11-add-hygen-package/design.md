# Design

## Context

Upstream `jondot/hygen` v6.2.11 (MIT): ~24 files in `src/` (functional style — parameters in, files out), built-in templates in `src/templates/`, Jest tests in `src/__tests__/` (117 files, mostly fixtures), docs — 11 markdown pages inside the docusaurus site `hygen.io/docs/`. The monorepo is 55+ `@biorate/*` library packages with a single build template (see proposal.md — What Changes); this will be the first CLI package in the scope. Conventions taken from `@biorate/config`, `@biorate/errors`, `@biorate/migrations`.

## Goals / Non-Goals

**Goals:**

- A minimally invasive port: upstream code and semantics preserved; differences limited to what the monorepo standard requires (build, versions, errors, Vitest).
- A working CLI + an embeddable `runner()`.
- Unit coverage sufficient for a confident fork (no metaverse).

**Non-Goals:**

- Standalone binaries (`pkg`, Homebrew tap) — installation via npm/npx.
- The startup-speed benchmark (`bin.timed`) and its tests.
- Dependency modernization beyond necessity (ejs 3, enquirer 2 — kept).
- Syncing with upstream changes (one-time import; a future merge, if needed, is a separate task).

## Decisions

1. **One-time import without maintaining merge compatibility.** The error and structure refactoring makes diffs vs upstream inevitably deep; keeping it as our own package is cheaper. The alternative — a "thin" fork with patches over upstream — is rejected: it conflicts with the error standard and the build.
2. **Errors: `src/errors.ts` with `BaseError`-derived classes.** Expected set: `TemplateRenderError`, `InjectionTargetNotFoundError`, `ShellCommandError`, `TemplateNotFoundError`, `PromptError`. The exact set is finalized during the port, at the `throw` sites in `src/ops/*` and `engine.ts`.
3. **Tests: `tests/` at the package root, Vitest.** Port upstream specs (without `metaverse*`), fixtures into `tests/fixtures/`. Mechanical replacements `jest.fn`→`vi.fn`, `jest.mock`→`vi.mock`, `jest.spyOn`→`vi.spyOn`. A local `vitest.config.ts` via `mergeConfig` with the root one — following `@biorate/migrations` (needed if specs pull aliases/fixtures with paths).
4. **CLI: we publish the `hygen` binary.** `bin: { hygen: "./dist/cjs/bin.js" }`; the corresponding path is added to `exports`. This is an assumption (the author did not confirm explicitly); the rollback is to drop `bin` and the package stays an embeddable library — nothing in specs changes (the CLI requirement is already captured as a separate requirement).
5. **Entry point: the root `index.ts` shim** (`export * from './src'`) — the convention of all packages; the public API is `runner`, `Logger`.
6. **Docs: `docs/` at the package root, outside `files`.** The `hygen.io/docs/*.md` pages are already markdown; cleanup — remove docusaurus frontmatter (`sidebar_*`, `title` labels) and rewrite absolute `https://hygen.io/docs/...` links to relative `./quick-start.md`. The package README is brief, linking to docs and noting "fork of jondot/hygen, MIT".
7. **Dependencies: un-pin `^` → exact versions from the upstream commit** (monorepo rule; for hygen — the versions of its yarn.lock at import time). `@types/node` and other `@types/*` go to devDependencies.
8. **`require-cjs/require-esm` is not needed at the start**: hygen's dependencies are ordinary CJS packages; dual build is handled by the standard three tsconfig profiles. Keep the migrations template (`require-cjs.ts`) in mind in case Vitest hits dual-package artifacts.

## Risks / Trade-offs

- [EJS executes arbitrary template code] → we do not amplify the risk: behavior as in upstream; the README documents that templates are code from the repository.
- [First CLI package: risk of leaking extra files to npm] → `files: ["dist/**", "README.md", "LICENSE"]` + `bin` pointing only to `dist/cjs/bin.js`; verified with `pnpm pack --dry-run`.
- [Porting 100+ Jest test files to Vitest] → metaverse excluded; remaining specs ported in batches with a local run after each batch; for specs stubbornly tied to jest specifics — rewrite for Vitest rather than preserving jest syntax.
- [Deep throw refactoring may change error texts that upstream tests depend on] → tests are updated together with the code; message texts are not considered a contract.
- [12 runtime dependencies weigh on installation] → deliberate: the alternative (rewriting on fewer dependencies) is a separate task, not in this change.

## Migration Plan

Adding a new package requires no migration. Rollback: delete `packages/@biorate/hygen/` before publishing; after publishing — deprecate on npm.

## Open Questions

- (resolved earlier) metaverse tests — not ported; package name — `@biorate/hygen`.
- The exact set of error classes is finalized during the port — does not affect specs or task breakdown.
