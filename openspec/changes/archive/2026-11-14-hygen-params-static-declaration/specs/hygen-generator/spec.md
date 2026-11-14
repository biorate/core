# Spec Delta

## MODIFIED Requirements

### Requirement: Declarative action parameter schema

A class-based action hook module (`hooks.ts`, kind `class`) declares its parameter schema as a `static params` member of the default-exported hooks class — an array of parameter descriptors. The engine MUST coerce CLI flag values to the declared type before the prompt phase. Prompt questions MUST be generated only for descriptors whose parameter was not supplied via flags. Every parameter value MUST be validated after the prompt phase. Actions whose hooks class declares no `static params` MUST keep the existing prompting and argument behavior unchanged.

#### Scenario: Coercion of CLI flag values

- **WHEN** a generator action declares `static params = [{ name: 'count', type: 'number' }]` on its hooks class and is run with `--count 5`
- **THEN** the template and hook contexts receive `count` as the number `5`

#### Scenario: Coercion failure names the parameter

- **WHEN** a generator action declares `static params = [{ name: 'count', type: 'number' }]` on its hooks class and is run with `--count abc`
- **THEN** the run fails with an error naming `count` and the expected type `number`

#### Scenario: Missing required parameter triggers a prompt

- **WHEN** a generator action declares `static params = [{ name: 'name', type: 'string', required: true, message: 'Component name?' }]` on its hooks class and is run without a matching flag
- **THEN** the engine prompts once with the message `Component name?` and the answered value is validated and passed to the template

#### Scenario: Supplied parameters are not asked again

- **WHEN** a generator action declares `static params` with `name` and `count` on its hooks class and is run with matching flags for both
- **THEN** no prompt questions are generated for `name` or `count`

#### Scenario: Actions without static params keep existing behavior

- **WHEN** a generator action's hooks class declares no `static params`
- **THEN** prompting and argument handling for that action are byte-identical to the behavior before this change

### Requirement: Descriptor types and resolution

Each parameter descriptor MUST declare a `type` of `'string'`, `'number'`, `'boolean'`, or a function, plus optional `required` (default `false`), `default`, and `message`. A function `type` MUST resolve the parameter value to its return value (invoked with the raw input), with thrown errors surfaced under the parameter name. An unrecognized string `type` MUST fail when the action's hooks are loaded, naming the parameter and the unknown type.

#### Scenario: Function type resolves the parameter value

- **WHEN** a generator action declares `static params = [{ name: 'stamp', type: (raw) => new Date(raw) }]` on its hooks class and is run with `--stamp 2026-01-01`
- **THEN** the template context receives `stamp` as the `Date` produced by the function

#### Scenario: Unknown string type fails at hook load

- **WHEN** a generator action declares `static params = [{ name: 'x', type: 'flaoty' }]` on its hooks class
- **THEN** loading the action's hooks fails with an error naming the parameter `x` and the unknown type `flaoty`

#### Scenario: Actions without params keep existing behavior

- **WHEN** a generator action's hooks class declares no `static params`
- **THEN** prompting and argument handling for that action are byte-identical to the behavior before this change
