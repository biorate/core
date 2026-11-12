# Tasks

## 1. Config and types

- [x] 1.1 Add `transforms` namespace to `RunnerConfig` / config loading in `src/types.ts`, `src/context.ts` (plain object, merged like helpers)
- [x] 1.2 Add `UnknownTransformError` to `src/errors.ts`

## 2. Application

- [x] 2.1 In `src/render.ts`: after content render, resolve `transform:` names (`|`-chained, trimmed), apply in order, await async transforms
- [x] 2.2 Unknown name → `UnknownTransformError` naming the transform and config key; transform throwing → action failure (integrate with failures/keep-going)
- [x] 2.3 `transform:` on `sh:` actions → warning via `src/logger.ts`, no application

## 3. Tests

- [x] 3.1 E2E: single transform rewrites content; chained order; async transform; unknown-name error; transform on add/mirror/inject; warn on `sh:`; no warnings for shell-only templates; throwing transform appears in failures with `--keep-going`

## 4. Docs

- [x] 4.1 Document `transforms` config and `transform:` attribute in `docs/extensibility.md` (prettier example); update `README.md` Differences and CLI help

## 5. Verification

- [x] 5.1 Build clean, full vitest suite passes, `tsc --noEmit` 0 errors, prettier/eslint on changed files
