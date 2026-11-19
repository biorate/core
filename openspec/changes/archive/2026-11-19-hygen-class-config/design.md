# Design

## Context

The project config is resolved in `packages/@biorate/hygen/src/config-resolver.ts`: a
`ConfigResolver` walks directories up, loads the winning candidate with a dynamic
`import()` (lazily registering `ts-node` for `.hygen.ts`), and the result is spread into
the effective `RunnerConfig`. The spread operates on the raw module namespace, so:

- named exports work (they become own keys of the namespace);
- `export default { ... }` collapses into a stray `default` key (verified against
  `ts-node` transpile-only: the spread yields `{ default: {...} }`);
- there is no class handling at all.

The hooks loader (`src/prompt.ts`) already unwraps `module.default ?? module` for hook
modules — the config path simply lacks the same normalization layer. See proposal.md for
motivation.

## Goals / Non-Goals

**Goals:**

- One normalization function between `import()` and the config merge, shared by all four
  config-file formats and both build outputs (CJS, ESM).
- Class form: `new C()` → own enumerable properties, minimal key set, warn on unknowns.
- A compile-time-only `ProjectConfig` interface exported from the package root.

**Non-Goals:**

- No runtime base class exported by the package (no `instanceof` coupling); caching of
  expensive helpers is the user's own idiom (own field initialized in the class body —
  prototype getters are not read by design).
- No function default exports (factories).
- No new config keys; `templatesOverride` and `debug` stay programmatic-only.
- No change to resolution order, directory walk, or hooks merge semantics.

## Decisions

1. **Normalization priority: named exports > default.** A module namespace may carry
   both (e.g. TS transpiled to CJS puts `export default` into `exports.default` alongside
   named fields). Keeping named-first preserves current behavior exactly; the default
   export only applies when it is the sole export. Rationale: backward compatibility is
   the hard constraint; alternative (default-first) would silently change existing
   configs that mix both forms.
2. **Class resolution reads own enumerable properties, not the prototype.** A simple,
   one-line documentable rule. Consequence: a cached-getter pattern
   (`get helpers() { return (this.#h ??= ...) }`) does not work; the documented idiom is
   an own field initialized in the class body (`helpers = this.#build()`). Alternative —
   reading known keys via property access — would enable prototype getters but adds a
   key list to maintain in two places and blurs the rule; rejected as over-engineering
   (user decision, explore session).
3. **Known key set = `ProjectConfig` keys (`templates`, `argCase`, `helpers`, `hooks`).**
   The interface is the single source of truth for both typing and the warn-on-unknown
   check, mirroring the lenient validation precedent for project hooks
   (`prompt.ts` warns and ignores unknown/non-function hooks).
4. **Constructor failure → standardized error.** A new `BaseError`-derived class in
   `src/errors.ts` naming the config file, consistent with `ConfigTsNodeError` /
   `HookModuleError`. Instantiation is wrapped so any constructor throw surfaces as this
   error (message keeps the original cause text).
5. **No runtime coupling to the interface.** The interface is type-only; plain-object
   and class configs need no import for the runner to work. This keeps `.hygen.cjs`
   projects (which cannot cheaply import ESM types) on equal footing.
6. **Deliberate behavior change for `export default {...}`: broken → working.** The
   stray `default` key currently lands in the config as dead weight; removing it is not
   a realistic break. Recorded in proposal and covered by a regression test asserting
   the object's fields merge.

## Risks / Trade-offs

- [Strict own-enumerable excludes prototype getters] → Mitigation: document the own-field
  caching idiom explicitly; warn never fires for prototype members since they are not
  read at all.
- [CJS/ESM divergence in what `import()` returns] → Mitigation: normalization handles
  both shapes (namespace with `default`, flat CJS `module.exports`); regression tests run
  under both build outputs (the package already has split CJS/ESM test conventions, e.g.
  `config-cjs.spec.ts`).
- [Users relying on the `default` key reaching the config] → Practically impossible to
  depend on intentionally; accepted and documented.
- [ts-node not installed for `.hygen.ts` class configs] → Same as today: the existing
  `ConfigTsNodeError` path applies unchanged; docs already tell users to install
  `ts-node`.

## Migration Plan

Additive change; no migration. Rollback = revert the normalization (existing named-export
configs are untouched by the new code path).

## Open Questions

None — format decisions were settled in the explore session (strict own-enumerable,
minimal key set, warn on unknowns).
