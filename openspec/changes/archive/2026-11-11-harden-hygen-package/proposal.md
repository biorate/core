# Proposal

## Why

A triage of open issues in upstream `jondot/hygen` revealed bugs that live in our fork too, plus a coverage gap: unit tests verify modules in isolation, but there is no end-to-end template exercising the whole pipeline (add/inject/shell/prompt/helpers/escaping) through `runner()`. Two bugs were confirmed live (#450 — `--version` fails; #387 — EJS escaping corrupts generated code), one by code inspection (#404 — inject silently no-ops when the anchor is not found). Work order per the author's decision: first tests capturing current behavior, then fixes and features, each confirmed by tests.

## What Changes

- **Test base (first step):**
  - an integration kitchen-sink template `tests/fixtures/kitchen-sink/` (`sink` generator: add, case helpers, escape, inject+after+eof_last, inject+skip_if idempotency, shell, prompt) plus a `sink.spec.ts` spec through `runner()` capturing current behavior;
  - unit tests capturing current behavior at the contested spots: `<%= %>` escaping (currently HTML-escape), silent inject (currently a no-op with a log), missing `--version`.
- **Upstream bug fixes:**
  - #450: `hygen --version` / `-v` prints the version and exits with code 0 (currently ShowHelpError + `vundefined` + exit 1);
  - #387: `<%= %>` does not HTML-escape (`escapeFunction: identity`) — we generate code, not markup;
  - #404: inject with an unfound `before`/`after`/`line_at` anchor reports an error (`InjectionAnchorNotFoundError` semantics) instead of silently "succeeding".
- **Inject-family features (upstream requests, confirmed by tests):**
  - #115: `create_if_missing: true` — inject creates the file if the target does not exist;
  - #84/#106: `replace: true` (mutually exclusive with `inject`) — replaces the matched anchor with the template body;
  - #117: `skip_if_not: true` — inversion of `skip_if`.
- **LICENSE:** the author is replaced by the repository owner (Leonid Levkin / llevkin); the original MIT copyright line of Dotan Nahum is kept alongside — without it the MIT license is invalid for a derivative work.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `hygen-generator`: requirements are modified/added — injection (#404/#115/#84/#106/#117), CLI version output (#450), unescaped expression rendering (#387).

## Impact

- `packages/@biorate/hygen/src/` — `render.ts` (escape), `params.ts`/`help.ts` (version), `ops/injector.ts`+`ops/inject.ts` (anchor error, create_if_missing, replace, skip_if_not), `src/errors.ts` (new classes)
- `packages/@biorate/hygen/tests/` — kitchen-sink fixture + `sink.spec.ts`, new unit cases; snapshot updates if needed
- `packages/@biorate/hygen/LICENSE` — repository-owner copyright + preserved upstream line
- `packages/@biorate/hygen/docs/templates.md` / `README.md` — documentation of the new frontmatter options
- Compatibility: disabling escaping and erroring on an unfound anchor are deliberate behavior changes (breaking for anyone relying on the silent no-op); recorded in design.md
