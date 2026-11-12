# Design

## Context

The ops pipeline resolves an ordered op list per rendered action (`ops/index.ts`) and executes it; the engine aggregates results and failures. `RunnerResult.failures` exists; there is no per-action status model. Glob actions (add-hygen-glob-actions) expand into file actions before op execution, so skip must be evaluated per rendered action to work for both.

## Goals / Non-Goals

**Goals:**

- Declarative, template-rendered skip condition — no code in the generator, in line with hygen's file-based model.
- Clean three-state outcome: ok / skipped / failed, visible in `RunnerResult`.
- Skip works for every op kind, evaluated before any op runs.

**Non-Goals:**

- Function-form `skip(answers)` callbacks (plop's exact API) — not our model; EJS rendering covers the same cases.
- Prompt-conditioned action lists (plop's dynamic actions array) — the declarative skip covers the dominant use case.

## Decisions

- **`skip:` rendered with EJS like any frontmatter attribute.** Truthiness: empty string and literal `false` are falsy; `true` and any other non-empty string are truthy, with non-`true` strings used as the log reason. This gives both a flag and a reason in one attribute.
- **Skip evaluation in `render.ts`, enforcement in `ops/index.ts`.** Rendering computes the value once; op resolution short-circuits to an empty op list for skipped actions, so no op ever starts (shells never spawn).
- **Status model in `types.ts`/`engine.ts`:** introduce `ActionStatus = 'ok' | 'skipped' | 'failed'` and per-action status in the runner result. `failures` retains only `failed` entries — the existing shape stays compatible; new status info is additive.
- **Fail-fast semantics:** skipped is not a failure, so the abort path ignores it.
- **Logging:** skipped actions print a distinct line (with reason when present) through `logger.ts`.

## Risks / Trade-offs

- EJS-rendered truthiness strings are a convention, not types; documented clearly and tested (e.g., rendering to `0` is truthy — deliberate, keeps semantics simple).
- Downstream consumers of `RunnerResult` see a new field; additive change, minor version.
