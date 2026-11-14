# Design

## Context

The engine's per-pair pipeline (`src/engine.ts`) resolves action hooks (`src/prompt.ts`, `resolveActionHooks`, cached per action folder), runs the prompt phase (`prompt()` consuming legacy `params()` functions or class `prompt` sections), then renders and executes. CLI flags arrive through `yargs-parser` in `src/params.ts` as `cleanArgv` and are spread into template locals via `src/context.ts`. Types today are whatever yargs produces implicitly; prompt questions are hand-written. `@biorate/auto-object` was evaluated as a validation engine and rejected: its class+decorator model does not fit a declarative array exported from a template hook module, its `merge()`-based mutation is unnatural for CLI locals, and its global schema registry and error taxonomy (`CommonFactoryValidationError`, status 400) collide with hygen's own `errors.ts` conventions.

## Goals / Non-Goals

**Goals:**

- One declaration source per action: `params` export in class `hooks.ts` drives coercion, prompting, and validation.
- Zero behavior change for actions that do not export `params` (byte-identical prompting/argument handling).
- Extensible types without a public extension API: internal type registry + function-typed parameters.
- Early failure for authoring mistakes (unknown string type detected at hook load, not at run).

**Non-Goals:**

- No public `paramTypes` runner-config API for registering custom named types (function types cover customization; revisit on demand).
- No nested/object parameter types, async validators, or cross-parameter rules.
- No change to the legacy `prompt.js`/`index.js` hook flow, the interactive picker, or `render.ts`.
- No breaking changes to flag-key naming (`argCase` defaults to `'keep'`).

## Decisions

- **Descriptor array over class-based schema (auto-object rejected).** The declaration lives as plain data next to the hook class, works in `.js` and `.ts` hooks, and maps 1:1 onto prompter questions. Validation/coercion is implemented natively (~50–60 lines) against hygen's error taxonomy; see Context for the auto-object rejection rationale.
- **Internal type registry.** `src/params-schema/` (new module) holds a `Record<string, TypeDef>` where `TypeDef = { coerce, check, promptType }`. Built-in entries: `string`, `number`, `boolean`. Resolution order for `type`: registry entry → function → unknown-string error at hook load. The registry is module-private; a function `type` in a descriptor is the customization path (value = function result).
- **Pipeline placement: coerce before prompts, validate after.** Per pair: `cleanArgv` flags → coerce by descriptor → prompt phase builds questions only for descriptors whose parameter is absent after coercion (question fields: `name`, `type: promptType`, `message`, `initial: default`) → post-prompt validation of required/supplied values → merged into the locals the pair already passes to `context()`. Coercion-before-prompting lets prompts echo the declared type's input kind and avoids asking for flags already given.
- **Class-kind only.** The `params` export is honored when `resolveActionHooks` reports `kind: 'class'`. Legacy modules keep their `params(...)` function untouched — the collision is resolved structurally by kind, no rename and no per-module sniffing.
- **`argCase` in `params.ts`, applied once.** Flag-key normalization runs right after `yargs` parsing (before `cleanArgv` is consumed anywhere), so `prompt`, `engine`, and `context` see already-normalized keys. Reserved keys (`_`, `ts`, `name`, `generator`, `action`) are excluded. Values: `'keep'` (default, no-op) and `'upper-underscore'` (`kebab/camel` → `UPPER_UNDERSCORE`).
- **Errors.** New error classes in `src/errors.ts` per repo conventions: coercion failure, required-missing, and unknown-type (load-time) each name the parameter; all extend `BaseError`.
- **Types export.** `ParamDescriptor` and related types go to `src/types/` (new domain file, e.g. `params-schema.ts`) consistent with the recent types-directory refactor; `RunnerConfig` gains `argCase?: 'keep' | 'upper-underscore'`.

## Risks / Trade-offs

- **Descriptor/prompter impedance mismatch:** prompters vary (enquirer select/input/numeral). The design maps a type to a _prompt input kind_ only; embedder prompters that ignore the kind still work because validation re-checks the answered value.
- **Coercion vs yargs implicit parsing overlap:** yargs already turns `--count 3` into a number; the schema layer must be idempotent over already-typed values (coerce accepts native values as-is) so behavior stays predictable regardless of yargs parsing.
- **Function types execute author code during coercion:** same trust model as hook classes themselves (they already run arbitrary code); errors are wrapped with the parameter name, not swallowed.
- **`argCase: 'upper-underscore'` can shadow reserved locals** (a flag literally named `--NAME`) — mitigated by excluding reserved keys from normalization; a genuinely colliding normalized key overrides the flag value into `cleanArgv`-derived locals, documented behavior.
- **SemVer:** minor bump; default paths (`'keep'`, no `params` export) are byte-compatible.
