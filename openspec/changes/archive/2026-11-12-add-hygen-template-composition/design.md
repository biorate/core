# Design

## Context

Today the CLI resolves exactly one `generator/action` pair (`resolvePositionals` in
`src/params.ts`), runs one prompt hook, renders one action folder, and applies ops once.
A template without `to:` is a no-op (`src/ops/add.ts`: `if (!to || inject) return`).
This change adds list semantics to actions and names, and an opt-in mirror mode for
missing `to:`. The breaking removal of the `--name` flag is deliberately split into a
separate change (`remove-hygen-name-flag`).

## Goals / Non-Goals

**Goals:**

- Comma lists for action and name positionals; sequential execution, name-outer order.
- Opt-in mirroring with a suffix convention (`.t` default, `.ejs.t` under flag).
- Single-name/no-name invocations stay byte-identical.
- Result reporting granular enough to debug expansion failures.

**Non-Goals:**

- No transactionality/rollback (documented: multi-run is sugar over sequential runs).
- No templated folder names in `_templates` (resolver/prompt ordering cycle — non-goal).
- No `--name` flag removal here (follow-up change); no "ask once, replicate answers"
  prompt mode (P1-b semantics: locals do not flow into later hooks' `args`).
- No changes to `sh:` chaining semantics.

## Decisions

### 1. Parser: split positionals on comma (variant: positional-comma primary)

`resolvePositionals` gains list semantics: the action positional and the name positional
split on `,` into arrays. Existence rule stays per element (each listed action checked
against `templates/gen/<action>`), preserving the existing bare-variant behavior
(`crud a,b` with no `_templates/crud/a,b` directory → names). Errors name the specific
element. The repeated `--name` flag remains functional in this change but its array
value is rejected: expansion consumes only positional lists; a repeated flag produces a
clear error ("use a comma-separated positional list").

### 2. Engine loop: (name-outer) × (action-inner) × prompt per action

Execution unit = one `(name, action)` pair = a full today-pipeline run (prompt hook →
render → ops), with `args.name` set to the scalar of the current expansion and
accumulated locals discarded between pairs except CLI-provided flags. Loop order is
name-outer so an entity's files exist before its inject-type actions run. Failure policy:
fail-fast default, `--keep-going` continues collecting failures. `RunnerResult.actions`
entries gain `action` and `name` fields (additive, optional in type).

### 3. Mirroring: opt-in attribute, never default

Mirror applies only when: `mirror: true` present AND no `to:` AND no `sh` attribute.
Target = relative path from the action folder to the template file, resolved against
`cwd`, missing directories created (`fs.ensureDir` already used). Suffix convention:
strip trailing `.t` by default; `HYGEN_MIRROR_EJS_SUFFIX=1` strips `.ejs.t` instead.
Overwrite semantics identical to explicit `to:` (force / unless_exists / interactive
prompt / HYGEN_OVERWRITE). Rationale for opt-in: silently creating files for templates
that today no-op (forgotten `to:`, or `sh`-only templates) would be a regression; the
attribute makes intent explicit and is cheap to add per template.

**Alternatives rejected:** unconditional mirror-on-missing-`to:` (breaks no-op and
`sh`-only templates silently); mirror rooted at `generator/action` prefix (verbose,
unpredictable value).

### 4. `name` precedence documentation, not code change

Precedence today (prompt hook > positional > flag) is emergent from the `Object.assign`
order in `params.ts`. It is documented (docs + spec scenario), not re-engineered —
changing merge order would alter existing hook behavior.

## Risks / Trade-offs

- Name expansion multiplies prompt interruptions; mitigation is existing CLI-flag
  filtering — documented prominently in the multi-action docs.
- Expansion with fail-fast leaves partial results on disk; documented explicitly and
  paired with `--dry` guidance.
- Mirror naming rule (`html.ejs.t` → `html.ejs`) may surprise users wanting `.ejs`
  stripped; the flag covers that case; revisit if feedback demands.
