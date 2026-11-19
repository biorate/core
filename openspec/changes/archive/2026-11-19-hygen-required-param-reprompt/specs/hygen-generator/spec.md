# Spec Delta

## MODIFIED Requirements

### Requirement: Declarative action parameter schema

The class-based action hook module declares its parameter schema as a `static params` member of the default-exported hooks class — an array of parameter descriptors. Each descriptor declares a `type` of `'string'`, `'number'`, `'boolean'`, or a function, plus optional `required` (default `false`), `default`, and `message`.

The runner SHALL treat a required parameter as missing when its merged (flag-supplied or prompted) value is `undefined`, an empty string, or a whitespace-only string; such a value SHALL fail with `ParamRequiredError` naming the parameter. A `required` string or number parameter prompted in an interactive terminal SHALL be re-asked in place with a "field is required" warning until a non-empty answer is supplied; the re-asked question preserves the parameter's message and initial (default) value. A `required` boolean parameter SHALL NOT be re-asked: the answered or default boolean is accepted as-is, so the empty confirm answer resolves to `false`. A non-required parameter SHALL keep its current behavior: an empty value is neither re-asked nor rejected. Values supplied via CLI flags SHALL be validated by the same empty-value rule as prompted answers.

#### Scenario: Coercion of CLI flag values

- **WHEN** a generator action declares `static params = [{ name: 'count', type: 'number' }]` on its hooks class and is run with `--count 5`
- **THEN** the template and hook contexts receive `count` as the number `5`

#### Scenario: Coercion failure names the parameter

- **WHEN** a generator action declares `static params = [{ name: 'count', type: 'number' }]` on its hooks class and is run with `--count abc`
- **THEN** the run fails with an error naming `count` and the expected type `number`

#### Scenario: Missing required parameter triggers a prompt

- **WHEN** a generator action declares `static params = [{ name: 'name', type: 'string', required: true, message: 'Component name?' }]` on its hooks class and is run without `--name`
- **THEN** the engine prompts once with the message `Component name?` and the answered value is validated and passed to the template

#### Scenario: Supplied parameters are not asked again

- **WHEN** a generator action declares `static params` with `name` and `count` on its hooks class and is run with `--name user --count 2`
- **THEN** no prompt questions are generated for `name` or `count`

#### Scenario: Empty Enter on a required string parameter re-asks with a warning

- **WHEN** a required string parameter is prompted in an interactive terminal and the user answers with an empty input
- **THEN** the same question is asked again with a warning naming the field as required, and the run does not proceed until a non-empty answer is given

#### Scenario: Whitespace-only answer counts as empty

- **WHEN** a required string parameter receives an answer consisting only of whitespace (prompted or via flag)
- **THEN** the value is treated as empty and the parameter is re-asked (TTY) or fails with `ParamRequiredError`

#### Scenario: Empty CLI flag for a required parameter fails

- **WHEN** the CLI supplies `--param=""` for a required parameter
- **THEN** validation fails with `ParamRequiredError` naming the parameter instead of accepting the empty string

#### Scenario: Required boolean accepts the answered value without re-asking

- **WHEN** a required boolean parameter is prompted and the user presses Enter (empty answer)
- **THEN** the answered/default boolean (`false` when unset) is accepted and no re-asking occurs

#### Scenario: Non-required parameter accepts an empty value

- **WHEN** a non-required string parameter receives an empty answer
- **THEN** the empty value is accepted without a warning and without re-asking

#### Scenario: Re-asked question preserves message and default

- **WHEN** a required parameter with a `message` and a `default` is re-asked after an empty answer
- **THEN** the re-asked question shows the same message and pre-fills the same default as the initial value
