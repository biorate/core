# Spec Delta

## ADDED Requirements

### Requirement: Action hooks file resolution

The runner SHALL look for an action hook module in the action folder in this
priority order: `hooks.ts`, `hooks.js`, `hooks.mjs`, `hooks.cjs`, then the legacy
`index.js`, `index.ts`, `prompt.cjs`, `prompt.js`, `prompt.ts`. The first existing
candidate SHALL be used and no other candidate SHALL be loaded.

#### Scenario: Hooks file wins over legacy prompt hook

- **WHEN** an action folder contains both `hooks.ts` and `prompt.js`
- **THEN** the runner loads `hooks.ts` and ignores `prompt.js`

#### Scenario: Module formats honored

- **WHEN** the action folder contains `hooks.cjs`, `hooks.mjs`, or `hooks.js`
- **THEN** the runner loads it with the module-system semantics of that extension

#### Scenario: Legacy hook unchanged

- **WHEN** an action folder contains only `prompt.js` or `index.js`
- **THEN** the runner treats it as before and runs no lifecycle methods

#### Scenario: No hook file

- **WHEN** an action folder contains no hook candidate
- **THEN** the run proceeds with CLI-supplied and prompted values only and no error

### Requirement: Action hooks class contract

A `hooks.*` module SHALL export a class as its default export. The runner SHALL
construct one instance per action run and use it for every pair of that action, so
instance fields carry state across pairs. Every method SHALL be optional and MAY be
asynchronous.

#### Scenario: State carried across pairs

- **WHEN** `hooks.ts` increments an instance counter in `beforeEach` and the run
  expands two names
- **THEN** the second `beforeEach` sees the counter incremented by the first

#### Scenario: Minimal hooks class

- **WHEN** the class defines only `afterAll`
- **THEN** missing lifecycle methods are treated as no-ops and the run succeeds

### Requirement: Prompt section in the hooks class

When the hooks class defines `prompt({ prompter, args, h })`, the runner SHALL call
it in place of prompting for unresolved values, and its resolved object SHALL become
the template variables for the pair. The legacy `params`, `prompt`, and
question-array shapes SHALL keep their current behavior for legacy hook files.

#### Scenario: Prompt section supplies variables

- **WHEN** the hooks class returns `{ componentName: 'button' }` from its prompt
  section and a template uses `<%= componentName %>`
- **THEN** the rendered output contains `button`

### Requirement: Lifecycle unit and order

The runner SHALL call `beforeAll` once per run before the pair loops and `afterAll`
once per run after them. It SHALL call `beforeEach` before the pair's prompt phase
and `afterEach` after the pair's execution, passing the pair's results. Both pair
hooks SHALL receive the pair's `name` and `action`.

#### Scenario: Per-pair hooks around one pair

- **WHEN** a run expands one action and one name with all four methods defined
- **THEN** the call order is `beforeAll`, `beforeEach`, generation, `afterEach`,
  `afterAll`

#### Scenario: Pair hooks repeat per expansion

- **WHEN** a run expands one action over two names
- **THEN** `beforeEach` and `afterEach` run twice while `beforeAll` and `afterAll`
  run once

#### Scenario: afterEach receives results

- **WHEN** the pair created a file and `afterEach(ctx, results)` is defined
- **THEN** `results` contains the pair's operation outcomes

### Requirement: Lifecycle composition across levels

Project-level hooks SHALL wrap action-level hooks: `beforeAll` and `beforeEach` run
project hooks first, `afterEach` and `afterAll` run action hooks first.

#### Scenario: Both levels defined

- **WHEN** the project config declares `hooks.beforeEach` and the action declares
  `beforeEach`
- **THEN** the project hook runs before the action hook, and their `afterEach`
  counterparts run in reverse order

### Requirement: Lifecycle failure semantics

A failing `beforeAll` SHALL skip every pair of that level and the matching
`afterAll` SHALL still run. A failing `beforeEach` SHALL skip its pair while
`afterEach` still runs for both levels. A failing `afterEach` or `afterAll` SHALL
mark the run as failed. Hook failures SHALL be reported through the existing
`statuses`/`failures` model with the hook error message.

#### Scenario: beforeAll failure

- **WHEN** the action's `beforeAll` throws and the run expands two names
- **THEN** neither pair is generated, `afterAll` still runs, and the run fails

#### Scenario: beforeEach failure with keep-going

- **WHEN** `beforeEach` throws for one pair of a `--keep-going` run
- **THEN** that pair is recorded as failed while the remaining pairs still generate

#### Scenario: afterEach failure

- **WHEN** every pair generated successfully but `afterEach` throws
- **THEN** the run is reported as failed with the hook error message

### Requirement: Lifecycle hooks in dry mode

The runner SHALL call lifecycle hooks in `--dry` mode and SHALL expose the dry flag
to them, leaving side effects to the hook's own decision.

#### Scenario: Dry run still runs hooks

- **WHEN** `--dry` is passed and the action defines `beforeAll`
- **THEN** `beforeAll` runs and receives a context whose dry flag is true, while no
  files are written

## MODIFIED Requirements

### Requirement: Interactive prompts

The generator SHALL execute the action's hook module — `hooks.*` (class-based) or the
legacy `prompt.*`/`index.*` — and provide its results as template variables; CLI
flags `--flag VALUE` and positional arguments MUST also become variables.

#### Scenario: Prompt fills a variable

- **WHEN** the generator directory contains `prompt.js` and `hygen mygen with-prompt` is executed
- **THEN** the user's answer is available to templates as a variable

#### Scenario: Hooks class prompt section fills a variable

- **WHEN** the action folder contains `hooks.ts` with a `prompt` section and
  `hygen mygen with-prompt` is executed
- **THEN** the answers returned by that section are available to templates as
  variables

### Requirement: Project configuration file

The runner SHALL resolve project-level configuration from a prioritized family of
configuration file names, walking directories up from the current directory,
and merges the nearest match into the effective runner configuration. The merged
configuration MAY carry an optional `hooks` object with lifecycle methods that apply
to every generator run.

#### Scenario: Single config file resolution

- **WHEN** a project contains only a `.hygen.js` at or above the current directory
- **THEN** the runner loads it and merges its exports into the runner configuration

#### Scenario: Candidate priority

- **WHEN** multiple configuration candidates exist in the same directory
  (`.hygen.js`, `.hygen.cjs`, `.hygen.mjs`, `.hygen.ts`)
- **THEN** the runner uses exactly one file, in the priority order
  `.hygen.js` → `.hygen.cjs` → `.hygen.mjs` → `.hygen.ts`

#### Scenario: Nearest directory wins

- **WHEN** configuration candidates exist in several directories along the
  path from the current directory to the filesystem root
- **THEN** the nearest directory containing any candidate determines the
  resolved file, and only that file is loaded

#### Scenario: No configuration file present

- **WHEN** no candidate exists in any walked directory
- **THEN** the runner proceeds with no project configuration and no error

#### Scenario: TypeScript configuration file

- **WHEN** the resolved file is `.hygen.ts`
- **THEN** the runner loads it as TypeScript (on-the-fly transpilation) and
  merges its exports into the runner configuration

#### Scenario: Explicit module systems

- **WHEN** the resolved file is `.hygen.cjs` (CommonJS) or `.hygen.mjs` (ESM)
- **THEN** the runner loads it with the corresponding module-system semantics,
  independent of the host project's `type` field

#### Scenario: Backward compatibility

- **WHEN** a project uses an existing `.hygen.js` configuration
- **THEN** resolution and merge behavior is unchanged from prior versions

#### Scenario: Project lifecycle hooks apply to every run

- **WHEN** the resolved project configuration exports a `hooks` object with
  `beforeAll` and `afterAll`
- **THEN** both run once around any generator run, regardless of the generator and
  action names
