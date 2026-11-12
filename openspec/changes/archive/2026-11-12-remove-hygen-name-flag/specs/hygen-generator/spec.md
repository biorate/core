# hygen-generator — Delta

## MODIFIED Requirements

### Requirement: CLI and embeddable API

The package SHALL provide: (1) the `hygen` CLI binary installed via the `bin` field; (2)
an embeddable API `runner(args, config)` with configurable `templates`, `cwd`, `logger`,
`createPrompter`, `exec`. The `--name` flag SHALL be rejected by default with a
descriptive error; it SHALL be accepted only under the legacy escape
(`HYGEN_LEGACY_NAME=1` environment variable or `RunnerConfig.legacyNameFlag`).

#### Scenario: Embedding in a custom binary

- **WHEN** a third-party application calls `runner(process.argv.slice(2), { templates, cwd, logger, createPrompter, exec })`
- **THEN** generation runs with the provided templates and configuration

#### Scenario: CLI after global installation

- **WHEN** the package is installed globally and `hygen init self` is executed in a project directory
- **THEN** a starter `_templates` directory with built-in templates is created

#### Scenario: Name flag rejected by default

- **WHEN** the CLI or embedder is invoked with a `--name` flag and no legacy escape is active
- **THEN** the run fails with an error that names the offending flag, shows the
  positional equivalent, and mentions the legacy escape

#### Scenario: Legacy escape via environment

- **WHEN** `HYGEN_LEGACY_NAME=1` is set and `--name` is used
- **THEN** the flag behaves as the pre-removal single-value name source

#### Scenario: Legacy escape via embedder config

- **WHEN** the embedder passes `legacyNameFlag: true` in `RunnerConfig` and `--name` is used
- **THEN** the flag behaves as the pre-removal single-value name source

#### Scenario: Positional name unaffected

- **WHEN** the name is passed as a positional argument (with or without comma lists)
- **THEN** resolution is identical to prior behavior, with no legacy escape involved
