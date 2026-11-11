# Design

## Context

The `@biorate/hygen` fork has been ported and archived (change `add-hygen-package`); behavior matches upstream v6.2.11. A triage of upstream issues surfaced confirmed bugs (#450, #387, #404) and a missing end-to-end test layer. See proposal.md — Why.

## Goals / Non-Goals

**Goals:**

- Red→green discipline: every change is preceded by a test that captures current behavior.
- A single kitchen-sink generator as the integration grid for the whole pipeline.
- The inject family gets predictable semantics (an error instead of a silent no-op).

**Non-Goals:**

- Other upstream issues (#433/#406 ESM prompts, #302 CRLF, #422 multiple skip_if) — separate changes.
- Upgrading major dependencies.

## Decisions

1. **Order: tests → fixes → features.** Unit cases capture the current (defective) behavior right after the kitchen-sink lands; the fixes then flip the expectations. This protects against accidental behavior drift along the way.
2. **#387: identity escape function (`escape: (s) => s`) in `ejs.render`.** The alternative — documenting `<%- %>` — is rejected: the `<%= %>` default for a code generator must be safe by default; upstream templates themselves do not use `<%= %>` with "dangerous" values, so regression risk is low. **Breaking:** values that were previously escaped now go through verbatim.
3. **#404: error instead of silent no-op.** A new class `InjectionAnchorNotFoundError extends BaseError` (in `errors.ts`); the operation fails and the file is untouched. **Breaking** for anyone relying on the no-op; an error is more predictable. The current `logger.err` is replaced by a throw (via `execute.ts` the error lands in `RunnerResult.success: false`).
4. **#450: parse `--version`/`-v` in `bin.ts` before `runner()`.** Early exit with code 0; `VERSION` is already imported from `help.ts` (package version via `pkg.version`). Not in `params.ts`, to avoid changing the argument parser.
5. **#115 `create_if_missing`:** checked in `inject.ts` before reading the file; creation via `fs.ensureFile` + writing the body. Off by default — preserves the existing missing-file error.
6. **#84/#106 `replace`:** implemented in `injector.ts` as a separate branch: replace the first anchor match (a line or a full-text regex, as in `getPragmaticIndex`) with the template body; `prepend`/`append`/`line_at` with `replace` raise a configuration error (`TemplateConfigError`, a new class). The `inject`+`replace` conflict is also a `TemplateConfigError`.
7. **#117 `skip_if_not`:** a pure inversion in `injector.ts`: `const shouldSkip = skip_if ? (condition !== !!skip_if_not) : false` — minimal diff.
8. **LICENSE:** the first copyright line is `Copyright (c) 2026-present Leonid Levkin (llevkin)`, the second is the preserved `Copyright (c) 2018-present, Dotan Nahum.` (without it the MIT license of a derivative work is invalid). Reflected in README.
9. **Kitchen-sink:** `tests/fixtures/kitchen-sink/_templates/sink/**` + `tests/sink.spec.ts`, run via `runner()` from `src` (not via dist), a temporary cwd via `fs.mkdtemp` in `os.tmpdir()` — no files written into the repository. The shell operation is `node -e` with no network dependencies.

## Risks / Trade-offs

- [Disabling escaping changes the output of existing templates] → run the full spec suite; upstream fixtures contain no HTML constructs in values.
- [Erroring on an unfound anchor may break users' existing generators] → the error message includes the anchor name and path; a README migration note.
- [A kitchen-sink with a shell operation is slower than units] → one shell command, `node -e`; the overall run stays under 5 s.
- [Context snapshots (`context.spec`) depend on the helper set] → we do not change helpers in this change.

## Backward Compatibility Matrix

| Change                                           | Backward compatible? | Notes                                                                                                                                                                                                           |
| ------------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1–1.4 kitchen-sink + units on current behavior | Yes                  | Tests only; no code touched                                                                                                                                                                                     |
| 2 #450 `--version`                               | Yes                  | Currently the flag fails with exit 1 (`Hygen vundefined`); "error → success" breaks nothing that worked                                                                                                         |
| 3 #387 `escapeFunction: identity`                | **No (breaking)**    | Output of existing templates changes when values contained `<`, `>`, `&`, `'`, `"` (e.g. `a & b` → was `a &amp; b`, now `a & b`). Upstream and our fixtures contain no such values; third-party templates might |
| 4 #404 error on unfound anchor                   | **No (breaking)**    | Currently a silent "success" (log + file rewrite without insertion). Runs that returned `success: true` / exit 0 will start failing; CI scripts that relied on the silent no-op break                           |
| 5.1 `create_if_missing`                          | Yes                  | New option, off by default; default path unchanged                                                                                                                                                              |
| 5.2 `replace: true`                              | Yes                  | New option. Edge case: a template that already used `replace` as a custom variable gains new semantics; `inject`+`replace` now errors instead of silently ignoring `replace` (unlikely in practice)             |
| 5.3 `skip_if_not: true`                          | Yes                  | New option; without it `skip_if_not` was just a template variable. Default `skip_if` path unchanged                                                                                                             |
| 6.1 LICENSE                                      | Yes                  | Not code; upstream line preserved, MIT validity intact                                                                                                                                                          |

Two deliberate breaking changes (#387, #404) exist because the current behavior is itself the defect (code corruption / silent failure). A softer alternative for #404 — an opt-in `strict_anchors: true` flag or a warning instead of a throw — was rejected: it keeps the silent-failure defect as the default. Both breaking items must be listed in the README "Differences from upstream" section and shipped with a major/pre-major version bump (see Migration Plan).

## Migration Plan

Additive behavior plus two deliberate breaking changes (#387, #404). Release as a pre-major/minor bump; the README gains "Differences from upstream" entries. Rollback: revert the commit before publishing.

## Open Questions

- (none — order and scope confirmed by the author)
