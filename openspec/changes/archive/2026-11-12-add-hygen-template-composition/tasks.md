# Tasks

## Group 1 — Parser: positional lists

- [x] 1.1 `src/params.ts`: split action and name positionals on `,`; per-element
      existence checks with element-naming errors; reject repeated `--name` flag
      (array value) with a clear message pointing at the positional list.
- [x] 1.2 Unit tests: comma lists for actions/names, bare variant with list, element-level
      not-found errors, repeated `--name` rejection, single-element passthrough.

## Group 2 — Engine: expansion loop and results

- [x] 2.1 `src/engine.ts` (and `src/params.ts` plumbing): name-outer × action-inner loop,
      one full pipeline per `(name, action)` pair, scalar `args.name`, locals reset
      between pairs except CLI flags; fail-fast default + `--keep-going`.
- [x] 2.2 `src/types.ts`: `RunnerResult.actions` entries gain optional `action` and
      `name`; failure reporting lists the failing pair; TSDoc updates.
- [x] 2.3 Tests: execution order for `model,controller × a,b`, per-action prompt hooks
      (fake prompter), fail-fast vs keep-going result shapes, subaction scope per action.
- [x] 2.4 Unit test for `name` precedence chain (prompt hook > positional > `--name`
      flag under the pre-removal behavior) — locks the documented table.

## Group 3 — Mirroring

- [x] 3.1 `src/ops/add.ts` + render plumbing: `mirror: true` handling — target =
      relative path from action folder resolved against `cwd`, suffix rule (strip `.t`;
      `HYGEN_MIRROR_EJS_SUFFIX=1` strips `.ejs.t`), never applies with `to:` or `sh`,
      overwrite semantics unchanged.
- [x] 3.2 Tests: default suffix, flag suffix, explicit-`to`-wins, `sh`-only no-op,
      nested directories created, overwrite interplay.

## Group 4 — E2E coverage (real runner, fixture-based)

- [x] 4.1 E2E fixture + test: multi-action run (`new,html` style) over a fixture with two
      action folders — assert both actions' outputs and result `action` fields; failure
      case asserting the element-naming error ("action `x` not found in list").
- [x] 4.2 E2E fixture + test: name expansion (`a,b`) with name-outer order asserted via
      `RunnerResult.actions` sequence and output files; bare+list (`crud a,b`) case.
- [x] 4.3 E2E fixture + test: mirrored template (`mirror: true`, nested dir, no `to:`)
      writing to `<cwd>/parts/...` with default suffix; kitchen-sink regression run
      confirming zero behavior change for templates with explicit `to:`.

## Group 5 — Docs and verification

- [x] 5.1 Docs: `docs/templates.md` (mirror attribute + suffix convention),
      `docs/generators.md` (multi-action/name lists, `--keep-going`, loop order),
      `docs/prompts.md` (per-action hooks under lists; `name` precedence table),
      `docs/faq.md` (entries: "how to generate for several names/actions", "why does my
      template without `to:` create nothing"),
      README Differences note (repeated `--name` array → error/expansion).
- [x] 5.2 CLI help (`src/cli-help.ts`): document the new list syntax and `--keep-going`
      in the usage/help text.
- [x] 5.3 Full verification: build, all tests green, `tsc --noEmit`, prettier/eslint
      clean on touched files, `openspec validate add-hygen-template-composition`.

## Group 6 — Finalize

- [x] 6.1 Check `openspec status` all done; present summary (commit/archive on explicit
      user command only).
