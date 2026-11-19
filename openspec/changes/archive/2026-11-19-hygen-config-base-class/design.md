# Design

## Context

Class-based project configs (archived change `hygen-class-config`) are resolved by `normalizeProjectConfig` (`src/config-resolver.ts`): instantiate the default export, keep only own enumerable props inside `PROJECT_CONFIG_KEYS = ['templates', 'argCase', 'helpers', 'hooks']`, warn on unknowns. Prototype members are never read, so hooks live as a nested `hooks: {...}` object field. Action hooks (`src/types/hooks.ts`, `ActionHooks`) already use a class-with-methods pattern where prototype methods are the hook surface. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- A full-featured class experience for project configs: state in constructor-initialized fields, behavior in prototype methods (hooks), live `this`.
- One canonical base class (`HygenConfig`) owning the conversion; resolver stays simple (variant A).
- Zero behavior change for object configs and legacy class configs.

**Non-Goals:**

- Changing the `ProjectConfig` interface or `RunnerConfig` (transport fields `logger`/`exec`/`cwd`/`createPrompter` remain programmatic-only and are NOT part of the base class).
- Reworking action hooks (`ActionHooks`) — they already follow the class pattern; only documentation-level unification.
- Supporting base-class configs with constructor arguments (unchanged: no-arg instantiation).

## Decisions

**D1 — Variant A: base class owns the conversion.**
`HygenConfig` provides `toRunnerConfig()` (public) collecting `{templates, argCase, localsDefaults, helpers}` from `this` and `{beforeAll, beforeEach, afterEach, afterAll}` as `Function.prototype.bind(this)`-bound methods (only when overridden — a no-op base hook is omitted so the merge semantics of absent hooks stay intact). The resolver adds one branch: `instance instanceof HygenConfig` → `toRunnerConfig()`; everything else keeps the existing own-props path. Alternative (B): resolver walks the prototype itself against an extended key list — rejected: spreads hook-name knowledge into the resolver, manual `bind` bookkeeping, and implicit magic for non-base classes.

**D2 — `helpers` is a flexible member.**
The base declares `helpers?: Helpers | ((locals, config) => Helpers)` as an optional property (no initializer). All three subclass forms work without special runtime handling because `toRunnerConfig()` copies the value of `this.helpers` — for a method form, the method reference itself is the factory value (unbound, but the factory contract receives `(locals, config)` as arguments, `this` binding of a factory method is the instance only if the subclass uses arrow-style or bound access; `toRunnerConfig()` binds it like hooks to keep `this` alive). Getters resolve naturally on property read. Alternative: separate `getHelpers()` method name — rejected: diverges from the `ProjectConfig` key set.

**D3 — Abstract class, neutral constructor defaults.**
`abstract class HygenConfig` cannot be instantiated directly (compile-time guarantee); the constructor initializes `templates = undefined`, `argCase = 'keep'`, `localsDefaults = undefined`, `helpers = undefined` explicitly so field initialization order in subclasses is deterministic. Base hook methods are no-ops returning `undefined`.

**D4 — Hook omission preserves merge semantics.**
`toRunnerConfig()` includes a hook in the produced `hooks` object only if the subclass overrode it (detected via `this.beforeAll !== HygenConfig.prototype.beforeAll`). Composition code (`before*`: project → action, `after*`: action → project) already treats absent hooks as no-ops; keeping absent hooks absent avoids re-wrapping and keeps snapshot-free behavior identical between object and base-class configs.

**D5 — Placement and exports.**
New module `src/hygen-config.ts`; `HygenConfig` re-exported from `src/index.ts` alongside `ProjectConfig`. The resolver imports only the type + class reference (no cycle: `hygen-config.ts` imports types only).

## Risks / Trade-offs

- [Subclass field `helpers = {...}` shadows a `helpers()` method override silently] → TypeScript allows both; document that the property wins (own field shadows prototype method) and recommend one form per class. Runtime behavior is well-defined either way (own property read).
- [`instanceof` fails if two package copies end up in the module graph] → same exposure as existing `instanceof Error`-style checks in the codebase; monorepo workspace resolution keeps a single copy; noted in docs.
- [Base-class state fields (unknown keys) previously warned] → base-class instances skip the unknown-key warning entirely (they are validated by construction); legacy classes keep the warning. Tested explicitly.
- [Hook detection via prototype comparison breaks if a subclass wraps `super.beforeEach` — still fine] → the override chain produces a different function reference than the base, so detection works; direct `HygenConfig.prototype.beforeAll` reassignment is not a supported pattern.

## Migration Plan

1. Add `HygenConfig` + resolver branch + tests in one change (fully additive; default behavior unchanged).
2. Docs updated in the same change (README examples with property/getter/method helpers forms, AGENTS file table).
3. Rollback: remove the branch and export; no persisted formats are affected.

## Open Questions

None.
