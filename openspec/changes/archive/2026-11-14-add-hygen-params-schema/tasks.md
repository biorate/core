# Tasks

## 1. Types and errors

- [x] 1.1 Add `ParamDescriptor` (and related types: `ParamType`, descriptor array alias) to a new `src/types/params-schema.ts` domain file, re-exported from `src/types/index.ts`; add `argCase?: 'keep' | 'upper-underscore'` to `RunnerConfig` in `src/types/config.ts`; verify with `npx tsc -p tsconfig.json --noEmit` in the package.
- [x] 1.2 Add error classes to `src/errors.ts` per repo conventions (extend `BaseError`): parameter coercion failure (names parameter + expected type), required-parameter-missing (names parameter), unknown-parameter-type (names parameter + the unknown string type); verify with `npx tsc -p tsconfig.json --noEmit`.

## 2. Parameter schema engine

- [x] 2.1 Create `src/params-schema/` with the internal type registry (`string`, `number`, `boolean` entries: `coerce`, `check`, `promptType`), type resolution (registry entry → function → unknown-string error), and idempotent coercion (native values pass through unchanged); unit tests for each built-in type and for function types (result becomes the value; thrown error surfaces with the parameter name); verify with `npx vitest run` on the new spec and `npx tsc -p tsconfig.json --noEmit`.
- [x] 2.2 Implement prompt-question building from descriptors (only for parameters absent after coercion; question fields `name`, prompt input kind from `promptType`, `message`, `initial: default`) and post-prompt validation (required-missing error names the parameter); unit tests: supplied params not asked again, missing required prompts then validates; verify with targeted `npx vitest run`.
- [x] 2.3 Implement hook-load-time schema validation: a descriptor with an unrecognized string `type` fails when the action's hooks load, naming the parameter; verify with a targeted spec.

## 3. Pipeline integration

- [x] 3.1 Wire the schema into the per-pair pipeline in `src/engine.ts` / `src/prompt.ts`: class-kind hooks with a `params` export get coerce → prompt → validate; legacy modules and class modules without `params` keep the existing flow byte-for-byte; verify with `npx vitest run tests/hooks-lifecycle.spec.ts tests/hooks-runner.spec.ts tests/engine.spec.ts` and a new integration spec covering an action with `params` end-to-end (flags, prompt, template locals).
- [x] 3.2 Implement `argCase` in `src/params.ts` right after `yargs` parsing (`'keep'` default no-op; `'upper-underscore'` normalizes hyphen/camel flag keys to `UPPER_UNDERSCORE`; reserved keys `_`, `ts`, `name`, `generator`, `action` excluded); verify with a new spec in `tests/` covering keep/normalize/reserved cases and `npx vitest run tests/params.spec.ts`.

## 4. Public surface and docs

- [x] 4.1 Export the new public types (`ParamDescriptor` etc.) from `src/index.ts` keeping the existing export list otherwise unchanged; verify with `npx tsc -p tsconfig.json --noEmit` and a grep that no other entry exports changed.
- [x] 4.2 Document the `params` schema and `argCase` in the package docs (the same place the hook/`h` contract is documented); mention the class-kind-only rule and the reserved-keys exclusion.

## 5. Integration verification

- [x] 5.1 Static checks: `pnpm --filter @biorate/hygen run lint` and `pnpm --filter @biorate/hygen run format` pass with no new errors.
- [x] 5.2 Full verification: `pnpm --filter @biorate/hygen run test` (all files green), `npx tsc -p tsconfig.json --noEmit`, `pnpm --filter @biorate/hygen run build`, and `openspec validate add-hygen-params-schema`.

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- Version bump stays with `npx lerna version` (minor, feature release).
