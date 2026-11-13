# Spec Delta

## ADDED Requirements

### Requirement: Interactive generator and action picker

When the CLI is invoked without positional arguments in an interactive terminal, the runner SHALL present a two-level picker: first the list of generators discovered in the templates root, then the list of actions within the selected generator. The selected generator and action SHALL be used for the run exactly as if passed positionally; all flags remain in effect.

#### Scenario: Two-level selection drives the run

- **WHEN** the user runs `hygen` with no arguments and picks generator `module` and action `new`
- **THEN** the run executes the `module/new` templates and prompts for the remaining inputs (name, etc.) as usual

#### Scenario: Multiple actions are selectable individually

- **WHEN** the chosen generator contains several action directories
- **THEN** the second picker level lists all of them and the user's single selection determines the action

#### Scenario: No generators found

- **WHEN** the templates root contains no generators and the picker is invoked
- **THEN** the CLI reports that no generators were found with guidance on creating `_templates`, instead of an empty menu

### Requirement: Non-interactive fallback for the picker

When stdout/stdin is not a TTY, the no-argument invocation SHALL NOT launch the picker; it SHALL fail with the existing missing-arguments error, extended to mention that the interactive picker requires a terminal.

#### Scenario: Piped invocation fails fast

- **WHEN** `hygen` is invoked with no arguments in a non-interactive environment (e.g. CI, piped stdio)
- **THEN** the run exits with the missing-arguments error without attempting any prompting
