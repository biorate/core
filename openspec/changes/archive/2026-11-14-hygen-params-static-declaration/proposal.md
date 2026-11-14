# Proposal

## Why

The declarative parameter schema added in `add-hygen-params-schema` is exported as a module-level `export const params` beside the default-exported hooks class. This splits one action's declaration across two exports, and the `params` name collides with the legacy `params(...)` function contract in legacy hook modules (resolved structurally by kind). Since the feature has not been released yet (no version bump), now is the only window to reshape the declaration without a breaking change.

## What Changes

- **BREAKING** (unreleased feature reshape): the parameter schema moves from a module-level `export const params` to a `static params` member of the default-exported hooks class. The module-level `params` export is no longer read; a class hook module declares its schema as `static params = [...]` on the hooks class.
- Hook loading reads the schema from the default-exported class (`module.default.params`), validated at load time as before (unknown string types fail with the parameter name).
- The kind-based collision with legacy `params(...)` functions disappears: legacy modules have no hooks class, so there is a single declaration site.
- Fixture, tests, docs (`extensibility.md`, `prompts.md`, README table row) and the archived change's example in `hygen-generator` spec wording are updated to the static form.
- No changes to the schema engine itself (`src/params-schema/`), the pipeline, `argCase`, or the public types.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: requirement "Declarative action parameter schema" — the declaration site changes from a module-level `params` export to a `static params` member of the default-exported hooks class.

## Impact

- `packages/@biorate/hygen/src/prompt.ts` — schema extraction in `loadResolvedHooks` (read `static params` off the class instead of the module export).
- `packages/@biorate/hygen/tests/` — the `params-schema` fixture hooks module and specs.
- `packages/@biorate/hygen/docs/` and `README.md` — declaration examples.
- `openspec/specs/hygen-generator/spec.md` — requirement wording.
- SemVer: no released version carries the old form, so this is not a runtime breaking change; commit-history breaking note only.
