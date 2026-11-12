# Tasks

## 1. Types and rendering

- [x] 1.1 Add `glob`, `base`, `stripExtensions`, `destination`, `skipIfExists` to action attribute types in `src/types.ts`
- [x] 1.2 Implement glob expansion in `src/render.ts`: resolve matches relative to the generator directory, apply `base` stripping and `stripExtensions`, render EJS in destination paths and file contents, reject `mirror` + `glob` combination with a typed error
- [x] 1.3 Pass `skipIfExists` through rendered actions to `ops/add.ts`

## 2. Operations

- [x] 2.1 In `src/ops/add.ts`, honor `skipIfExists`: existing target → skipped outcome, no write, not counted as failure

## 3. Engine integration

- [x] 3.1 Verify glob actions multiply with comma-separated name lists in the name-outer × action-inner loop; add engine-level handling only if the current expansion needs adjustment
- [x] 3.2 Ensure `--keep-going` treats skipped glob-expanded files as non-failures

## 4. Tests

- [x] 4.1 E2E tests (fixture-based, via `runner()`): batch copy, base/stripExtensions path shaping, file-name EJS, mirror+glob error, name-list multiplication, skipIfExists skip and keep-going interplay

## 5. Docs

- [x] 5.1 Document `glob`/`base`/`stripExtensions`/`destination`/`skipIfExists` in `docs/templates.md` (and `docs/generators.md` where relevant)
- [x] 5.2 Update `README.md` Differences-from-upstream and CLI help (`src/cli-help.ts`, `src/help.ts`)

## 6. Verification

- [x] 6.1 `pnpm --filter @biorate/hygen run build` clean; full vitest suite passes
- [x] 6.2 `tsc --noEmit` 0 errors; prettier/eslint on changed files (respect pre-existing violations)
