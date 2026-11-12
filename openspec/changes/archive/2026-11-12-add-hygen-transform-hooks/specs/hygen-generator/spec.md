# Spec Delta

## ADDED Requirements

### Requirement: Named content transforms

The runner configuration MAY define named transforms — functions `(content, locals) => string | Promise<string>` — under a `transforms` namespace, resolved like `helpers`. A file action (add, mirroring, or inject) MAY declare a `transform:` frontmatter attribute naming one transform or several separated by `|`. Transforms SHALL be applied after template rendering and before any operation writes or injects content, applied in the declared order.

#### Scenario: Prettier transform on a generated file

- **WHEN** a `.hygen.js` registers `transforms: { prettier }` and a template declares `transform: prettier`
- **THEN** the rendered file content is passed through the transform before being written

#### Scenario: Chained transforms apply in order

- **WHEN** a template declares `transform: stripLicense|prettier` with both names registered
- **THEN** the transforms run sequentially, each receiving the previous output

#### Scenario: Unknown transform name fails the action

- **WHEN** a template declares `transform: nonexistent` and no such transform is registered
- **THEN** the action fails with a typed error naming the missing transform and pointing to the `transforms` config

### Requirement: Transforms apply only to file actions

The `transform:` attribute SHALL be applied only to actions that produce or modify file content. A `sh:` action declaring `transform:` SHALL NOT have any transform applied; the runner SHALL emit a warning that the attribute is ignored for shell actions.

#### Scenario: Transform on a shell action warns and is ignored

- **WHEN** a template with `sh: some-command` also declares `transform: prettier`
- **THEN** the command executes normally, no transform runs, and the run log contains a warning that `transform` is ignored for `sh:` actions

#### Scenario: Transforms do not affect shell-only templates

- **WHEN** a run consists only of `sh:` actions
- **THEN** no transform resolution occurs and no warnings are emitted unless a `transform:` attribute is present
