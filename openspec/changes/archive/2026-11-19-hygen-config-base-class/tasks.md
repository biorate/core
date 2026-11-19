# Tasks

## 1. Base class

- [x] 1.1 Create `src/hygen-config.ts`: abstract `HygenConfig` with constructor-initialized fields (`templates`, `argCase = 'keep'`, `localsDefaults`, `helpers`), no-op prototype hook methods (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`), and `toRunnerConfig()` collecting fields + overridden hooks bound to `this` (skip no-op base hooks per design D4) — verify `pnpm --filter @biorate/hygen run build` passes
- [x] 1.2 Export `HygenConfig` from `src/index.ts` — verify the export resolves via a build/type-check of the package entry

## 2. Resolver integration

- [x] 2.1 In `src/config-resolver.ts` add the `instanceof HygenConfig` branch calling `toRunnerConfig()`; keep the legacy own-props path (with unknown-key warning) for non-base classes and plain objects unchanged — verify `pnpm --filter @biorate/hygen run build` passes

## 3. Tests

- [x] 3.1 Add unit spec (e.g. `tests/hygen-config-base.spec.ts`): constructor defaults (`argCase === 'keep'`, others undefined) without errors; hook prototype methods invoked with live `this` reading an instance field during a run; `toRunnerConfig()` omits non-overridden hooks and binds overridden ones — verify `npx vitest run tests/hygen-config-base.spec.ts` passes
- [x] 3.2 Cover in the same spec: `helpers` as property, as getter, and as factory method (all three produce the effective helpers map); base-class instance with an extra internal state field leaks nothing into the config and emits no unknown-key warning; legacy class (not extending the base) with own `helpers`/`hooks` merges own props and warns on unknown keys as before — verify `npx vitest run tests/hygen-config-base.spec.ts` passes

## 4. Full suite and documentation

- [x] 4.1 Run the full package test suite `pnpm --filter @biorate/hygen test` and confirm no regressions (existing class-config, hooks-lifecycle, and params-schema suites unaffected)
- [x] 4.2 Update `packages/@biorate/hygen/README.md` (base-class section: extends example, three `helpers` forms, hook methods with `this` state) and `packages/@biorate/hygen/AGENTS.md` (file table entry for `src/hygen-config.ts`, resolution flow note: instanceof branch vs legacy own-props) — verify documented examples compile against the exported API
- [x] 4.3 Bump package version in `packages/@biorate/hygen/package.json` (minor) — verify `pnpm --filter @biorate/hygen run build` passes

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied (`/opsx-archive`).
