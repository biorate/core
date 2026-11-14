# Proposal

## Why

Action parameters (CLI flags and prompt answers) are currently untyped and undeclared: templates read whatever yargs-parser happened to produce (`'5'` stays a string or silently becomes a number, `--flag` is boolean by accident), and prompt questions are hand-written in hook modules with no shared source of truth. Authors of generators must re-implement validation and prompt wiring for every action.

## What Changes

- Add a declarative parameter schema for action hook modules: a class-based `hooks.ts` (kind `class`) may export a `params` array of parameter descriptors (`name`, `type`, `required`, `default`, `message`).
- Supported built-in `type` values: `'string'` (default), `'number'`, `'boolean'`. A `type` may also be a **function** — the parameter value becomes the function's result (inline custom type). An unknown string type fails at hook load time with the field name in the error.
- From the schema the engine: coerces CLI flag values, builds prompt questions from descriptors (`message`, `default`, prompt input kind derived from type) for required parameters that were not supplied via flags (already-supplied parameters are not asked again), and validates values after prompting.
- Internal type registry (coerce + check + prompt kind per type) — no public type-extension API in this change; function types cover customization.
- Actions without a `params` export keep the existing prompt/argument behavior byte-for-byte.
- Add an optional `argCase` runner-config option for CLI flag key normalization (`'keep'` default — no behavior change; `'upper-underscore'` maps `--my-flag` to `MY_FLAG`).
- Resolve the export-name collision between the new `params` declaration and the legacy `params(...)` function in legacy hook modules by kind (`class` vs `legacy`) in the hook resolver.
- No changes to the public package entry (`src/index.ts`) beyond new exported types.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: new requirement — declarative action parameter schema (`params` export: typed coercion, required handling, prompt generation, validation); new requirement — optional `argCase` flag-key normalization runner-config option.

## Impact

- `packages/@biorate/hygen/src/` — hook resolution (`prompt.ts`), the per-pair prompt/execute pipeline (`engine.ts`), argument parsing (`params.ts`, `argCase`), new internal module for the parameter schema engine (registry + coerce + validate + question building).
- Public surface: new exported descriptor/registry types from `src/index.ts`; `RunnerConfig` gains `argCase`.
- No new dependencies; no database/system integrations; docs (`docs/extensibility.md` or equivalent) describe the schema.
- SemVer: new feature, minor bump (no breaking change: default behavior without `params`/`argCase` is unchanged).
