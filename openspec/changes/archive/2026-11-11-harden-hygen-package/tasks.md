# Tasks

## 1. Integration base: kitchen-sink template (tests on what exists)

- [x] 1.1 Create `tests/fixtures/kitchen-sink/_templates/sink/new/`: `01-add.ejs.t` (to + case helpers + nested folders), `02-escape.ejs.t` (`<%= expr %>` with `>`, `<`, `&` values), `03-inject.ejs.t` (inject + after + eof_last), `04-inject-skip.ejs.t` (skip_if), `05-shell.ejs.t` (`sh: node -e`), `prompt.js`; verify: the files exist and the structure matches the design.md scheme
- [x] 1.2 Write `tests/sink.spec.ts`: a `runner()` run over the kitchen-sink in an `fs.mkdtemp` cwd — capturing CURRENT behavior (including the defective one: HTML escape in 02, silent no-op inject without an anchor, missing `--version`); verify: `pnpm --filter @biorate/hygen run test` is green, the spec fails only on an accidental behavior change
- [x] 1.3 Extend units at the contested spots: `injector.spec.ts` — the "anchor not found" case (current no-op), `params.spec.ts` — the `--version` case (current error); verify: the specs are green and document current behavior via comments
- [x] 1.4 Verify the test base via IDEA + `tsc --noEmit` (clean unconditionally) and prettier; verify: `npx tsc -p tsconfig.json --noEmit` — 0 errors, `prettier --check` over the package is clean

## 2. Fix #450: `--version`

- [x] 2.1 Parse `--version`/`-v` in `bin.ts` before `runner()`: print `Hygen v<pkg.version>`, exit 0; flip the expectation in the test (unit + kitchen-sink smoke); verify: `node dist/cjs/bin.js --version` → code 0, version matches `package.json`
- [x] 2.2 Update `docs/` (quick-start: the version flag) and README; verify: `--version` is mentioned in the docs

## 3. Fix #387: disabling HTML escaping

- [x] 3.1 Pass `escapeFunction: (s) => s` to `ejs.render` in `src/render.ts`; flip the `02-escape` expectation in `sink.spec.ts` and add a unit to `render.spec.ts` (`<%= expr %>` with the string `a > b && c < d` → verbatim); verify: tests are green and no other spec broke (update context snapshots if necessary)
- [x] 3.2 Note the behavior in the README (Differences from upstream section); verify: the mention exists

## 4. Fix #404: error on an unfound anchor

- [x] 4.1 Add `InjectionAnchorNotFoundError` to `src/errors.ts`; in `ops/injector.ts`/`ops/inject.ts` — throw when `idx === -1` for before/after/line_at (prepend/append/at_line unchanged), the file is not written; flip the expectations in the unit and kitchen-sink; verify: specs green, `RunnerResult.success === false`, the file is unchanged
- [x] 4.2 Run the kitchen-sink in full — 04-inject-skip idempotency preserved; verify: a double run produces an identical file

## 5. Inject-family features

- [x] 5.1 `create_if_missing: true` in `inject.ts` (fs.ensureFile + writing the body; without the option — the former missing-file error); tests: kitchen-sink + unit (creation and absence); verify: specs green
- [x] 5.2 `replace: true` in `injector.ts` (replace the first anchor match with the body; conflict with `inject` and unsupported anchors → `TemplateConfigError`); tests: unit + kitchen-sink case; verify: replacement works, the conflict is caught
- [x] 5.3 `skip_if_not: true` in `injector.ts` (inversion of skip_if); tests: unit (both branches) + kitchen-sink; verify: specs green
- [x] 5.4 Document the new options in `docs/templates.md` (frontmatter table) and README; verify: each option is mentioned with an example

## 6. LICENSE and final verification

- [x] 6.1 Update `LICENSE`: the repository owner's copyright first (`Copyright (c) 2026-present Leonid Levkin (llevkin)`), preserve the upstream line `Copyright (c) 2018-present, Dotan Nahum.`; mention in README; verify: both lines present
- [x] 6.2 Full run: `pnpm --filter @biorate/hygen run build`, `run test`, CLI smoke (`--version`, generating a kitchen-sink-like template in a `/tmp/opencode` sandbox); verify: all green
- [x] 6.3 Monorepo pass: `@biorate/errors` tests and prettier/eslint over the package; verify: clean, formatting applied

## Workflow follow-up

- Run `openspec validate` before apply.
- Do not commit or publish without an explicit request from the author.
- Archive the change after the author's review.
