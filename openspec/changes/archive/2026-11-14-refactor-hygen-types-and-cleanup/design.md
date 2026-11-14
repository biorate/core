# Design

## Context

See `proposal.md` — Why. Constraints that shape the approach:

- `src/types.ts` is imported as `from './types'` (or `'../src/types'` in tests) by nearly
  every module; no module imports deep paths. A directory with an `index.ts` therefore
  keeps every import working without churn.
- No type is exported from the package entry (`src/index.ts`), and no in-repo package
  imports `@biorate/hygen` as a library, so moving types cannot break a public API. The
  declaration-emit pass (`build:types`) still walks the directory normally.
- The duplicated ts-node block is `try { await import('ts-node/register/transpile-only') }
catch (cause) { throw new XTsNodeError(file, cause) }` with only the error class
  differing (`ConfigTsNodeError` / `HookTsNodeError`); `src/ts-node-register.d.ts` already
  declares that module specifier.
- The picker (`pickGeneratorAction` with `PickQuestion`/`PickAnswer`/`PickResult`) inside
  `prompt.ts` imports from `./help` and uses the config's logger/templates; it is invoked
  by `engine.ts` only. `tests/picker.spec.ts` imports the package entry, not `prompt.ts`.

## Goals / Non-Goals

**Goals:**

- Types live in type-only files grouped by domain, with one stable import path
  (`./types`).
- Implementation files export no types (except their default/function exports).
- Each duplication has exactly one implementation site.
- Behavior-preserving: the suite, types build and lint/format are green before and
  after; no test needs a semantic change.

**Non-Goals:**

- Renaming or reshaping any type (only file location changes; JSDoc moves verbatim).
- Touching `errors.ts` (the error-class boilerplate follows the monorepo standard).
- Refactoring the beforeEach/afterEach runner-array rhyme in `engine.ts` or anything in
  `render.ts`, `params.ts`, `execute.ts`, `ops/*` beyond moving their type exports.
- Changing the public entry's export list.
- Fixing the pre-existing long-requirement warnings in the main spec (unrelated).

## Decisions

### 1. `src/types/` directory with domain files and an aggregating `index.ts`

Target layout (names chosen to match the package's domain vocabulary; each file holds
only interfaces/type aliases with their existing TSDoc):

```text
src/types/
  index.ts        re-exports every domain file (export * from ...)
  logger.ts       Logger
  prompter.ts     Prompter
  attributes.ts   ActionAttributes, RenderedAction
  helpers-ns.ts   Helper, Helpers, Transform, Transforms
  hooks.ts        HookContext, HookMethod, ProjectHooks, ActionHooks,
                  HookKind, ResolvedActionHooks, HookCache
  prompter-ns.ts  PickResult
  config.ts       RunnerConfig, RunnerContextConfig, ResolverIO
  results.ts      ActionResult, ActionStatus, ActionStatusEntry, RunFailure, RunnerResult
  params.ts       ParamsResult
  ops.ts          Op, AnchorLocator
  inflection.ts   Inflection
```

Rationale and alternatives:

- _Single consolidated `types.ts`_ rejected: it would grow to ~450 lines and re-mix
  domains the specs and docs already treat separately.
- _No aggregator, deep imports only_ rejected: it would churn ~20 import sites for no
  behavioral gain and makes future moves more expensive.
- `Op`/`AnchorLocator` go into one `ops.ts` (both are operation-layer contracts; two
  near-empty files would be noise). `PickResult` sits beside `Prompter`-related contracts
  in `prompter-ns.ts`. `Inflection` stays in its own file because it documents a
  third-party module surface, not a package contract.

`HookCache` and `ResolvedActionHooks` move to `types/hooks.ts`; they reference each other
and `ActionHooks`, which lives in the same file, avoiding cross-file circulars.

### 2. Implementation files import types, never export them

`prompt.ts`, `ops/index.ts`, `ops/anchors.ts` and `helpers.ts` change their exports to
`import type { ... } from './types'`. `helpers.ts` keeps its runtime export of the
`undasherize`-patched `inflection` instance; only the `Inflection` interface moves.
`prompt.ts` continues to export the runtime symbols tests rely on
(`resolveActionHooks`, `HookCache` type re-export usage in `tests/hooks-resolve.spec.ts`
is satisfied through `prompt.ts` re-export or by importing from `./types` — prefer
importing the type from `'../src/types'` in the test, keeping `prompt.ts` free of type
exports).

### 3. One ts-node registration helper

New `src/ts-node-register.ts`:

```ts
const registerTsNode = async (
  file: string,
  error: new (f: string, c: unknown) => Error,
) => {
  if (!/\.ts$/.test(file)) return;
  try {
    await import('ts-node/register/transpile-only');
  } catch (cause) {
    throw new error(file, cause);
  }
};
```

Both `config-resolver.ts` and `prompt.ts` call it. The error-class parameter keeps the
existing error taxonomy intact (no new error class, no message change). The module
specifier remains declared by `src/ts-node-register-module.d.ts` — renamed from
`src/ts-node-register.d.ts` during implementation, because a same-named `.d.ts` beside
the new `.ts` would be consumed as its declaration file instead of staying ambient; the
declaration content is unchanged.

Alternative rejected: sharing one error class for both sites — it would change the error
type observable in configs vs hooks.

### 4. Picker extraction is a file move, not a redesign

`src/picker.ts` receives `pickGeneratorAction`, `PickQuestion`, `PickAnswer` and their
TSDoc verbatim from `prompt.ts`; `prompt.ts` (or `engine.ts`, whichever imports it today)
imports it from the new module. The `PickResult` type lives in `types/prompter-ns.ts`;
`picker.ts` imports it. No logic changes; `tests/picker.spec.ts` must pass untouched.

### 5. `pair`/`pairStatus` collapse in engine

Build one `pair` object once and use it for both the failure record and the status entry.
The two objects are structurally identical today; only their consumption differs, and
sharing one instance cannot alias-mutate because neither site mutates it.

## Risks / Trade-offs

- [Declaration emit for a types directory could produce different file layout under
  `dist/types`] → Mitigated by running `pnpm --filter @biorate/hygen run build` and
  inspecting `dist/types/types/*.d.ts`; the public entry is unchanged, so downstream
  resolution is unaffected.
- [Moving `HookCache` out of `prompt.ts` while `tests/hooks-resolve.spec.ts` imports it
  from there] → Keep a deliberate decision: the test imports the type from
  `'../src/types'` (task includes the one-line test import update); `prompt.ts` exports
  no types afterwards.
- [Circular imports after the move] → Types-only modules import nothing at runtime;
  `export *` chains in `types/index.ts` are erased at compile time.
- [Drift between the old `types.ts` and the new files] → The move is mechanical
  (verbatim JSDoc); `tsc --noEmit` plus the suite catch dropped exports; a final grep
  ensures `src/types.ts` is gone and no duplicate declarations remain.

## Migration Plan

Pure code motion within one package, one commit. Rollback is `git revert`. No data,
config, or consumer migration. Release note is optional (no observable change); the
version bump stays with `lerna version`.

## Open Questions

None.
