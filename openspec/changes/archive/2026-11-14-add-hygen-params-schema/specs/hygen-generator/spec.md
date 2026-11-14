# Spec Delta

## ADDED Requirements

### Requirement: Declarative action parameter schema

A class-based action hook module (`hooks.ts`, kind `class`) MAY export a `params` array of parameter descriptors. The engine MUST coerce CLI flag values to the declared type before the prompt phase. Prompt questions MUST be generated only for descriptors whose parameter was not supplied via flags. Every parameter value MUST be validated after the prompt phase. Actions without a `params` export MUST keep the existing prompting and argument behavior unchanged.

#### Scenario: Coercion of CLI flag values

- **WHEN** a generator action declares `params: [{ name: 'count', type: 'number' }]` and is run with `--count 5`
- **THEN** the template and hook contexts receive `count` as the number `5`

#### Scenario: Coercion failure names the parameter

- **WHEN** a generator action declares `params: [{ name: 'count', type: 'number' }]` and is run with `--count abc`
- **THEN** the run fails with an error naming `count` and the expected type `number`

#### Scenario: Missing required parameter triggers a prompt

- **WHEN** a generator action declares `params: [{ name: 'name', type: 'string', required: true, message: 'Component name?' }]` and is run without `--name`
- **THEN** the engine prompts once with the message `Component name?` and the answered value is validated and passed to the template

#### Scenario: Supplied parameters are not asked again

- **WHEN** a generator action declares `params` with `name` and `count` and is run with `--name user --count 2`
- **THEN** no prompt questions are generated for `name` or `count`

### Requirement: Descriptor types and resolution

Each parameter descriptor MUST declare a `type` of `'string'`, `'number'`, `'boolean'`, or a function, plus optional `required` (default `false`), `default`, and `message`. A function `type` MUST resolve the parameter value to its return value (invoked with the raw input), with thrown errors surfaced under the parameter name. An unrecognized string `type` MUST fail when the action's hooks are loaded, naming the parameter and the unknown type.

#### Scenario: Function type resolves the parameter value

- **WHEN** a generator action declares `params: [{ name: 'stamp', type: (raw) => new Date(raw) }]` and is run with `--stamp 2026-01-01`
- **THEN** the template context receives `stamp` as the `Date` produced by the function

#### Scenario: Unknown string type fails at hook load

- **WHEN** a generator action declares `params: [{ name: 'x', type: 'flaoty' }]`
- **THEN** loading the action's hooks fails with an error naming the parameter `x` and the unknown type `flaoty`

#### Scenario: Actions without params keep existing behavior

- **WHEN** a generator action's hook module exports no `params`
- **THEN** prompting and argument handling for that action are byte-identical to the behavior before this change

### Requirement: Optional flag-key case normalization

The runner configuration MAY declare `argCase` controlling how CLI flag keys are normalized before they become template locals and hook `args` keys. The value MUST be `'keep'` (default — keys preserved exactly as parsed) or `'upper-underscore'` (hyphenated and camel-cased keys normalized to `UPPER_UNDERSCORE`). Reserved keys (`_`, `ts`, `name`, `generator`, `action`) MUST NOT be affected by the normalization.

#### Scenario: Default keeps flag keys unchanged

- **WHEN** the runner configuration does not declare `argCase` and the CLI receives `--my-flag hello`
- **THEN** templates and hooks see the key `my-flag` exactly as parsed

#### Scenario: Upper-underscore normalization

- **WHEN** the runner configuration declares `argCase: 'upper-underscore'` and the CLI receives `--my-flag hello`
- **THEN** templates and hooks see the key `MY_FLAG` with the value `hello`

#### Scenario: Reserved keys are never normalized

- **WHEN** the runner configuration declares `argCase: 'upper-underscore'` and a run executes normally
- **THEN** the reserved keys (`_`, `ts`, `name`, `generator`, `action`) keep their existing names in the template context
