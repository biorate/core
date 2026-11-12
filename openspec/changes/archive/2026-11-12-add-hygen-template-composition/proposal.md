# Proposal

## Why

Three composition gaps make the fork awkward for real generator suites: a template without
`to:` is a silent no-op (forcing boilerplate frontmatter even when the output path should
mirror the template layout), only one action can run per invocation (suites require `sh:`
chaining or embedding loops), and there is no way to render the same action for several
names without re-running the CLI. All three surfaced during explore sessions on generator
composition.

## What Changes

- **Optional `to:` with mirroring (opt-in)**: a template with `mirror: true` and no `to:`
  writes its rendered output to the path mirroring its location inside the action folder.
  Suffix convention: the trailing `.t` is stripped by default (`html.ejs.t` → `html.ejs`);
  a flag (`HYGEN_MIRROR_EJS_SUFFIX=1`) strips the full `.ejs.t` instead (`html.ejs.t` →
  `html`). Explicit `to:` always wins; `sh`-only templates never mirror.
- **Multiple actions per invocation**: the action positional accepts a comma list
  (`hygen mailer new,html ...`). Actions run sequentially in list order; each action runs
  its own prompt hook and render pipeline; shared variables come from CLI flags (prompt
  filtering already skips answered names). Fail-fast by default; `--keep-going` continues
  and reports all failures. `--subaction` applies within each action.
- **Name expansion**: the name positional accepts a comma list
  (`hygen mailer new a,b` → two full runs). Loop order is name-outer (each entity
  completes all its actions before the next entity starts). `name` in templates is always
  a scalar; the current undocumented array behavior of repeated `--name` flags disappears
  (the flag itself is removed in a follow-up change, `remove-hygen-name-flag`).
- **Documentation**: document that `to:` (and all frontmatter) is fully EJS-rendered —
  folder macros in output paths already work; add the `name` variable precedence table
  (CLI flag → positional → prompt hook).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: ADDED requirements — template mirroring (`mirror: true` with suffix
  conventions), multiple actions per invocation, name expansion. ADDED documentation
  requirement for `to:` macro rendering and the `name` precedence table.

## Impact

- **Code** (`packages/@biorate/hygen`): `src/params.ts` (positional lists, expansion
  inputs), `src/engine.ts` (multi-action/name loop, fail-fast policy, result shape),
  `src/types.ts` (`RunnerResult`/`RenderedAction` extensions), `src/ops/add.ts` (mirror
  target resolution), `src/render.ts` (mirror attribute exposure).
- **Tests**: new specs for parser lists, expansion order, mirroring suffix rules, results.
- **API**: `RunnerResult.actions` gains `action` and `name` fields (additive).
- **Compatibility**: single-action single-name invocations are byte-identical; explicit
  `to:` unchanged; repeated `--name` changes from array to expansion (documented as a
  behavior fix; full flag removal happens in `remove-hygen-name-flag`).
