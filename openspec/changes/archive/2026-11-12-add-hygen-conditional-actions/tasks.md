# Tasks

## 1. Status model

- [x] 1.1 Add `ActionStatus` ('ok' | 'skipped' | 'failed') and per-action status to `RunnerResult` in `src/types.ts`
- [x] 1.2 Update `src/engine.ts` aggregation: skipped actions excluded from `failures`, do not trigger fail-fast abort

## 2. Skip evaluation

- [x] 2.1 Render the `skip:` attribute in `src/render.ts` with run locals; truthiness rules (empty/`false` falsy; `true` flag; other non-empty = reason)
- [x] 2.2 Short-circuit before op resolution in `src/execute.ts` for skipped actions (no ops run, shell never spawns) — enforcement site moved from `ops/index.ts` to `execute.ts`, which calls `resolve()`; the guarantee is identical
- [x] 2.3 Log skipped actions with reason via `src/logger.ts`

## 3. Tests

- [x] 3.1 E2E: conditional file skip with reason; falsy value runs; skip on `sh:` and inject actions; three-state result; fail-fast and `--keep-going` interplay; failed+skipped distinction in `failures`

## 4. Docs

- [x] 4.1 Document `skip:` in `docs/templates.md` and the `README.md` Differences-from-upstream list; CLI help stays untouched (frontmatter attributes are documented in docs, not CLI help — decision A)

## 5. Verification

- [x] 5.1 Build clean, full vitest suite passes, `tsc --noEmit` 0 errors, prettier/eslint on changed files
