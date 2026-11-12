# hygen-generator — Delta

## ADDED Requirements

### Requirement: Template mirroring

The runner SHALL support opt-in mirroring: when a template declares `mirror: true` and
has no `to:`, its rendered body SHALL be written to the path mirroring the template's
location inside the action folder, with the template suffix resolved per the suffix
convention.

#### Scenario: Mirror with default suffix rule

- **WHEN** a template `parts/header.ejs.t` declares `mirror: true` and no `to:`
- **THEN** the rendered body is written to `<cwd>/parts/header.ejs` (trailing `.t` stripped)

#### Scenario: Mirror with EJS suffix flag

- **WHEN** `HYGEN_MIRROR_EJS_SUFFIX=1` is set for the same template
- **THEN** the rendered body is written to `<cwd>/parts/header` (`.ejs.t` stripped)

#### Scenario: Explicit to wins

- **WHEN** a template declares both `to:` and `mirror: true`
- **THEN** the explicit `to:` target is used and `mirror` has no effect

#### Scenario: Mirror never applies to shell templates

- **WHEN** a template declares `sh` (shell execution) without `to:`
- **THEN** no file is created, regardless of `mirror`

#### Scenario: Nested template directories

- **WHEN** a mirrored template resides in nested subdirectories of the action folder
- **THEN** the target path reproduces that nesting under the current directory,
  creating missing directories

### Requirement: Multiple actions per invocation

The runner SHALL accept a comma-separated list of actions in the action positional and
execute them sequentially in list order, each with its own prompt hook and render
pipeline.

#### Scenario: Sequential action execution

- **WHEN** the runner is invoked with actions `new,html`
- **THEN** the `new` action completes fully before the `html` action starts

#### Scenario: Per-action prompt hooks

- **WHEN** each listed action has its own prompt hook
- **THEN** each hook runs once for its action, and questions already answered via CLI
  flags are skipped

#### Scenario: Fail fast on error

- **WHEN** an action fails and `--keep-going` is not set
- **THEN** execution stops at the failing action and the result reports the failure

#### Scenario: Keep going

- **WHEN** `--keep-going` is set and an action fails
- **THEN** remaining actions still run and the result reports every failure

#### Scenario: Subaction scope

- **WHEN** `--subaction` is provided with a list of actions
- **THEN** the subaction filter applies within each listed action

### Requirement: Name expansion

The runner SHALL accept a comma-separated list of names in the name positional and
render every listed action once per name, completing each name across all actions before
starting the next name.

#### Scenario: Name-outer expansion

- **WHEN** invoked with actions `model,controller` and names `a,b`
- **THEN** execution order is (model, a), (controller, a), (model, b), (controller, b)

#### Scenario: Scalar name in templates

- **WHEN** a run expands multiple names
- **THEN** every template render sees `name` as a scalar string of the current expansion

#### Scenario: Single name unchanged

- **WHEN** invoked with one name or no name positional
- **THEN** behavior is identical to single-run semantics

#### Scenario: Action not found in list

- **WHEN** a listed action folder does not exist
- **THEN** the error names the specific missing action from the list

### Requirement: Documented path macros and name precedence

The package documentation SHALL document that frontmatter (including `to:`) is fully
EJS-rendered — enabling macro-built output paths — and SHALL document the `name`
variable precedence chain.

#### Scenario: Macro-built output path

- **WHEN** documentation describes building output paths
- **THEN** it shows `to:` with EJS expressions building nested directories

#### Scenario: Name precedence documented

- **WHEN** documentation describes the `name` variable
- **THEN** it states the precedence: prompt hook answer > positional name > `--name` flag
