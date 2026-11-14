# Tasks

## 1. Public types and errors

- [x] 1.1 Add `HookContext`, `HookMethod`, `ActionHooks`, `ProjectHooks` to `src/types.ts` and `hooks?: ProjectHooks` to `RunnerConfig`, with TSDoc matching the design's field list; verify with `pnpm --filter @biorate/hygen run build:types`.
- [x] 1.2 Add `HookModuleError` (missing/invalid default class export, message names the file and the expected shape) and `HookTsNodeError` (ts-node registration failure, wrapping the cause like `ConfigTsNodeError`) to `src/errors.ts`, both extending `BaseError` from `@biorate/errors`; verify with a small `tests/errors.spec.ts` asserting `instanceof BaseError` and that the message contains the file path.

## 2. Action hook resolution and the prompt section

- [x] 2.1 Extend the candidate list in `src/prompt.ts` to `hooks.ts`, `hooks.js`, `hooks.mjs`, `hooks.cjs` followed by the legacy list, and add `resolveActionHooks(actionfolder, cache)` that returns `{ instance, kind }`, instantiates a class `default` export exactly once per cache key, lazily registers `ts-node/register/transpile-only` for `.ts`, and throws `HookModuleError` for a missing or non-class default export; verify with `tests/hooks-resolve.spec.ts` covering the full priority order (a `hooks.ts` beats an existing `prompt.js`), `.js`/`.mjs`/`.cjs` loading, and the invalid-module error.
- [x] 2.2 Wrap legacy modules (`index.*`, `prompt.*`) in a prompt-only adapter so their `params` / `prompt` / question-array behavior is unchanged and the four lifecycle methods are absent; verify with `tests/hooks-resolve.spec.ts` legacy cases plus the existing `tests/engine.spec.ts`, `tests/params.spec.ts` and `tests/picker.spec.ts`.
- [x] 2.3 Keep `prompt()`'s signature and behavior, delegating to `resolveActionHooks(...).instance`, and accept the optional resolved helper namespace for the class `prompt({ prompter, args, h })` section; verify with a `tests/hooks-resolve.spec.ts` case where the class prompt section supplies `{ componentName: 'button' }` and the rendered output contains `button`.
- [x] 2.4 Document the action hook file names, priority order, class contract, prompt section and "one instance per action run / state across pairs" in `docs/extensibility.md`, and point `docs/prompts.md` at the class prompt section while marking `prompt.js` as supported legacy; verify with `pnpm --filter @biorate/hygen run docs` and check the generated page contains the new section.

## 3. Project-level hooks

- [x] 3.1 Accept the merged `hooks` object from `.hygen.*` in the runner configuration, keep only function-valued `beforeAll`/`beforeEach`/`afterEach`/`afterAll`, and `logger.warn` about ignored entries instead of throwing; verify with `tests/hooks-project.spec.ts` covering a config file that exports hooks, nearest-directory precedence, and a non-function value being ignored with a warning.
- [x] 3.2 Document project-level hooks (the `hooks` object in `.hygen.*`, same four methods, plain object instead of a class, closure-based state) in the project-config section of `docs/extensibility.md`; verify with `pnpm --filter @biorate/hygen run docs` and check the generated page shows the `hooks` field example.

## 4. Lifecycle wiring and composition

- [x] 4.1 Build the `HookContext` in `src/engine.ts` (cwd, templates, generator, action, subaction from `action.split(':')`, name, args before prompt answers, `h` resolved as `context()` builds it, logger, `dry`), thread the per-`engine()`-call hook cache into the pair loop, and invoke `beforeEach` before the prompt phase and `afterEach` with the pair's `ActionResult`s after execution; verify with `tests/hooks-lifecycle.spec.ts` recording a call log for one action × one name in the exact order `project.beforeAll`, `action.beforeAll`, `project.beforeEach`, `action.beforeEach`, prompt, generation, `action.afterEach`, `project.afterEach`, `action.afterAll`, `project.afterAll`.
- [x] 4.2 Run `beforeAll`/`afterAll` once per action (lazily on the action's first pair, after its last pair) and once per run for project hooks, leaving the existing name-outer × action-inner loop untouched; verify with `tests/hooks-lifecycle.spec.ts` cases for two names (pair hooks twice, all-hooks once) and two actions (per-action `beforeAll`/`afterAll` once each), plus an instance-counter case proving state carries across pairs.
- [x] 4.3 Document the ordering and composition rules with the ordering diagram and a stateful example in `docs/extensibility.md`; verify with `pnpm --filter @biorate/hygen run docs` and check the generated page contains the diagram text.

## 5. Failure semantics and dry mode

- [x] 5.1 Implement the failure rules in `src/engine.ts`: a throwing `beforeAll` skips and `failed`-marks the pairs it guards while its matching `afterAll` still runs; a throwing `beforeEach` skips and `failed`-marks that pair while both `afterEach` levels still run; throwing `afterEach`/`afterAll` fail the run; pair-attributable failures use the pair's `action`/`name`, run-scoped ones use `action: '*'` with no `name`; single pair × single action rethrows the original error unchanged, `--keep-going` collects into `failures` and continues, otherwise `ShowHelpError` carries the pair label; verify with `tests/hooks-errors.spec.ts` covering each case and asserting the exact `statuses`/`failures` entries.
- [x] 5.2 Run lifecycle hooks unchanged in `--dry` mode, expose `ctx.dry`, and write no files; verify with a `tests/hooks-errors.spec.ts` case where `--dry` still logs `beforeAll`/`beforeEach`/`afterEach`/`afterAll` with `dry === true` and the cwd gains no generated files.
- [x] 5.3 Document the failure table, the `'*'` run-scope sentinel and dry-mode behavior in `docs/extensibility.md`; verify with `pnpm --filter @biorate/hygen run docs` and check the generated page contains the failure table.

## 6. Integration checks

- [x] 6.1 Add a `tests/hooks-runner.spec.ts` that calls the embeddable `runner()` with a config carrying project hooks and a fixture action with `hooks.ts`, asserting the hooks fire and that a failed hook yields `success: false` with the expected `failures`/`statuses`; verify with `npx vitest run tests/hooks-runner.spec.ts`.
- [x] 6.2 Run the whole package gate — `pnpm --filter @biorate/hygen run test`, `run lint`, `run format`, `run build` — and confirm they pass with no changes to existing snapshots; update snapshots only where the new hook logging is genuinely expected and call that out in the change summary.
- [x] 6.3 Build the docs site once more and confirm `docs/extensibility.md` and `docs/prompts.md` render without broken anchors in the generated output; verify with `pnpm --filter @biorate/hygen run docs` and inspect the generated pages.

## Workflow follow-up

- Archive the change with `/opsx-archive` after review; the archive step syncs the `hygen-generator` delta into `openspec/specs/hygen-generator/spec.md`.
- Verify the archived main spec contains the new `Action hooks file resolution` and lifecycle requirements and the modified `Interactive prompts` / `Project configuration file` text.
