# Tasks

## 1. Validation layer (`registry.ts`)

- [x] 1.1 Add an `isEmptyValue` helper (`value === undefined || String(value).trim() === ''`) in `params-schema/registry.ts`.
- [x] 1.2 In `validateParams`, treat a required parameter with an empty value as missing: throw `ParamRequiredError(descriptor.name)`; skip the empty rule for boolean-typed descriptors (`required` boolean accepts the answered/default value).

## 2. Prompt layer (`prompts.ts`)

- [x] 2.1 In `promptFromParams`, attach a `validate` callback to generated questions for required parameters whose prompt kind is `input` or `numeral`: return `true` for non-empty values, otherwise the warning `Field "<name>" is required`.
- [x] 2.2 Keep boolean (`confirm`) questions without a `validate` hook; keep the answer merge as-is (`undefined` answers fall back to `initial`).

## 3. Tests (`tests/params-schema*.spec.ts`)

- [x] 3.1 Unit: `validateParams` — required string with `''` and whitespace-only throws `ParamRequiredError`; CLI-flag path covered by the same call.
- [x] 3.2 Unit: required boolean with `false` / empty answer passes validation without error.
- [x] 3.3 Unit: non-required string with `''` passes validation (no rejection).
- [x] 3.4 Integration (fake prompter): empty Enter on a required string re-asks — the fake prompter returns `''` on the first call and a real value on the second; assert two prompt invocations for the same question, warning surfaced, run succeeds with the final value.
- [x] 3.5 Integration: re-asked question preserves `message` and `initial` from the descriptor.
- [x] 3.6 Integration: required number with empty answer re-asks; whitespace-only string flag `--param="  "` fails with `ParamRequiredError`.

## 4. Docs

- [x] 4.1 Update `docs/extensibility.md` params section: document empty-value semantics (empty/whitespace = missing for required, TTY re-ask with warning, boolean accepted as-is).

## 5. Verification

- [x] 5.1 `pnpm --filter @biorate/hygen run test` — full suite green.
- [x] 5.2 Manual e2e in a fixture project: TTY run pressing Enter on a required field re-asks with the warning; `--param=""` fails with `ParamRequiredError`; `npx hygen --version` unaffected.
- [x] 5.3 `openspec validate --strict` passes for the change.
