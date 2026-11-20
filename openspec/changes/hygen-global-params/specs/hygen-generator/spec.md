# Spec Delta

## MODIFIED Requirements

### Requirement: Declarative action parameter schema

The class-based action hook module declares its parameter schema as a `params` instance field of the default-exported hooks class — an array of parameter descriptors, uniform with the project configuration's global `params` field. The legacy `static params` member remains supported for backwards compatibility; when both forms exist, the instance field SHALL win and the run SHALL emit a warning naming both declaration forms. Each descriptor declares a `type` of `'string'`, `'number'`, `'boolean'`, or a function, plus optional `required` (default `false`), `default`, and `message`. The engine MUST coerce CLI flag values to the declared type before the prompt phase. Prompt questions MUST be generated only for descriptors whose parameter was not supplied via flags. Every parameter value MUST be validated after the prompt phase. Actions whose hooks class declares no `params` schema MUST keep the existing prompting and argument behavior unchanged.

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

#### Scenario: Instance params field shadows a legacy static member with a warning

- **WHEN** a hooks class declares both an instance `params` field and a legacy `static params` member
- **THEN** the instance field's descriptors drive the parameter phase and the run logs a warning naming both declaration forms

#### Scenario: Legacy static params keeps working

- **WHEN** a hooks class declares only the legacy `static params` member
- **THEN** the schema behaves exactly as declared by the static member, with no warning

## ADDED Requirements

### Requirement: Global declarative parameter schema

The project configuration MAY declare a global parameter schema as a `params` array — the same descriptor shape as an action's `static params` — in a `.hygen.*` configuration file or on the `HygenConfig` base class. The schema SHALL be validated at configuration resolution time the same way action schemas are (unknown string types fail naming the parameter).

The engine SHALL run a global parameter phase once per run, before the pair loop: global descriptors are coerced from CLI flags and, for required parameters missing from flags, prompted exactly once for the whole run (respecting the required-parameter empty-value rules, including the interactive re-ask with a "field is required" warning). The resolved global values SHALL be merged into the run's base arguments so every generator pair, template and hook sees them; action-level prompts SHALL NOT re-ask a global parameter that was already resolved.

When an action's `static params` declares a parameter name that also exists in the global schema, the action-level descriptor SHALL override the global one for that action's prompt phase, and the run SHALL emit a warning naming the parameter and both levels. Under `argCase: 'upper-underscore'` global parameter values SHALL resolve under the normalized alias of their names, mirroring the action-level schema behavior. A project configuration without `params` SHALL keep the run behavior unchanged.

#### Scenario: Global parameter prompted once per run

- **WHEN** the project configuration declares `params = [{ name: 'root', type: 'string', required: true }]` and a run executes an action list with multiple pairs without `--root`
- **THEN** the `root` question is asked exactly once for the whole run, before the first pair, and every pair's templates and hooks see the answered value

#### Scenario: Global parameter supplied as a flag is not asked

- **WHEN** the project configuration declares a global `root` parameter and the run supplies `--root /srv`
- **THEN** no prompt is shown and the coerced value is available to every pair

#### Scenario: Action descriptor overrides the global one with a warning

- **WHEN** the global schema declares `name` as a string and an action's `static params` also declares `name` (with its own message)
- **THEN** the action's descriptor drives that action's prompt phase, the run logs a warning naming `name` and both declaration levels, and other actions still use the global descriptor

#### Scenario: Global required parameter rejects an empty answer

- **WHEN** a required global string parameter is prompted in an interactive terminal and the user answers with an empty input
- **THEN** the question is re-asked in place with a "field is required" warning until a non-empty answer is given, once per run

#### Scenario: Global parameter under upper-underscore argCase

- **WHEN** the project configuration declares `argCase: 'upper-underscore'` and a global `root` parameter, and the run supplies `--root /srv`
- **THEN** the descriptor resolves the flag value under the `ROOT` alias and templates see the value under both `root` and `ROOT`

#### Scenario: Run without a global schema is unchanged

- **WHEN** the project configuration declares no `params` field
- **THEN** coercion, prompting, validation and rendering for every action are byte-identical to the behavior before this change

#### Scenario: Unknown type in the global schema fails at resolution

- **WHEN** the project configuration declares `params = [{ name: 'x', type: 'flaoty' }]`
- **THEN** the run fails with an error naming the parameter `x` and the unknown type `flaoty`
