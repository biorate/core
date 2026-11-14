# Proposal

## Why

The recent feature work on `@biorate/hygen` (lifecycle hooks, path macros, lazy helper
resolution) left the package with structural debt: all 21 exported types — spanning
logging, template attributes, hooks, config, run results and params — live in one
370-line `src/types.ts` plus several types exported from implementation files, and three
concrete duplications accumulated (ts-node registration, `pair`/`pairStatus`, and the
interactive picker embedded in `prompt.ts`). An exploration confirmed the package has no
in-repo consumers importing it as a library and its entry point exports no types, so the
cleanup can be done with zero public-surface change.

## What Changes

- Split `src/types.ts` into a domain-grouped `src/types/` directory with an aggregating
  `index.ts`, so existing `from './types'` imports keep working: `logger`, `prompter`,
  `attributes`, `helpers-ns`, `hooks`, `config`, `results`, `params`.
- Move types currently exported from implementation files into `src/types/`:
  `HookKind`, `ResolvedActionHooks`, `HookCache`, `PickResult` (from `prompt.ts`),
  `Op` (from `ops/index.ts`), `AnchorLocator` (from `ops/anchors.ts`), `Inflection`
  (from `helpers.ts`).
- Extract the duplicated ts-node registration (`config-resolver.ts`, `prompt.ts`) into
  one helper parameterized by the thrown error class; the orphaned
  `src/ts-node-register.d.ts` stays the module's declaration site.
- Extract the interactive generator/action picker (`pickGeneratorAction`,
  `PickQuestion`/`PickAnswer`) from `prompt.ts` into a dedicated `src/picker.ts`.
- Deduplicate `pair`/`pairStatus` in `engine.ts` into a single object.
- No observable behavior change: CLI output, embeddable API, errors, and template
  semantics are unchanged; no spec-level requirement changes (`skip_specs`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None — this is a pure internal refactor with no observable behavior change; the change
declares `skip_specs: true`.

## Impact

- `packages/@biorate/hygen/src/types.ts` — replaced by `src/types/` (8 domain files +
  `index.ts`).
- `packages/@biorate/hygen/src/prompt.ts` — types moved out, picker extracted, ts-node
  helper adopted.
- `packages/@biorate/hygen/src/config-resolver.ts` — ts-node helper adopted.
- `packages/@biorate/hygen/src/ops/index.ts`, `src/ops/anchors.ts`, `src/helpers.ts` —
  local type exports moved to `src/types/`.
- `packages/@biorate/hygen/src/engine.ts` — `pair`/`pairStatus` deduplication.
- `packages/@biorate/hygen/src/picker.ts` — new file (moved code).
- Tests are not expected to change behaviorally; imports of `../src/types` keep working
  via the directory index; `tests/picker.spec.ts` imports the package entry and is
  unaffected.
- Verification contract: full suite, `tsc --noEmit`, lint, format, build, and
  `openspec validate` must pass; `src/index.ts` public exports stay byte-identical.
