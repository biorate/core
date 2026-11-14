# Tasks

## 1. Types directory

- [x] 1.1 Create `src/types/` with the domain files from design.md (`index.ts`, `logger.ts`, `prompter.ts`, `attributes.ts`, `helpers-ns.ts`, `hooks.ts`, `prompter-ns.ts`, `config.ts`, `results.ts`, `params.ts`, `ops.ts`, `inflection.ts`), moving the content of `src/types.ts` verbatim (TSDoc included) and re-exporting everything from `index.ts`; verify with `npx tsc -p tsconfig.json --noEmit` in the package.
- [x] 1.2 Delete `src/types.ts` and confirm all `from './types'` / `'../src/types'` imports resolve through the directory index; verify with `npx tsc -p tsconfig.json --noEmit` and `npx vitest run tests/context.spec.ts tests/engine.spec.ts`.

## 2. Types out of implementation files

- [x] 2.1 Move `HookKind`, `ResolvedActionHooks`, `HookCache` into `src/types/hooks.ts` and `PickResult` into `src/types/prompter-ns.ts`; `prompt.ts` switches to `import type` and exports no types afterwards; update `tests/hooks-resolve.spec.ts` to import `HookCache` from `'../src/types'`; verify with `npx tsc -p tsconfig.json --noEmit` and `npx vitest run tests/hooks-resolve.spec.ts tests/hooks-runner.spec.ts`.
- [x] 2.2 Move `Op` into `src/types/ops.ts` (`ops/index.ts` imports it) and `AnchorLocator` from `src/ops/anchors.ts` into the same file; verify with `npx tsc -p tsconfig.json --noEmit` and `npx vitest run tests/inject.spec.ts tests/injector.spec.ts`.
- [x] 2.3 Move the `Inflection` interface from `src/helpers.ts` into `src/types/inflection.ts`; `helpers.ts` keeps only the runtime `undasherize` registration and helpers object; verify with `npx tsc -p tsconfig.json --noEmit` and `npx vitest run tests/context.spec.ts tests/render.spec.ts`.

## 3. ts-node registration helper

- [x] 3.1 Create `src/ts-node-register.ts` with the error-class-parameterized helper; switch `src/config-resolver.ts` and `src/prompt.ts` to it (the module specifier stays declared by `src/ts-node-register.d.ts`); verify with `npx tsc -p tsconfig.json --noEmit` and `npx vitest run tests/config.spec.ts tests/config-cjs.spec.ts tests/hooks-resolve.spec.ts`.

## 4. Picker extraction

- [x] 4.1 Move `pickGeneratorAction`, `PickQuestion` and `PickAnswer` from `src/prompt.ts` into a new `src/picker.ts` (importing `PickResult` from `'./types'`); re-point the importer to `'./picker'`; verify with `npx tsc -p tsconfig.json --noEmit` and `npx vitest run tests/picker.spec.ts tests/engine.spec.ts`.

## 5. Engine deduplication

- [x] 5.1 In `src/engine.ts`, collapse `pair` and `pairStatus` into one object and use it at both consumption sites; verify with `npx vitest run tests/engine.spec.ts tests/hooks-lifecycle.spec.ts tests/hooks-errors.spec.ts`.

## 6. Integration verification

- [x] 6.1 Static and cleanliness checks: `pnpm --filter @biorate/hygen run lint`, `pnpm --filter @biorate/hygen run format`, `src/types.ts` no longer exists, and no `export interface`/`export type` remains in `src/prompt.ts`, `src/ops/index.ts`, `src/ops/anchors.ts`, `src/helpers.ts` (grep); verify all pass.
- [x] 6.2 Full verification: `pnpm --filter @biorate/hygen run test` (25+ files green), `npx tsc -p tsconfig.json --noEmit`, `pnpm --filter @biorate/hygen run build` (inspect `dist/types/types/*.d.ts` layout), and `openspec validate refactor-hygen-types-and-cleanup`.

## 7. Shared constants directory

- [x] 7.1 Create `src/constants/` for cross-module constants (`hooks.ts` with `ACTION_HOOK_FILES`, `LEGACY_HOOK_FILES`, `HOOK_FILES`, `LIFECYCLE_METHODS`; `config.ts` with `CONFIG_FILES`, `DEFAULT_ACTION`; `engine.ts` with `RUN_SCOPE`; aggregating `index.ts`); re-point imports in `src/prompt.ts`, `src/config-resolver.ts`, `src/params.ts`, `src/help.ts`, `src/engine.ts`; file-local constants stay in place; public entry `src/index.ts` unchanged; verify with `npx tsc -p tsconfig.json --noEmit`, `npx vitest run tests/engine.spec.ts tests/params.spec.ts tests/config.spec.ts tests/help.spec.ts`, `pnpm run lint`, and `pnpm --filter @biorate/hygen run test`.

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- No release note required (no observable change); version bump stays with `lerna version`.
