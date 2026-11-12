# Design

## Context

`--name` is parsed by `yargs-parser` into `cleanArgv.name` and merged into `args.name`
in `src/params.ts`, where the positional name (spread later) overrides it. The
composition change (`add-hygen-template-composition`) already rejects repeated `--name`
flags; this change removes the flag route entirely, leaving positional lists as the only
name input. This change depends on the composition change being implemented first.

## Goals / Non-Goals

**Goals:**

- Single-path CLI grammar for names: positional, optionally comma-listed.
- Loud, helpful failure on `--name` (no silent ignore, no silent fallthrough).
- One migration period via an opt-in legacy escape (env + embedder config).

**Non-Goals:**

- No deprecation-warning period (a hard, well-explained error was chosen over a warning
  cycle — the escape hatch covers gradual migration).
- No removal of other flags (`--entity`-style data flags are template variables and
  stay untouched).
- No changes to positional resolution or the bare-variant existence rule.

## Decisions

### 1. Detection in `params.ts`, dedicated error

`params` checks the parsed argv for a `name` key before positional merge. Present and
no legacy escape → throw a dedicated standardized error (`NameFlagRemovedError`,
BaseError family) whose message shows: the offending invocation, the positional
equivalent, and the legacy escape names. Dedicated class (not generic) so embedders can
catch and map it.

### 2. Two-gate legacy escape, single implementation

Legacy mode = `process.env.HYGEN_LEGACY_NAME === '1'` OR
`RunnerConfig.legacyNameFlag === true`. When active, `--name` flows through the
pre-composition path (single value; repeated flags behave as before this change — the
array accident is intentionally preserved under the escape to avoid a second behavior
change inside the migration window). When both gates are absent, the flag errors.
The gate lives in the composition change's expansion input builder: legacy mode consumes
`cleanArgv.name` as a single-element name list.

**Alternative rejected:** config-file-based escape (`.hygen.*`) — rejected: the flag is
an invocation-level concern; an env/config gate is per-process/per-embedder and matches
existing `HYGEN_*` conventions.

### 3. Docs sweep is part of the definition of done

Every `--name` example in the package (README embedding example, `quick-start.md`,
`generators.md`, `prompts.md`, `faq.md`) is rewritten to positional form in the same
change — a removal with stale examples shipped is worse than the removal itself.

## Risks / Trade-offs

- Breaking: external scripts using `--name` fail after upgrade; mitigated by the error
  message teaching the fix and by `HYGEN_LEGACY_NAME=1` in CI.
- Escape keeps the array accident alive under legacy mode; documented explicitly as
  migration-only behavior.
