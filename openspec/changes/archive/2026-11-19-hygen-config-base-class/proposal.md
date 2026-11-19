# Proposal

## Why

The class form of a `.hygen.*` project configuration currently works as a field container: `normalizeProjectConfig` reads only the instance's own enumerable properties, so hooks and helpers must be declared as nested objects (`hooks: {beforeEach(...)}`), prototype methods are ignored, and the class never behaves like a real class (no live `this`, no constructor-initialized defaults). Action hooks already use the class-with-methods pattern; the project config is the last object-container left. A base class makes the config a full-featured class with behavior on the prototype and state initialized in the constructor.

## What Changes

- Add an abstract exported base class `HygenConfig` to the package public API:
  - constructor initializes all project-config fields available to the base (`templates`, `argCase` with default `'keep'`, `localsDefaults`, `helpers`) with neutral defaults;
  - lifecycle hooks declared as prototype methods `beforeAll(ctx)`, `beforeEach(ctx)`, `afterEach(ctx, results)`, `afterAll(ctx, results)` (no-op in the base, overridden by subclasses);
  - `helpers` declared as an optional member usable in three forms by a subclass: property, getter, or factory method `(locals, config) => Helpers`;
  - a `toRunnerConfig()` conversion collecting fields plus bound hook methods.
- `normalizeProjectConfig` resolves a default-export class via `instanceof HygenConfig` → `toRunnerConfig()` (variant A); classes not extending the base and plain objects keep the existing own-props path unchanged (legacy compatibility).
- Update the `Project configuration file` requirement in the `hygen-generator` spec and the docs (`README.md`, package `AGENTS.md`); `ProjectConfig` interface stays unchanged as the object-form contract.

No breaking changes: object configs and legacy class configs (own-props) behave exactly as before.

## Capabilities

### New Capabilities

<!-- None. -->

### Modified Capabilities

- `hygen-generator`: the `Project configuration file` requirement's class-resolution path is extended — a default-export class extending the exported `HygenConfig` base class is resolved through the base class conversion (prototype hook methods and helpers forms participate), while the own-props resolution remains the fallback for non-base classes.

## Impact

- `packages/@biorate/hygen/src/` — new `hygen-config.ts` (base class), `config-resolver.ts` (instanceof branch), `types/config.ts` (docs/typing alignment), `index.ts` (export).
- Tests: unit specs for base-class resolution (hook methods on prototype with live `this`, helpers as property/getter/method, constructor defaults, legacy own-props class and object configs unchanged, unknown-member handling).
- Docs: `README.md`, `packages/@biorate/hygen/AGENTS.md`; `openspec/specs/hygen-generator/spec.md` updated at archive.
- Consumers: existing `.hygen.*` object and legacy class configs unaffected; new base class is opt-in.
