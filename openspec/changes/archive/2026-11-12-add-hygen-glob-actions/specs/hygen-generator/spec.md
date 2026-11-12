# Spec Delta

## ADDED Requirements

### Requirement: Glob-based batch file actions

A template MAY declare a `glob:` frontmatter attribute selecting multiple template files, resolved relative to the template's generator directory. The glob action SHALL expand, at render time, into one rendered file action per matched file. Each matched file's relative path (after applying `base:` stripping and `stripExtensions:` removal) and its content SHALL be rendered with the template engine before being written.

#### Scenario: Batch copy of a module directory

- **WHEN** a template declares `glob: module/**/*` with `to: src/{{name}}/` and the glob matches `module/service.t`, `module/index.t`
- **THEN** files `src/<name>/service.ts` and `src/<name>/index.ts` are created, each rendered from its matched template

#### Scenario: base and stripExtensions shape destination paths

- **WHEN** a glob action matches a file whose path is below the `base:` prefix and whose name ends with a listed `stripExtensions:` extension
- **THEN** the rendered destination keeps only the path below `base` with the listed extension removed, and file-name EJS expressions are evaluated against the run locals

#### Scenario: glob conflicts with mirroring

- **WHEN** a template declares both `mirror: true` and a `glob:` attribute
- **THEN** the run fails with a configuration error explaining the incompatibility

#### Scenario: name lists multiply with glob matches

- **WHEN** a glob action runs with a comma-separated name list of two names
- **THEN** the glob is expanded once per name in the name-outer × action-inner order already defined for multi-action runs

### Requirement: skipIfExists on file actions

A file-creating action (`to:`-based, mirroring, or glob-expanded) MAY declare `skipIfExists: true`. When the destination file already exists, the action SHALL be skipped without failure and without modifying the existing file. Without the attribute, existing-file behavior remains as currently defined (overwrite for `to:` actions).

#### Scenario: existing target with skipIfExists

- **WHEN** a file action with `skipIfExists: true` targets an existing file
- **THEN** the file is left untouched and the action outcome is reported as skipped, not failed

#### Scenario: skipIfExists interacts with keep-going

- **WHEN** a run with `--keep-going` contains a mix of skipped and successful file actions
- **THEN** skipped actions do not appear in `RunnerResult.failures` and later actions still run
