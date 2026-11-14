# Proposal

## Why

Generators can only extend a single point of the run: the per-action prompt hook
(`prompt.js` / `index.js`). There is no place to prepare and tear down state around
generation — spin up a container, create a database, record created files, run
formatters, or roll back on failure. Users currently duplicate that setup in every
prompt hook, and a prompt hook that needs cleanup has nowhere to put it.

The prompt hook is also an unstructured plain module (`params` / `prompt` /
question array), so there is no contract for carrying state across the phases of a
run.

## What Changes

- Add a per-action **hooks file** `hooks.ts` / `hooks.js` / `hooks.mjs` / `hooks.cjs`
  in `_templates/<generator>/<action>/`, exporting a class with:
  - the prompt section (`prompt({ prompter, args, h })`, replacing `prompt.js`),
  - lifecycle methods `beforeAll`, `beforeEach`, `afterEach`, `afterAll`.
    One class instance lives for the whole action run, so fields carry state between
    pairs.
- Add project-level lifecycle hooks as an optional `hooks` field in the existing
  `.hygen.*` configuration file, with the same four methods (plain object).
- Compose levels like nested test suites: project hooks wrap action hooks
  (`before*`: project → action, `after*`: action → project).
- Define lifecycle unit and ordering: `beforeAll`/`afterAll` run once per run/action,
  `beforeEach`/`afterEach` run around each `(name, action)` pair — `beforeEach`
  before prompting, `afterEach` after execution with the pair's results.
- Adopt Jest-like failure semantics: a failed `beforeAll` skips its pairs and still
  runs the matching `afterAll`; a failed `beforeEach` skips the pair but still runs
  `afterEach`; hook failures mark the run failed and are reported through the
  existing `statuses` / `failures` model.
- Keep backward compatibility: `prompt.js`, `index.js` and `index.ts` hooks keep
  working exactly as today with no lifecycle methods (**no breaking changes**).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `hygen-generator`: the interactive-prompts requirement gains the class-based
  `hooks.*` action file and lifecycle phases; the project-configuration-file
  requirement gains the optional `hooks` field with lifecycle methods and its
  composition order.

## Impact

- `packages/@biorate/hygen/src/prompt.ts` — hook resolution and class/legacy
  normalization, prompt section dispatch.
- `packages/@biorate/hygen/src/engine.ts` — lifecycle invocation around the
  name/action loops, failure and status integration.
- `packages/@biorate/hygen/src/config-resolver.ts` — project-level `hooks` field
  passthrough.
- `packages/@biorate/hygen/src/types.ts` — `HookContext`, `ActionHooks`,
  `ProjectHooks` public types.
- `packages/@biorate/hygen/docs/extensibility.md`, `docs/prompts.md` — user guide.
- Tests for the package (resolution priority, ordering, error semantics, dry mode).
