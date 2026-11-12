# Spec Delta

## ADDED Requirements

### Requirement: Declarative conditional action skipping

A template MAY declare a `skip:` frontmatter attribute. The attribute SHALL be rendered with the template engine like other attributes, using the run locals. Rendering yields strings, so the boolean spellings SHALL be recognised case-insensitively and whitespace-trimmed: a rendered value of empty string, `false`, or `'false'` is falsy and the action runs; `true`/`'true'` skips without a reason; any other non-empty value skips the action, no operations are executed for it, and that value is reported as the skip reason in the run log.

#### Scenario: Conditional test file

- **WHEN** a template declares `skip: <% if (wantTests) { %>false<% } else { %>no tests requested<% } %>` and the user answers `wantTests: false`
- **THEN** no file is created and the run log reports the action as skipped with reason `no tests requested`

#### Scenario: Rendered false runs the action

- **WHEN** the rendered `skip:` value is empty, `false`, or the string `'false'`
- **THEN** the action executes normally

#### Scenario: Skip applies to all action kinds

- **WHEN** a `skip:` attribute is declared on a `sh:` action or an inject action
- **THEN** the shell command is not executed / no injection is performed, and the action is reported as skipped

### Requirement: Three-state action outcome in the runner result

Every executed action SHALL resolve to one of three statuses: `ok`, `skipped`, or `failed`. `RunnerResult` SHALL expose per-action statuses. Skipped actions SHALL NOT appear in `RunnerResult.failures`, SHALL NOT abort fail-fast runs, and SHALL NOT prevent later actions from running under `--keep-going`.

#### Scenario: Skipped action does not fail the run

- **WHEN** a run contains one skipped action and one successful action
- **THEN** the run exits successfully, the result reports `skipped` for the first action and `ok` for the second, and `failures` is empty

#### Scenario: Fail-fast ignores skipped actions

- **WHEN** a skipped action precedes other actions in a default (fail-fast) run
- **THEN** subsequent actions still execute

#### Scenario: Failed and skipped are distinct

- **WHEN** a run with `--keep-going` contains one failed and one skipped action
- **THEN** `RunnerResult.failures` contains only the failed action, and the run summary distinguishes the two statuses
