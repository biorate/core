# Proposal

## Why

A `required` parameter of the declarative `params` schema currently accepts an empty answer: in a TTY, pressing Enter yields `''`, which passes both the prompt merge (`answered !== undefined`) and the post-prompt validation (`typeof '' === 'string'`). The same hole lets `--param=""` through from the CLI. Required fields therefore do not actually require a value, which produces broken generations (empty names, empty directories).

## What Changes

- Required schema parameters asked via a TTY prompt SHALL reject an empty (or whitespace-only) answer: enquirer's `validate` hook re-asks the same question with a "field is required" warning instead of accepting `''` (design decisions confirmed by the author: (1) CLI empty flags validated the same way as TTY answers, (2) whitespace-only counts as empty).
- `validateParams` SHALL treat `''` / whitespace-only as missing for a `required` parameter (`ParamRequiredError`), covering both paths uniformly.
- A `required: true` parameter of `type: 'boolean'` (`confirm`) SHALL NOT re-ask on Enter; the answered/default boolean is accepted as-is (author decision: "принимать как ответ") — an empty confirm answer resolves to `false` without a re-prompt loop.
- Behavior is unchanged for non-required parameters and for function-typed parameters.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: the declarative `params` schema requirement gains empty-answer semantics — a required parameter rejects empty/whitespace values with a re-asking prompt warning in TTY and a `ParamRequiredError` otherwise; boolean required parameters accept the answered/default value without re-asking.

## Impact

- `packages/@biorate/hygen/src/params-schema/prompts.ts` — attach a `validate` callback to generated questions for required string/number parameters.
- `packages/@biorate/hygen/src/params-schema/registry.ts` — `validateParams` empty-value rule for required parameters.
- Tests: `tests/` params-schema specs (new cases: empty Enter re-ask, whitespace-only, CLI `--param=""`, boolean required, non-required empty accepted).
- Docs: `docs/extensibility.md` (params section) — document the empty-value semantics.
- No breaking API changes; behavior tightens only where `required: true`.
