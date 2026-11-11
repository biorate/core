# Tasks

## 1. Package skeleton

- [x] 1.1 Create `packages/@biorate/hygen/` with a `package.json` following the `@biorate/config` template (main/module/types/exports, `bin: { hygen: './dist/cjs/bin.js' }`, `files: ['dist/**','README.md','LICENSE']`, clean/build:cjs/build:esm/build:types/build/prepublishOnly scripts, postbuild via `.scripts/write-package-type.js` and `tsc-esm-fix`); verify: `pnpm i` at the root links the package into the workspace
- [x] 1.2 Create the tsconfig set (`tsconfig.json` strict + `tsconfig.build.json` + cjs/esm/types profiles, the root `index.ts` shim `export * from './src'`) and `.npmignore`/`.gitignore` following `@biorate/config`; verify: an empty `pnpm --filter @biorate/hygen run build` passes without compilation errors
- [x] 1.3 Declare dependencies: 12 runtime deps at exact versions (ejs, enquirer, chalk, yargs-parser, fs-extra, execa, front-matter, change-case, inflection, debug, ora, ignore-walk), `@biorate/errors: workspace:*`, `@types/*` in devDeps; verify: `pnpm i` installs without peer-conflict warnings
- [x] 1.4 Copy `LICENSE` (MIT upstream copyright) and `CHANGELOG.md`; verify: the files exist, the license points to the original project

## 2. Code

- [x] 2.1 Port the upstream core `src/` (engine, render, params, prompt, config, config-resolver, context, help, logger, newline, execute, types, index; without `bin.timed.ts`) with import fixes for the dual build; verify: `pnpm --filter @biorate/hygen run build` produces all three outputs
- [x] 2.2 Port `src/ops/` (add, inject, injector, shell, echo, setup, result, index) and `src/templates/` (built-in templates); verify: the build includes templates in `dist`, `tsc -p tsconfig.build.types.json` without errors
- [x] 2.3 Create `src/errors.ts` with `BaseError`-derived classes (`TemplateRenderError`, `InjectionTargetNotFoundError`, `ShellCommandError`, `TemplateNotFoundError`, `PromptError` — finalize the set at the `throw` sites) and replace raw `Error`s accordingly; verify: grep over `src/` finds no `throw new Error\(`/`new TypeError\(` outside `errors.ts`
- [x] 2.4 Port `bin.ts` as the CLI entry (`dist/cjs/bin.js`), with a shebang and without upstream's dist-relative hacks; verify: `node packages/@biorate/hygen/dist/cjs/bin.js --help` prints help

## 3. Tests (Jest → Vitest)

- [x] 3.1 Create `tests/` and (if needed) a local `vitest.config.ts` via `mergeConfig` with the root one, following `@biorate/migrations`; verify: `pnpm --filter @biorate/hygen run test` runs an empty suite
- [x] 3.2 Port the core unit specs (engine, render, params, config-resolver, newline, helpers) with `jest.fn`→`vi.fn`, `jest.mock`→`vi.mock` replacements and fixtures in `tests/fixtures/`; verify: the ported specs are green
- [x] 3.3 Port the ops specs (add, inject, injector, shell) and CLI specs; do not port the metaverse tests; verify: `pnpm --filter @biorate/hygen run test` — the whole suite is green
- [x] 3.4 Ensure error-text tests are updated for the `BaseError` classes; verify: no specs assert `instanceof Error` on "raw" classes

## 4. Documentation

- [x] 4.1 Port the 11 `hygen.io/docs/*.md` pages into `packages/@biorate/hygen/docs/`, removing docusaurus frontmatter and rewriting absolute `https://hygen.io/...` links to relative ones; verify: no link in `docs/` points to hygen.io except explicit project mentions
- [x] 4.2 Write the package `README.md`: purpose, quick-start (`hygen init self`, `hygen generator new`), a "fork of jondot/hygen (MIT)" note, a link to `docs/`; verify: the README commands run in a `/tmp/opencode` sandbox

## 5. Verification

- [x] 5.1 CLI smoke run: in `/tmp/opencode/sandbox` execute `hygen init self` → `hygen generator new mygen` → `hygen mygen new`; verify: `_templates` and `app/hello.js` are created
- [x] 5.2 Injection smoke run: a template with `inject: true` + `skip_if` on the sandbox `package.json` — twice; verify: a single insertion, the repeat skipped
- [x] 5.3 `pnpm pack --dry-run` in the package; verify: `src/`, `tests/`, `docs/`, and configs do not reach the archive
- [x] 5.4 Monorepo pass: `pnpm run build` and `pnpm run test` for affected neighbors (`@biorate/errors` and its dependents) — green; package formatting per the root `.prettierrc`

## Workflow follow-up

- Run `openspec validate` before apply.
- Do not commit or publish without an explicit request from the author (monorepo rules).
- Archive the change after the author's review.
