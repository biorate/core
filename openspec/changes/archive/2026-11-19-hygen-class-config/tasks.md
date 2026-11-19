# Tasks

## 1. Types and errors

- [x] 1.1 Add `ProjectConfig` interface (`templates`, `argCase`, `helpers`, `hooks`) to `packages/@biorate/hygen/src/types/config.ts` with TSDoc, and re-export it from `src/index.ts`; verify `pnpm --filter @biorate/hygen run build:types` passes and the interface appears in `dist/types`.
- [x] 1.2 Add a standardized `BaseError`-derived error class for a non-instantiable config class (message names the config file, keeps the original cause text) to `src/errors.ts`; verify the package typechecks.

## 2. Config normalization

- [x] 2.1 Implement export normalization in `src/config-resolver.ts`: named exports take priority; otherwise default export — plain object as-is, class → `new C()` wrapped so constructor throws become the new standardized error, resolved to the instance's own enumerable properties; unknown own properties ignored with `logger.warn` naming each property; verify unit tests in `tests/config-resolver.spec.ts` cover named>default, default object, class, unknown-field warn, and ctor failure (mocked loads, both CJS and ESM namespace shapes).
- [x] 2.2 Ensure the normalization applies identically for both build outputs: run `pnpm --filter @biorate/hygen run build` and the existing config suites (`tests/config.spec.ts`, `tests/config-cjs.spec.ts`, `tests/config-resolver.spec.ts`) — all green.

## 3. End-to-end behavior

- [x] 3.1 Add a real-run fixture + spec (pattern of `tests/config-cjs.spec.ts`): project config default-exporting a class with `helpers` and `hooks`, template rendering uses the class-provided helper and lifecycle hooks fire; verify the spec passes.
- [x] 3.2 Add a real-run regression case for `export default { ... }` (previously broken): its fields merge into the run; verify the spec passes under both CJS and ESM test passes.
- [x] 3.3 Add a warning case spec: class config with an extra own property produces a logged warning and the property does not reach the config; verify via captured logger output.

## 4. Documentation

- [x] 4.1 Update `packages/@biorate/hygen/docs/extensibility.md`: describe export normalization (named > default), the class form with the own-field helpers-caching idiom (`helpers = this.#build()`), replace the stale "Plain object, not a class" statement, and document the warning + ctor error; verify the docs site builds (`pnpm --filter @biorate/hygen-docs-site run build` or equivalent) and text renders.
- [x] 4.2 Update the docs site config example (`site/src/pages/index.tsx`) and README if it shows the config file format; verify examples typecheck against `ProjectConfig`.

## 5. Verification

- [x] 5.1 Full package verification: `pnpm --filter @biorate/hygen run build && pnpm --filter @biorate/hygen run test` green; no `any` in exported types; TSDoc present on new exports (typedoc smoke via `pnpm run doc` if configured).
