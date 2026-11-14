# Tasks

## 1. Engine helper provider

- [x] 1.1 In `src/engine.ts`, remove the bootstrap resolution (`const hookHelpers = context({}, config).h`, line ~129) and add the run-scoped memoized provider `getHookHelpers()` that calls `context({ _: base._, ...cleanArgv }, config).h` only on demand; verify with `pnpm --filter @biorate/hygen run build:types` (or `npx tsc -p ./tsconfig.build.types.json` in the package).
- [x] 1.2 Add a regression test in `tests/` (new fixture project with a throwing-on-missing-positionals function-form `helpers` factory and a run with no hooks): assert the run renders and the factory is invoked only with each render's locals; verify with `npx vitest run tests/<new spec>.spec.ts`.

## 2. Hook context laziness

- [x] 2.1 In `src/engine.ts`, make `makeCtx` expose `h` as a getter backed by `getHookHelpers()` instead of a stamped value; verify the existing hook suites stay green with `npx vitest run tests/hooks-lifecycle.spec.ts tests/hooks-errors.spec.ts tests/hooks-project.spec.ts tests/hooks-runner.spec.ts`.
- [x] 2.2 Add hook tests (new fixture/spec) asserting: a hook reading `ctx.h` gets factory output resolved from CLI args including positionals under `_`; a run whose hooks never read `h` performs no factory call outside rendering; several hooks of one run share a single resolution (factory called once, identical namespace); verify with `npx vitest run tests/<new spec>.spec.ts`.
- [x] 2.3 Update TSDoc for `HookContext.h` and `RunnerConfig.helpers` in `src/types.ts` to state resolution timing and the re-entrancy/no-per-template-data contract; verify with `pnpm --filter @biorate/hygen run build:types`.

## 3. Prompt helper laziness

- [x] 3.1 In `src/prompt.ts`, widen the `options.h` type to `Helpers | (() => Helpers)` and pass a getter to a class `prompt` section when a factory is supplied (plain values pass through unchanged; the legacy `params` path still receives built-in helpers); verify with `npx vitest run tests/hooks-runner.spec.ts tests/engine.spec.ts`.
- [x] 3.2 Add a test asserting a class `prompt` section that reads `h` receives factory output resolved from CLI arguments, and that resolution happens only when the section exists; verify with `npx vitest run tests/<spec covering prompt>.spec.ts`.

## 4. Documentation contract

- [x] 4.1 Rewrite the Function form guidance in `docs/extensibility.md` (replacing the inaccurate "evaluated per run" wording) and the hooks `ctx` field description: one call per rendered action with that action's locals, lazily once per run with CLI arguments for hook contexts and the class `prompt` section, factory must be re-entrant and must not depend on per-template or prompt-provided values; verify by reading the section and grepping that no empty-locals tolerance requirement remains (`grep -n "empty locals" docs/extensibility.md`).

## 5. Integration verification

- [x] 5.1 Run the package suite and static checks: `pnpm --filter @biorate/hygen run test`, `pnpm --filter @biorate/hygen run lint`, `pnpm --filter @biorate/hygen run format`; verify all pass (format applies to `src`, so tests are checked by the suite only).
- [x] 5.2 Run `openspec validate fix-hygen-helpers-call-contract` and confirm the change validates; confirm `pnpm --filter @biorate/hygen run build` succeeds.

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- Ensure the next `lerna version` release note mentions the 0.3.0 bootstrap-factory regression and the hook `ctx.h` resolution change (suggested 0.4.0).
