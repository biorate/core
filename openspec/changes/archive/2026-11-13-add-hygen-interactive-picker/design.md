# Design

## Context

`help.ts` already scans the templates root to list generators; `prompt.ts` provides the prompt machinery (three prompt forms) used for template prompts. Argument parsing in `params.ts` errors on missing generator/action positionals. Plop's picker is single-level (generators); the user requested a second level (actions) — action directories are discoverable the same way generators are.

## Goals / Non-Goals

**Goals:**

- Zero-argument invocation becomes a guided flow: generator → action → normal run.
- Reuse existing scanning and prompting; no new dependencies.
- Fail fast (current error) in non-TTY environments.

**Non-Goals:**

- Multi-select of actions (single action per pick; comma lists remain the explicit multi-action mechanism).
- Picker for other missing arguments (name is still prompted by templates as usual).
- Nested generator paths beyond the top level in the picker (top-level only, consistent with current listing).

## Decisions

- **Entry condition: zero positional arguments + TTY.** Any positional argument keeps the current grammar. TTY detection via `process.stdin.isTTY`/`process.stdout.isTTY`; absence → existing error with an added hint about the picker.
- **Picker built in `prompt.ts`** using the existing select/list prompt form; generator list from the same scan `help.ts` uses (extract the shared listing into a helper if needed, no behavior change to `help` output).
- **Second level lists action directories** of the chosen generator; empty second level is impossible by construction (a directory with no actions is not listed as a generator), keeping the "no generators found" error for the empty root case only.
- **Selection result feeds the existing pipeline** — picker returns `(generator, action)` strings placed into parsed args; no special-casing downstream (flags, `--subaction`, keep-going all unchanged).
- **Skip decision:** non-interactive fallback is a hard error (never prompt/hang in CI).

## Risks / Trade-offs

- TTY detection edge cases (pseudo-terminals); mitigated by the fallback error path rather than a hang.
- Scripts that relied on the error exit code of a bare `hygen` invocation will now get an interactive menu on TTY but the same error in CI — behavior split is documented.
