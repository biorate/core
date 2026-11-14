# Design

## Context

`add-hygen-params-schema` (implemented, committed `d2a4357ef`, not yet released) reads the parameter schema from a module-level `export const params` in class hook modules. Exploration concluded the declaration belongs on the hooks class itself as `static params`: one export per action file, no name collision with the legacy `params()` function, schema co-located with the behavior it drives. The feature is unreleased, so reshaping now avoids a breaking change.

## Goals / Non-Goals

**Goals:**

- Single declaration site: `static params` on the default-exported hooks class.
- Same validation timing (load time, before any pair runs) and same engine behavior.
- Update every declaration example: docs, fixture, tests, main spec wording.

**Non-Goals:**

- No support for the module-level `export const params` form (single way to declare).
- No changes to the schema engine (`src/params-schema/`), descriptor shape, `argCase`, or public types.

## Decisions

- **Read `static params` off the default export.** In `loadResolvedHooks` (class branch), the schema is `validateParamsSchema((exported as any).params)` — the class constructor's static member — replacing the `(module as { params?: unknown }).params` read. Static members are available without instantiation, so load-time validation still happens before any instance exists and unknown string types still fail at load with the parameter name.
- **Validation order unchanged.** The instance is still constructed as today; the schema extraction happens in the same `loadResolvedHooks` step, so a schema error and a constructor error keep their current precedence (constructor error is thrown first if both are broken — acceptable, both fail the run before pairs execute).
- **Single form, no fallback.** The module-level `params` export is not read at all; supporting both would double the documented surface for a feature that has shipped to no one.
- **`static readonly params: ParamsSchema` recommended in docs** — gives descriptor typing through the public `ParamsSchema` type.

## Risks / Trade-offs

- In-flight consumers of the previous form (only this repo's docs/fixtures) must be updated in the same change — tracked in tasks.
- `static params` on a JS class is equally supported, but the docs examples stay TypeScript-first per package convention.
