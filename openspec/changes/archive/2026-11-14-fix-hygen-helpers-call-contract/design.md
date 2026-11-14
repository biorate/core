# Design

## Context

See `proposal.md` — Why. Current state that shapes the approach:

- `engine.ts` resolves the helper namespace at bootstrap: `const hookHelpers = context({}, config).h`
  (`engine.ts:129`), before any hook runs and before any render. `context()` invokes the
  function-form factory with its `locals` argument verbatim, so this call passes `{}`.
- The resolved value is stamped into every `HookContext.h` (`makeCtx`) and passed to the
  class `prompt` section through `prompt(..., { h: hookHelpers })`.
- The render path is separate and unchanged: each template render calls
  `context(locals, config)`, which invokes the factory with that render's locals. That
  was the only factory call in 0.2.0.
- `params()` returns `cleanArgv` (flags only, no positionals) and, once generator and
  actions resolve, `_` (positionals) and `ts`. Hooks execute only after that validation,
  so `_` is available to the hook phase; `base._` is the parsed positional list.
- Hook args (`ctx.args`) are built as `{ name?, ...cleanArgv }` — they intentionally do
  not carry `_`. This design does not change them.
- `prompt()` resolves the action hook file first and early-returns `{}` when the action
  has no `prompt` section, so a lazy helper source is only observable when a section
  exists.

## Goals / Non-Goals

**Goals:**

- The helpers factory is never invoked outside rendering unless a hook context or the
  class `prompt` section actually reads `h`.
- Hook contexts get one helper namespace per run, resolved from the run's CLI arguments
  (including positionals under `_`), identical for every hook in that run.
- The render path keeps its 0.2.0/0.3.0 behavior exactly (one factory call per render,
  with that render's locals).
- The invocation contract is stated once, precisely, in docs and TSDoc.

**Non-Goals:**

- Changing `ctx.args` or adding positionals to it.
- Per-pair or name-aware hook helpers (the C1 variant): it makes `h` differ between
  pairs of one run and multiplies factory calls; it can be added later without
  redesigning this contract.
- Exposing prompt answers or per-template values to the hook helper namespace.
- Changing `context()`'s public behavior, defaults handling, or factory signature.
- Version bumps, changelog mechanics, or the defensive guard already present in
  downstream `.hygen.js` files.

## Decisions

### 1. Lazy, run-scoped provider in the engine, resolving with CLI arguments

Replace the bootstrap call with a memoized closure in `engine()`:

```ts
let hookHelpers: Helpers | undefined;
const getHookHelpers = (): Helpers =>
  (hookHelpers ??= context({ _: base._, ...cleanArgv }, config).h as Helpers);
```

- `context()` stays the single place that defines `h` (built-ins plus configured
  helpers, with its existing defaults logic), so no merge logic is duplicated.
- The engine owns run scope, which is exactly the lifetime the contract promises: one
  namespace per run.
- Positionals are included because render locals already carry `_` and eager factory
  validation keys on them; without `_` the factory would still be blind to the change
  being generated.

Alternatives considered:

- _Add a lazy provider/flag to `context.ts`_ — leaks the hook concern into the template
  context builder and needs extra config plumbing for no gain.
- _Keep the eager bootstrap call_ (status quo) — the regression this change fixes.
- _Resolve per hook from `ctx.args` (C1)_ — different `h` per pair, up to 2×pairs
  factory calls, surprising for stateful factories.

A **throwing** factory is not memoized: only a successful result is cached. A rejected
value cached in the closure would attribute the failure to whichever later hook phase
touched it first and hide the original stack. With no cache entry, the throw propagates
from that access and the next access retries — coherent with hooks being separate
phases.

### 2. `HookContext.h` is a getter backed by the provider

`makeCtx` builds the context with `get h() { return getHookHelpers(); }`.

- Hooks that never touch `h` (the common case, including all hookless runs) never invoke
  the factory outside rendering.
- Reading `h`, destructuring it, spreading it, or serializing the whole context triggers
  resolution; that is expected property-access semantics, not a hidden call.
- A factory throw surfacing during a hook's `h` access is thrown inside that hook and is
  handled by the existing hook error paths (project `beforeAll` failure skips pairs,
  pair-phase failure maps to skipped/failed per policy, `afterAll` errors are collected).
  No special wrapping or new error class.

Alternatives considered:

- _Plain resolved value_ (status quo) — reintroduces the empty-locals call.
- _Lazy wrapper object/proxy that merges built-ins_ — breaks the plain-object shape and
  identity expectations of `h`, for no behavioral gain over a getter.

### 3. `prompt()` accepts a lazy helper source

`prompt()`'s options become `{ h?: Helpers | (() => Helpers); cache?: HookCache }`. For a
class prompt section the input object is built with a getter over that source; a plain
value is passed through as before. The legacy `params` short-circuit keeps receiving the
built-in helpers exactly as today and is untouched.

Resolution therefore happens only when a class `prompt` section exists **and** reads
`h`. Note that the idiomatic `prompt({ h })` parameter destructuring counts as a read,
so most sections will resolve it; the laziness mainly protects hookless/`h`-free hooks
and sections that ignore helpers.

Alternative considered: resolve eagerly as soon as a section exists — simpler, but it
would call the factory even when the section ignores helpers and would make prompt
behavior inconsistent with hook behavior.

### 4. Hook helper locals are CLI arguments, not `ctx.args`

The provider receives `{ _: base._, ...cleanArgv }`: positionals, `ts` is not added,
flags as parsed, and deliberately **no** per-pair `name` and no prompt answers.

- Hook phases span the whole run/action, and prompt answers do not exist yet for
  `before*` hooks; a stable namespace avoids different `h` values across pairs.
- Per-name helper behavior belongs to templates, where locals already carry `name`.

This is an intentional difference from `ctx.args`; docs state both shapes so the
distinction is explicit rather than accidental.

### 5. Remove the bootstrap call outright — no config flag

There is no "skip bootstrap helpers" option. Lazy resolution makes such a flag
redundant, and a flag would preserve two code paths plus the empty-locals call this
change exists to remove. Downstream defensive guards such as
`if (locals._ === undefined) return { _ }` become no-ops and stay harmless.

### 6. Contract documented in docs and TSDoc, not as a "tolerate empty locals" rule

`docs/extensibility.md` currently says the function form is "evaluated per run", which
is inaccurate. The Function form section and the hook `h` field description are updated
to state: invoked for every template render (frontmatter attributes and body) with that
action's locals; lazily once per run with CLI arguments for hook contexts and the class
`prompt` section; the factory must be re-entrant and must not depend on per-template or
prompt-provided values. `HookContext.h` and `RunnerConfig.helpers` TSDoc repeat the short
form. The "MUST tolerate empty locals" requirement is not introduced because the runner
no longer produces that call.

## Risks / Trade-offs

- [A hook spreads or serializes the whole context, e.g. `{ ...ctx }`, resolving `h`
  even though no helper is used] → Accepted property-access semantics; the engine never
  spreads or serializes `HookContext` internally. Noted in the TSDoc.
- [Class `prompt({ h })` destructuring resolves the factory because the section was
  written to receive helpers, even if it does not call them] → Intended: the section
  declared a dependency on `h`. The regression scenario (configs without hooks) is
  unaffected.
- [Hook helper factory that used `locals.name` now receives `undefined`] → This is the
  contract being fixed: per-pair names are not hook-scope data. Covered by docs and the
  release note; downstream guards become unnecessary.
- [A factory throw moves from always-fatal-at-start to phase-scoped (e.g. pair skip
  under `--keep-going`)] → Intended and consistent with the lifecycle-hooks error model;
  covered by tests for `beforeAll` and pair phases.
- [Ordering dependency: `base._` is optional in the type but hooks only run after parser
  validation] → The provider still passes `{ _: base._, ...cleanArgv }`, never `{}`;
  implementation may narrow/assert `base._` at the hook boundary without changing
  behavior.
- [Render behavior accidentally touched] → The render path is not modified; existing
  `context`/`render` tests and the full suite remain the guard.

## Migration Plan

No data or API migration for templates. Release note for the next version: 0.3.0 called
the helpers factory at bootstrap with empty locals (regression for eager-validation
factories); it is removed, and hook `ctx.h` is now resolved once per run from CLI
arguments. Because hook `h` semantics change relative to published 0.3.0, a minor bump
(0.4.0) is the honest signal; the actual version is chosen by `lerna version`, not by
this change. Rollback is a plain revert to the previous engine/prompt wiring.

## Open Questions

None.
