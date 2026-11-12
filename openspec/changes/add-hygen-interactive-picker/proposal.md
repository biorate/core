# Proposal: add-hygen-interactive-picker

## Why

Ported from plop (generator picker with a second action level, per user decision 2026-11-12). Running `hygen` with no arguments currently errors on missing positional arguments, even though the package already knows how to list generators and actions from `_templates`. A two-level interactive picker (generator → action) makes the tool discoverable for newcomers and convenient for everyday use, matching plop's best-known UX feature.

## What Changes

- `hygen` with no positional arguments launches an interactive picker built on the existing prompt machinery:
  1. list generators found in `_templates` (top-level directories), user picks one;
  2. list actions within the chosen generator, user picks one (or all, when multiple exist);
  3. the run proceeds with the selected generator/action as if passed positionally.
- Remaining CLI flags (e.g. `--keep-going`, `--subaction`) behave identically.
- Non-interactive environments (no TTY) keep the current error behavior with a clear message — the picker never hangs.
- CLI help and docs updated.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: ADD a requirement for interactive two-level generator/action selection when no positional arguments are provided.

## Impact

- `packages/@biorate/hygen/src/params.ts` — no-args detection
- `packages/@biorate/hygen/src/prompt.ts` — reuse prompt machinery for the picker
- `packages/@biorate/hygen/src/help.ts` — generator/action listing reuse
- `packages/@biorate/hygen/src/cli.ts` (or equivalent entry) — picker wiring
- Docs: `docs/generators.md`, `README.md`; CLI help
- Tests: picker selection flows (TTY-emulated), non-interactive fallback
