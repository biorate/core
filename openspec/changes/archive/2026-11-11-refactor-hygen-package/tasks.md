# Tasks

## 1. Code structure refactor (behavior 1:1)

- [x] 1.1 Split `src/engine.ts`: move `-h`/`--help` handling and usage text into new `src/cli-help.ts` (keep the `process.exit(0)` encapsulated there); leave validation + render→execute pipeline in `engine.ts`; convert to named exports (drop `export default`); update imports; verify: `pnpm --filter @biorate/hygen run test` 60/60 green
- [x] 1.2 Extract `runner` from `src/index.ts` into `src/runner.ts` with explicit error handling (try/catch, debug output, `ShowHelpError` → `printHelp`); `index.ts` becomes a pure barrel; verify: suite green, `runner` still exported from the package root with the same signature
- [x] 1.3 Extract anchor strategy from `src/ops/injector.ts`: new `src/ops/anchors.ts` with a common `locate(lines): number` interface and one locator per anchor kind (`before`, `after` via the pragmatic line/full-text matching; `prepend`, `append`, `at_line` trivial); `getPragmaticIndex` dissolves into locators; `replace`/`skip_if`/`skip_if_not` stay functions on top; verify: all injector/inject unit tests and kitchen-sink cases green
- [x] 1.4 Remove `any` from `src/types.ts` (`attributes: Record<string, unknown>`, typed `helpers` signature); adjust call sites in `render.ts`/`context.ts`/`help.ts` and test fixtures with explicit types (typing-only, no assertion changes); verify: `npx tsc -p tsconfig.json --noEmit` 0 errors, suite green
- [x] 1.5 Group verification: tests green, `tsc --noEmit` 0 errors, `npx prettier --check` and `npx eslint src` clean

## 2. TSDoc pass (typedoc input)

- [x] 2.1 TSDoc on `src/types.ts` public types (`RunnerConfig`, `RunnerResult`, `RenderedAction`, `Logger`, `Prompter`, `RunnerContextConfig`, resolver types): `@description` per member; verify: types compile, descriptions present
- [x] 2.2 TSDoc on `src/runner.ts`, `src/engine.ts`, `src/config-resolver.ts`, `src/context.ts`, `src/render.ts`, ops modules, `src/errors.ts` (all error classes), `src/help.ts` (`VERSION`), with `@param`/`@returns` and an `@example` on `runner`; barrel `index.ts` gets per-export `@description` comments (config pattern); verify: `pnpm run doc` at the repo root generates `docs/modules/hygen.html` containing the descriptions

## 3. Package README restructure

- [x] 3.1 Restructure `packages/@biorate/hygen/README.md` per the `@biorate/config` template: Features, Installation, Quick start (CLI, condensed), new **Embedding API** section with a working `runner()` + minimal `RunnerConfig` example, new **Documentation** section linking the local `docs/` pages and the typedoc reference, Differences from upstream, License with fork attribution (fork of jondot/hygen v6.2.11, MIT, upstream source link); verify: the embedding example is valid TypeScript (check manually or compile the snippet in a scratch test)

## 4. docs/ full rewrite (fork semantics + attribution)

- [x] 4.1 Rewrite the core pages first: `quick-start.md` (CLI incl. `--version`), `templates.md` (frontmatter reference with all current options: `to`, `inject`, `before`/`after`/`prepend`/`append`/`at_line`, `skip_if`, `skip_if_not`, `create_if_missing`, `replace`, `eof_last`, `sh`, and escaping semantics — `<%= %>` is identity, no HTML escape); verify: every documented option matches `docs/templates.md` frontmatter table and the spec
- [x] 4.2 Rewrite the injection-related pages around fork semantics: anchors, the `InjectionAnchorNotFoundError` behavior on an unfound anchor, `create_if_missing`, `replace` (with `TemplateConfigError` guards), `skip_if`/`skip_if_not` idempotency; verify: examples match kitchen-sink fixtures behavior
- [x] 4.3 Rewrite the remaining pages (variables, helpers, prompts, shell, CLI reference, patterns/generators) for fork semantics; remove stale upstream references (dead hygen.io URLs) and add "based on" links to the corresponding upstream pages where a page descends from one; verify: no dead links remain in `docs/`
- [x] 4.4 Add fork attribution to every page (header line: part of @biorate/hygen, fork of jondot/hygen v6.2.11 MIT, upstream source URL) and an attribution/License note in the docs entry; verify: each page contains the attribution

## 5. Root README and final verification

- [x] 5.1 Add `[hygen](https://biorate.github.io/core/modules/hygen.html)` to the Modules list in the root `README.md` (alphabetical/near `i18n` position per existing ordering); verify: entry present, link format matches siblings
- [x] 5.2 Final verification: `pnpm --filter @biorate/hygen run build` and `run test` (60/60), `npx tsc -p tsconfig.json --noEmit` 0 errors, prettier/eslint clean over the package, root `pnpm run doc` completes, CLI smoke (`--version` exit 0, a generation run in a `/tmp/opencode` sandbox); verify: all green

## Workflow follow-up

- Run `openspec validate` before apply.
- Do not commit or publish without an explicit request from the author.
- Archive the change after the author's review.
