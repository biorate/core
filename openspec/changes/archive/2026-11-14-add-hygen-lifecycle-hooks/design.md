# Design

## Context

See `proposal.md` — Why. The relevant current state:

- `src/prompt.ts` resolves a per-action hook from a fixed list
  (`index.js`, `index.ts`, `prompt.cjs`, `prompt.js`, `prompt.ts`), imports it
  dynamically, unwraps `default`, then dispatches on `params` / `prompt` /
  question array. It returns only the prompt answers — there is no object to
  hang lifecycle state on.
- `src/engine.ts` owns the run: `names` outer × `actions` inner. Per pair it
  resolves `actionfolder`, calls `prompt()`, builds `args`, then `render` →
  `execute`, pushing `ActionResult`s and `ActionStatusEntry`s. Failures are
  caught per pair (`ShowHelpError` wrapping, `KeepGoingError` collection) and a
  single pair × single action run rethrows the original error byte-compatibly.
- `src/config-resolver.ts` walks up from `cwd` for `.hygen.{js,cjs,mjs,ts}` and
  spreads the nearest match into `RunnerConfig`; there is no validation of the
  merged fields.
- `RunnerConfig` has no hook fields; `ActionResult`/`ActionStatusEntry`/
  `RunFailure` are the public result surface and must not grow new required
  fields.

The design keeps the existing extension points intact and adds lifecycle as an
additive layer around the pair pipeline.

## Goals / Non-Goals

**Goals:**

- One loader that resolves either a new `hooks.*` class module or a legacy hook
  module and normalizes both into a lifecycle-capable object.
- A single hooks instance per action run, so instance fields carry state across
  name expansions.
- Project-level hooks that compose with action-level hooks in a fixed,
  Jest-like order.
- Hook failures visible through the existing `statuses` / `failures` contract,
  including `--keep-going` and single-run byte-compatible rethrow.
- Zero behavior change for projects and actions that use no hooks.

**Non-Goals:**

- No render-phase hooks (`beforeRender` / `afterRender`), no per-file hooks.
- No class form for project-level hooks (plain object only).
- No change to helpers, transforms, `exec`, injection or the picker.
- No new status values: the `ok | skipped | failed` model is retained.

## Decisions

### 1. New `hooks.*` action file with a class default export

Resolution order in the action folder: `hooks.ts`, `hooks.js`, `hooks.mjs`,
`hooks.cjs`, then the legacy list (`index.js`, `index.ts`, `prompt.cjs`,
`prompt.js`, `prompt.ts`). First existing file wins; nothing else is loaded.

- New candidates are searched first so a `hooks.ts` can coexist with a stale
  `prompt.js` without ambiguity.
- `hooks.*` **must** export a class as `default`; if it exports a non-class
  value or the module has no `default`, throw a new `HookModuleError`
  (`BaseError` subclass, per the monorepo error standard) naming the file and
  the expected shape.
- Alternatives considered: reuse `index.ts` for the class (rejected: silently
  changes the meaning of an existing legacy filename); a separate
  `lifecycle.ts` next to `prompt.js` (rejected: two files and two resolution
  rules for one action).

### 2. One normalizer in `prompt.ts`

`prompt.ts` gains `resolveActionHooks(actionfolder)` returning a cached
`{ instance, kind: 'class' | 'legacy' | 'none' }`:

- `class` → instantiate the default export once and reuse the instance for the
  whole run.
- `legacy` → wrap the existing module as an object exposing only the prompt
  behavior (its current `params` / `prompt` / question-array dispatch); the four
  lifecycle methods stay `undefined` and are skipped as no-ops.
- `none` → an empty object.

The cache is keyed by resolved action folder and held in a `Map` scoped to a
single `engine()` call (created in `engine`, passed down as a parameter, not a
module-level global), so two concurrent embedded runs cannot share instances.
`prompt()` keeps its current signature and behavior by delegating to
`resolveActionHooks(actionfolder).instance`. It gains one optional trailing
argument — the resolved helper namespace — used only by the class prompt
section; legacy modules keep receiving the built-in helpers exactly as today,
so their behavior stays byte-compatible.

- Alternative considered: resolve and import the hook module inside the pair
  loop (rejected: re-imports and re-instantiates per pair, destroying state).

### 3. Hook context and hook object contracts

```ts
interface HookContext {
  cwd: string;
  templates: string;
  generator: string;
  action: string; // 'new' or 'new:subaction' as requested
  subaction?: string;
  name?: string; // current name expansion
  args: Record<string, unknown>; // CLI flags + name (before prompt answers)
  h: Helpers; // resolved helpers: built-in + project (as `context()` builds them)
  logger: Logger;
  dry: boolean;
}

type HookMethod = (ctx: HookContext) => unknown | Promise<unknown>;
interface ActionHooks {
  beforeAll?(ctx: HookContext): unknown | Promise<unknown>;
  beforeEach?(ctx: HookContext): unknown | Promise<unknown>;
  afterEach?(ctx: HookContext, results: ActionResult[]): unknown | Promise<unknown>;
  afterAll?(ctx: HookContext, results: ActionResult[]): unknown | Promise<unknown>;
  prompt?(input: {
    prompter: Prompter<any, any>;
    args: Record<string, unknown>;
    h: Helpers;
  }): unknown;
}
```

`ctx.args` deliberately excludes prompt answers for `beforeEach` (they do not
exist yet) and the `afterEach`/`afterAll` result arrays are the pair's
`ActionResult`s. `subaction` is derived by the same `action.split(':')` the
engine already uses.

Project hooks are the same four methods as a plain object under the existing
config: `RunnerConfig.hooks?: ProjectHooks`. Non-function values are ignored
with a `logger.warn`, so a malformed config degrades instead of crashing a run.

- Alternative considered: a class for project hooks (rejected: the config file
  is a plain export and a class would force constructor ceremony for a level
  that rarely needs state; a closure covers the rare case).
- Alternative considered: passing `results` also to `beforeEach` (rejected:
  there are none yet).

### 4. Lifecycle ordering and timing

For a run of generator `G` expanding names `n1..nk` and actions `a1..am`:

```
project.beforeAll
  action.beforeAll (per distinct action, once)
    for each pair (name, action):
      project.beforeEach
      action.beforeEach
      prompt phase (class prompt section or legacy hook or prompter)
      render -> execute
      action.afterEach(results)
      project.afterEach(results)
  action.afterAll (per distinct action, once)
project.afterAll
```

`beforeAll`/`afterAll` are per **level and action**: `action.beforeAll` runs
once before the pairs of that action (the engine's action loop, not per name),
and `project.beforeAll`/`afterAll` run once per `engine()` call. `before*`
order is project → action; `after*` order is action → project.

- The loop stays name-outer × action-inner as today, so hook call order for
  multiple actions is action grouping per name. `action.beforeAll` is therefore
  invoked lazily on the first pair of that action and `action.afterAll` when the
  action's pairs are exhausted; for a single action this is exactly "once
  around the name loop".
- Alternative considered: reorganize to action-outer × name-inner for cleaner
  grouping (rejected: changes the observable order of prompts and output for
  multi-action runs).

### 5. Failure semantics

Per pair, the engine tracks `beforeEach` outcomes per level and the `afterEach`
outcomes per level; per action it tracks `beforeAll`/`afterAll` outcomes.

- `beforeAll` (either level) throws → every pair it guards is marked `failed`
  with the hook message (status entry + `RunFailure` when the run continues),
  its prompt/render/execute is skipped, and the matching `afterAll` still runs.
  A project `beforeAll` failure guards all pairs; an action `beforeAll` failure
  guards that action's pairs and leaves other actions untouched.
- `beforeEach` (either level) throws → that pair is skipped and marked `failed`
  with the hook message; both `afterEach` levels still run for that pair.
- `afterEach` / `afterAll` throws → the run is marked failed. Pair-attributable
  `afterEach` failures use that pair's `action`/`name`; run-scoped failures
  (`afterAll`, and `beforeAll` with no pair to guard) are reported with the
  sentinel `action: '*'` and no `name`, documented as run scope.
- Single pair × single action run: the original hook error is rethrown
  unchanged (no wrapper), matching `engine.ts`'s existing byte-compatible rule.
- Multi-pair without `--keep-going`: throw `ShowHelpError` with the pair label,
  as today. With `--keep-going`: collect the hook failure into `failures` and
  push `{ ...pair, status: 'failed' }`, then continue — a per-pair cleanup
  failure therefore never aborts the remaining pairs.
- A failing `afterAll`/project `afterEach` after otherwise-green pairs ensures
  the run still ends in `KeepGoingError` (or the thrown error) rather than a
  success result, so CI cannot mistake a cleanup failure for a pass.

- Alternative considered: aborting immediately on `afterEach` failure even under
  `--keep-going` (rejected: defeats the flag's purpose and skips remaining
  cleanup).

### 6. Dry mode

Hooks are invoked exactly as in a normal run and receive `ctx.dry` from
`base.dry`. The engine does not gate hook calls on `dry`; only the existing
file operations remain suppressed. This lets a hook log what it would do and
keeps ordering testable in dry mode.

### 7. TypeScript and module formats

`hooks.ts` registers `ts-node/register/transpile-only` lazily, exactly like the
legacy TS prompt hooks and `.hygen.ts`, and rethrows a `ConfigTsNodeError`-style
error when registration fails. `hooks.mjs` / `hooks.cjs` / `hooks.js` are loaded
via the same dynamic `import()` path already used for legacy hooks, so Node's
extension-based module semantics apply untouched.

### 8. Types and public surface

- `types.ts`: add `HookContext`, `ActionHooks`, `ProjectHooks`, `HookMethod`;
  extend `RunnerConfig` with `hooks?: ProjectHooks`.
- `errors.ts`: add `HookModuleError` (invalid/missing default class) and
  `HookTsNodeError` (ts-node registration failure), both `BaseError` subclasses.
- `RunnerResult` and `ActionResult` shapes are unchanged; the `'*'` sentinel is
  a value, not a new field.
- No new exports beyond the types; `prompt()` keeps its signature.

## Risks / Trade-offs

- **[Instance state leaks between pairs]** → This is the intended contract
  (documented as "like one `describe` block"); a hook that must reset does so in
  `beforeEach`. Documented with an explicit example.
- **[Hook module imported once and cached per run]** → An embedder mutating the
  action folder between two `engine()` calls in one process still gets a fresh
  instance because the cache is per call; a stale module path is not an issue.
- **[`ts-node` startup cost]** → Registration stays lazy and only for `.ts`
  files, so JavaScript-only projects pay nothing.
- **[Run-scoped `'*'` sentinel surprises API consumers]** → Documented in the
  hooks guide and covered by a test asserting `action: '*'` with no `name`; no
  type change, so existing consumers do not break.
- **[A throwing `afterAll` after green pairs]** → Deliberately fails the run;
  the error message names the hook ("afterAll failed: …") so cleanup problems
  are not silently swallowed.
- **[Project hooks merged from an untrusted `.hygen.*`]** → Only functions are
  accepted, unknown keys are ignored with a warning; the config was already
  executable code, so this adds no new trust boundary.

## Migration Plan

Purely additive; no user migration is required.

- Ship as a minor release of `@biorate/hygen`.
- Existing `.hygen.*` configs and `prompt.*` / `index.*` action hooks keep
  working; they simply have no lifecycle methods.
- Docs: `docs/extensibility.md` gains a "Lifecycle hooks" section (action class,
  project object, ordering diagram, failure table, dry mode) and
  `docs/prompts.md` points at the class `prompt` section as the preferred form
  while marking `prompt.js` as supported legacy.
- Rollback: revert the release. Actions that adopted `hooks.*` would then fall
  back to no hooks (their files are ignored by older versions), so no config
  change is needed to roll back, but their lifecycle behavior is lost.

## Open Questions

- Render-phase hooks (`beforeRender`/`afterRender`) and per-file hooks are
  deferred. They can be added later as new optional methods without altering
  the specs, the ordering rules, or the task breakdown in this change.
