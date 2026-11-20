# Tasks

## 1. Config surface

- [x] 1.1 Add `params?: ParamsSchema` to `ProjectConfig` and `RunnerConfig` in `src/types/config.ts`.
- [x] 1.2 Add the `params` field to the `HygenConfig` base class (`src/hygen-config.ts`) with a neutral default and carry it into `toRunnerConfig()`.
- [x] 1.3 Accept `params` as a project-config key in `src/config-resolver.ts`; validate the global schema with `validateParamsSchema` at resolution time (unknown types fail naming the parameter).

## 2. Engine: global prompt phase

- [x] 2.1 In `src/engine.ts`, run the global phase once per run before the pair loop: `promptFromParams(config.params ?? [], createPrompter, baseArgs)` and merge resolved values into the base args seeding each pair.
- [x] 2.2 At the action prompt phase, build the effective schema as global (minus shadowed names) + action params; when a name exists on both levels, log a warning naming the parameter and both levels, action descriptor wins.

## 3. Tests

- [x] 3.1 Engine: global required parameter prompted exactly once across a multi-pair action list; every pair's template/hook sees the value.
- [x] 3.2 Engine: global parameter supplied as a flag (`--root /srv`) is never asked.
- [x] 3.3 Merge: action descriptor with the same name overrides the global one with a warning; other actions keep the global descriptor.
- [x] 3.4 argCase: global `root` under `argCase: 'upper-underscore'` resolves `--root /srv` via the `ROOT` alias; value exposed under both keys.
- [x] 3.5 Required-empty: empty Enter on a required global parameter re-asks with the warning; whitespace-only flag fails with `ParamRequiredError`.
- [x] 3.6 Resolution: unknown type in the global schema fails naming the parameter; config without `params` leaves behavior unchanged (existing suite stays green).
- [x] 3.7 Class config: `params` declared on a `HygenConfig` subclass reaches the global phase via `toRunnerConfig()`.

## 4. Docs

- [x] 4.1 `docs/extensibility.md`: document the global `params` declaration in `.hygen.*`/`HygenConfig`, the once-per-run phase and its position in the lifecycle, and the override-with-warning rule.

## 5. Verification

- [x] 5.1 `pnpm --filter @biorate/hygen run test` — full suite green.
- [x] 5.2 Manual e2e: fixture project with `.hygen.ts` global params (multi-action run prompted once; flag path; argCase path).
- [x] 5.3 `openspec validate hygen-global-params --strict` passes.
