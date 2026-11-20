# Proposal

## Why

Parameter schemas today live only in per-action `hooks.ts` files (`static params`), so a value needed by every generator (root path, app name, environment) must be re-declared — and re-answered — in each action. A project-level parameter schema declared once in `.hygen.*` removes that duplication: shared parameters are asked exactly once per run and every action sees them.

## What Changes

- The project configuration (`ProjectConfig` / `RunnerConfig`) gains an optional `params` field — a declarative parameter schema (the same `ParamDescriptor[]` shape as `static params`), settable in `.hygen.*` and on the `HygenConfig` base class.
- The engine gains a **global prompt phase** run once per run, before the pair loop: global parameters are coerced from CLI flags and prompted exactly once (variant B — author decision), then merged into the base args so every pair, template and hook sees them without re-asking.
- When an action's `static params` declares a name that also exists in the global schema, the **action-level descriptor overrides the global one with a warning** (author decision) — consistent with the existing helpers/localsDefaults merge semantics.
- Global parameters follow the same rules as action parameters: type coercion, `required` empty-value rejection with TTY re-ask, `argCase` alias resolution (`root` ↔ `ROOT`), and validation.
- No change to actions without a global schema; runs without `params` in the project config behave byte-identically to today.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: new requirement for the global declarative parameter schema (declaration surface, once-per-run prompt phase, precedence and warning on name collisions, shared validation semantics).

## Impact

- `packages/@biorate/hygen/src/types/config.ts` — `params?: ParamsSchema` on `ProjectConfig` and `RunnerConfig`.
- `packages/@biorate/hygen/src/hygen-config.ts` — `params` field on the `HygenConfig` base class; carried into `toRunnerConfig()`.
- `packages/@biorate/hygen/src/engine.ts` — new global prompt phase before the pair loop; merged values into base args.
- `packages/@biorate/hygen/src/prompt.ts` (or `params-schema/`) — merge of global and action schemas with override + warning.
- `packages/@biorate/hygen/src/config-resolver.ts` — `params` accepted as a project-config key.
- Tests: engine-level (once-per-run, order), merge precedence, argCase, required-empty; docs `extensibility.md`.
- No breaking API changes; additive field only.
