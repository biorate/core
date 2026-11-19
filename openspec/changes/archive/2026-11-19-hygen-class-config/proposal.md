# Proposal

## Why

The project configuration file family (`.hygen.js/.cjs/.mjs/.ts`) currently accepts only
named-export fields; an `export default { ... }` is silently broken (the resolver spreads
the module namespace, so the config collapses into a stray `default` key). Additionally,
projects that prefer the class style used by action hooks (`hooks.ts` → `export default
class`) cannot express their project config the same way. Supporting a default-exported
class — and fixing default-object resolution — gives one consistent, typed, one-class-per-
project idiom while keeping every existing config form working.

## What Changes

- Add export normalization to the project config resolver (`packages/@biorate/hygen/src/config-resolver.ts`):
  - Named exports keep working exactly as today (highest priority when present).
  - `export default { ... }` (plain object) now resolves to the object — fixing the
    currently broken spread-of-namespace behavior. This is the only intentional behavior
    change; today such configs silently fail to apply.
  - `export default class Config { ... }` is supported: the resolver instantiates the
    class with no constructor arguments and reads the instance's **own enumerable**
    properties as the config. Prototype getters/methods are NOT read. Class methods are
    never treated as helpers.
  - A class whose constructor requires arguments produces a standardized config error.
  - Function default exports (factories) are out of scope.
- Add a `ProjectConfig` interface (minimal key set: `templates`, `argCase`, `helpers`,
  `hooks`) exported from the package root, for compile-time typing of config classes
  (`export default class Config implements ProjectConfig`). Runtime behavior does not
  depend on the interface (no base class, no `instanceof` check).
- Warn (logger.warn, same style as unknown project hooks) when a class instance exposes
  own enumerable fields outside the known `ProjectConfig` key set; the unknown fields are
  ignored.
- Update documentation (`docs/extensibility.md`, docs site) to describe the class form
  and replace the now-stale "Plain object, not a class" statement.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `hygen-generator`: the "Project configuration file" requirement is extended — the
  config file may default-export a plain object or a class (resolved to the instance's
  own enumerable properties), with warning on unknown fields and a standardized error for
  unconstructible classes; named-export configs remain unchanged.

## Impact

- `packages/@biorate/hygen/src/config-resolver.ts` (normalization), `src/types/config.ts`
  (+ re-export from `src/index.ts`), `src/errors.ts` (new standardized error class).
- Tests: `tests/config-resolver.spec.ts`, new class-config fixture/spec; CJS and ESM
  build passes must both be covered.
- Docs: `docs/extensibility.md`, `site/src/pages/index.tsx`, README section if needed.
- Compatibility: existing named-export configs, `.hygen.cjs` `module.exports = {...}`,
  and `.hygen.js` host-module behavior are unchanged; `export default {...}` moves from
  broken to working (deliberate fix, documented).
