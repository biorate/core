# Design

## Context

`config.helpers` (plain object or `(locals, config)` function) is merged over built-ins
into the template's `h` namespace (`src/context.ts`), and the project config file
(`.hygen.js` family) feeds `RunnerConfig`. Behavior is complete and tested; only
documentation lags. This change is docs-only by design — approved in explore.

## Goals / Non-Goals

**Goals:**

- Make library injection discoverable: lodash example, `@biorate/*` sibling example,
  function-form lazy resolution with friendly missing-library error.
- State the installation requirement explicitly (library must be a dependency of the
  project where the runner executes).

**Non-Goals:**

- No `requires: [...]` config sugar for auto-requiring libraries (rejected in explore:
  saves two lines of `require`, adds resolution ambiguity and indirect failures).
- No lazy-loading infrastructure, no changes to helper merge order.
- No new code or tests beyond doc verification.

## Decisions

### 1. Docs live in `extensibility.md` (single source)

The helpers section already exists there; extend it rather than creating a new page. FAQ
gets a one-entry pointer. README table row already mentions helpers — untouched.

### 2. Show both forms, recommend the right one

Plain object for static libraries (one `require` at config load); function form
`(locals, config) => ({...})` for lazy resolution — the docs example wraps `require` in
try/catch and throws a friendly error naming the missing package. Rationale: the friendly
error pattern is cheap, teaches the mechanism, and avoids committing to infrastructure.

## Risks / Trade-offs

- Doc rot: examples reference lodash as a dev-dependency of the reader's project; the
  installation requirement is stated in the section to prevent copy-paste failures.
