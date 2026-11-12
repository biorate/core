# Proposal: add-hygen-conditional-actions

## Why

Ported from plop (`skip` on actions). Today a hygen action always runs; conditional behavior ("don't create the test file when the user declined tests") can only be emulated via `sh:` scripts, which is clunky and obscures intent. A declarative skip attribute keeps the file-based model and removes the main structural reason users reach for plop-style code-defined generators.

## What Changes

- New `skip:` frontmatter attribute, rendered with the template engine like any other attribute: a truthy rendered value (anything other than empty string / `false`) skips the action.
- A skipped action produces a **third outcome status — `skipped`** — alongside ok and failed. `RunnerResult` gains per-action status; skipped actions never appear in `RunnerResult.failures` and do not fail `--keep-going` runs.
- The skip reason, when the rendered value is a non-empty message string, is surfaced in the run log.
- Works uniformly for all action kinds (file add, inject, echo, glob-expanded files); `sh:` actions can also be skipped before execution.
- Documentation and CLI help updated.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: ADD a requirement for declarative conditional skipping of actions; ADD a requirement for a three-state action outcome (ok / skipped / failed) in the runner result.

## Impact

- `packages/@biorate/core/…` none — all in `packages/@biorate/hygen/`
- `src/render.ts` — evaluate `skip` attribute
- `src/ops/index.ts` — short-circuit ops when skipped
- `src/types.ts`, `src/engine.ts` — outcome status model (`ok | skipped | failed`), `RunnerResult` shape
- `src/logger.ts` — skipped reporting
- Docs: `docs/templates.md`, `README.md`; CLI help
- Tests: e2e skip scenarios
