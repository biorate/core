# hygen-generator — Delta

## ADDED Requirements

### Requirement: Documented helper library usage

The package documentation SHALL show how external utility libraries and sibling packages
are exposed to templates through the project config file's `helpers` option, including
the plain-object form, the function form for per-run resolution, and the requirement that
libraries be installed dependencies of the project where the runner executes.

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
