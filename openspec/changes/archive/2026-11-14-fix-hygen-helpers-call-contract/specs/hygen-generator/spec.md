# Spec Delta

## ADDED Requirements

### Requirement: Helpers factory invocation contract

The runner SHALL invoke a function-form `helpers` factory with the locals of each rendered action. For lifecycle hook contexts it SHALL invoke the factory lazily, at most once per run, with the run's CLI arguments including positionals under `_` and without the per-pair name. The runner MUST NOT invoke the factory with an empty locals object outside rendering.

#### Scenario: Eager-validation factory without hooks

- **WHEN** a config declares a function-form `helpers` factory that throws unless
  positional arguments are present, and the run declares no lifecycle hooks
- **THEN** the run renders normally and the factory is invoked only with the render
  locals of each action

#### Scenario: Hook helper resolution uses CLI arguments

- **WHEN** a lifecycle hook reads `ctx.h` during a run invoked with positional and
  flag arguments
- **THEN** the factory is invoked with those CLI arguments (including `_`) and the
  hook receives the built-in helpers merged with the factory result

#### Scenario: Helper factory is not invoked when unused

- **WHEN** no lifecycle hook reads `ctx.h` and the action's hooks class defines no
  `prompt` section
- **THEN** the factory is not invoked outside rendering

#### Scenario: One helper namespace per run

- **WHEN** several lifecycle hooks of the same run read `ctx.h`
- **THEN** the factory is invoked once for the run and every hook observes the same
  helper namespace

## MODIFIED Requirements

### Requirement: Documented helper library usage

The package documentation SHALL show how external utility libraries and sibling packages
are exposed to templates through the project config file's `helpers` option, including
the plain-object form, the function form for per-run resolution, and the requirement that
libraries be installed dependencies of the project where the runner executes. It SHALL
document when the function form is invoked and that it must be re-entrant.

#### Scenario: Library exposed via config

- **WHEN** a reader looks up how to use lodash (or any installed library) in templates
- **THEN** the documentation shows a project config file exporting `helpers` with the
  library bound under a namespace, and the template calling it as `h.<namespace>`

#### Scenario: Missing library surfaced

- **WHEN** the documentation describes the function form of `helpers`
- **THEN** it shows per-run resolution with a friendly error when the library is not
  installed in the running project

#### Scenario: Sibling package example

- **WHEN** the documentation covers monorepo usage
- **THEN** it shows a sibling `@biorate/*` package exposed as a helper namespace

#### Scenario: Factory call timing documented

- **WHEN** a reader looks up the function form of `helpers`
- **THEN** the documentation states that it is invoked for every template render
  (frontmatter attributes and body) with that action's locals and lazily once per run
  with CLI arguments for hook contexts, and that it must not depend on per-template or
  prompt-provided values
