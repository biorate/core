# Proposal

## Why

`@biorate/hygen` 0.3.0 resolves the config `helpers` factory once at run bootstrap
(`context({}, config).h`, `engine.ts`) in addition to the pre-existing per-render call
with real locals. Any function-form `helpers` factory with eager validation — the normal
shape for a non-trivial `.hygen.js` — now throws on every run, even when the run declares
no lifecycle hooks and never reads the helper namespace. This is a regression introduced
by the lifecycle-hooks change, shipped in a published version without a breaking-change
note.

The same bootstrap call is also semantically wrong for the hooks feature it was added
for: hook contexts receive helpers resolved from **empty locals**, so a locals-aware
factory cannot contribute anything meaningful to `ctx.h` and every consumer has to add a
defensive `locals._ === undefined` escape hatch.

## What Changes

- **BREAKING** (relative to 0.3.0): the helpers factory is no longer invoked at run
  bootstrap. Hook contexts (and the class `prompt` section) receive a helper namespace
  resolved lazily, once per run, from the CLI arguments (`{ _: positionals, ...flags }`)
  instead of from an empty locals object.
- The per-render factory call with the action's actual locals is unchanged; the render
  pipeline keeps its 0.2.0 behavior exactly.
- Helper resolution for hooks stays lazy: a run whose hooks never read `ctx.h` and whose
  hooks class has no `prompt` section never invokes the factory outside rendering.
- The factory contract becomes explicit and documented: when it is called, with what
  locals, how many times per run, and the expectation that it is re-entrant and does not
  depend on per-template data.
- Regression coverage: an eager-validation factory with a hook-less config must run
  green; hook helper resolution must pass CLI arguments (including `_`); resolution must
  happen at most once per run and be identical across hooks of the same run.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `hygen-generator`: documents and fixes the helpers factory invocation contract — a new
  requirement pins when and with which locals the factory runs, including lazy
  once-per-run resolution with CLI arguments for lifecycle hook contexts, and forbids
  invoking it with an empty locals object outside rendering.

## Impact

- `packages/@biorate/hygen/src/engine.ts` — remove the bootstrap resolution, add the
  lazy once-per-run provider used by hook contexts and the prompt call.
- `packages/@biorate/hygen/src/prompt.ts` — accept a lazy helper provider for the class
  `prompt` section instead of an already-resolved `Helpers` value.
- `packages/@biorate/hygen/src/types.ts` — TSDoc for `HookContext.h`.
- `packages/@biorate/hygen/docs/extensibility.md` — function-form contract and the hook
  `h` field description.
- `packages/@biorate/hygen/tests/` — new specs/fixtures for the contract and regression.
- Published package semantics: hook `ctx.h` changes relative to 0.3.0; the next release
  should carry the regression note (version bump stays with `lerna version`).
