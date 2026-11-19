# Design

## Context

The `params` schema pipeline lives in `packages/@biorate/hygen/src/params-schema/`:
`prompts.ts` builds enquirer questions for required parameters missing from CLI args
and merges answers, `registry.ts` owns coercion (`coerceParam`) and validation
(`validateParams` / `checkParam`). Today `required` is only an absence check
(`value === undefined`); enquirer returns `''` for Enter on an `input` question, and
`typeof '' === 'string'` passes `checkParam` — so empty answers sail through both
layers. See proposal.md — Why.

## Goals / Non-Goals

**Goals:**

- Empty and whitespace-only values never satisfy a `required` parameter, on both the
  TTY prompt path and the CLI flag path.
- In a TTY the user gets an immediate, in-place re-ask with a "field is required"
  warning — no process-level error for the interactive case.
- Uniform semantics: one rule in `validateParams`, one validator on prompt questions.

**Non-Goals:**

- No per-parameter custom validators in the descriptor API (a future extension).
- No changes to non-required parameters, function-typed parameters, or legacy
  (`prompt.js` / question-array) hook shapes.
- No changes to the picker or to non-schema prompting paths.

## Decisions

- **Enquirer `validate` callback for the re-ask loop.** For required string/number
  parameters, `promptFromParams` attaches `validate: (v) => nonEmpty(v) || '<warning>'`
  to the generated question. Enquirer re-renders the same question on a failed
  validation and shows the returned message — the "warn and re-ask" loop is native,
  no hand-rolled retry code. _Alternative considered:_ post-hoc retry loop around
  `prompter.prompt` — rejected: more state, duplicated rendering, and the message
  would not appear inline in the prompt UI.

- **Empty-rule lives in `validateParams`, shared by both paths.** A required value of
  `undefined`, `''`, or whitespace-only fails with `ParamRequiredError`. This covers
  the CLI flag path (`--param=""` — currently accepted) and acts as a safety net under
  the prompt validator. _Alternative considered:_ empty check only in the prompt layer
  — rejected: leaves the flag path inconsistent, and the author confirmed both paths
  must behave the same.

- **Whitespace-only counts as empty.** The emptiness test is
  `String(value).trim() === ''` (author-confirmed). Rationale: a whitespace answer is
  never a meaningful identifier, and templates interpolate it verbatim.

- **Boolean/`confirm` required parameters never re-ask.** Enquirer's confirm resolves
  Enter to the default (or `false`); re-asking on an empty confirm would loop or nag
  pointlessly (author decision: "принимать как ответ"). So the prompt `validate` hook
  is attached only for `input`/`numeral` kinds (`promptTypeOf`), and `validateParams`
  skips the empty-rule for boolean-typed descriptors.

- **Warning message.** `Field "<name>" is required` — parameter name, matches the
  existing `ParamRequiredError` naming style. A descriptor `message` customizes the
  question text but not the required-warning (keeps the warning uniform).

## Risks / Trade-offs

- **Behavior tightening:** scripts that relied on `--param=""` passing for required
  string parameters will now fail. Mitigation: it never produced a useful generation;
  the failure names the parameter explicitly.
- **Function-typed parameters keep `typeof value === 'function'`-style pass-through**
  (`checkParam` returns `true`), so a function type resolving to `''` still passes.
  Accepted: the function type is the author's own resolution logic.
- **Prompter variance:** the `validate` contract assumes an enquirer-compatible
  prompter (the embeddable `createPrompter` default). Custom prompters that ignore
  `validate` degrade gracefully — the prompt validator is skipped, but
  `validateParams` still rejects the empty answer with `ParamRequiredError`.
