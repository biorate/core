# Spec Delta

## Purpose

The `@biorate/hygen` package — a hygen generator fork in the monorepo standard: generates files from templates in the project's `_templates` directory (adding new files, injecting into existing ones, running shell commands) via a CLI and an embeddable API.

## ADDED Requirements

### Requirement: Template directory resolution

The generator SHALL locate the `_templates` directory starting from the current working directory and walking up the tree; the `HYGEN_TMPLS` environment variable MUST take priority over local lookup.

#### Scenario: Local templates found

- **WHEN** a `_templates` directory exists in the cwd or in an ancestor of the cwd
- **THEN** the generator uses it and reports `Loaded templates: _templates`

#### Scenario: HYGEN_TMPLS priority

- **WHEN** `HYGEN_TMPLS` is set and a local `_templates` exists
- **THEN** the directory from `HYGEN_TMPLS` is used

### Requirement: Folder structure maps to a command

The generator SHALL interpret `hygen <generator> <action>` as rendering all files of the `_templates/<generator>/<action>/` directory; the `action:file` subcommand SHALL select files by name or regular expression.

#### Scenario: All action files rendered

- **WHEN** `hygen worker new` is executed with `_templates/worker/new/*.ejs.t` present
- **THEN** every template in the directory is rendered and applied

#### Scenario: Subcommand selection by regex

- **WHEN** `hygen worker new:se` is executed
- **THEN** only the file whose name matches `se.*` is rendered (e.g. `setup.ejs.t`)

### Requirement: EJS rendering with frontmatter

Each template SHALL consist of YAML frontmatter and an EJS body; the frontmatter MUST be processed by the same engine (variables available in the metadata). The `to` field is the only required one and defines the target path of the created file; nested directories are created automatically.

#### Scenario: File creation via `to`

- **WHEN** a template contains `to: app/workers/<%= name %>.js` and the parameter `name=jobrunner`
- **THEN** the file `app/workers/jobrunner.js` is created with the rendered body

#### Scenario: Case conversion via helpers

- **WHEN** a template uses `h.changeCase.paramCase(name)` with `name=HelloWorld`
- **THEN** `hello-world` is substituted in the result

### Requirement: Injection into existing files

When `inject: true`, the generator SHALL insert the template body into an existing file at the position defined by one of the mutually exclusive anchors: `before`, `after`, `prepend`, `append`, `line_at`; `skip_if` MUST abort the injection when the given text/regex is already present in the file.

#### Scenario: Insert after an anchor

- **WHEN** a template with `to: package.json`, `inject: true`, `after: dependencies` is applied to an existing file
- **THEN** the body is inserted immediately after the `dependencies` line

#### Scenario: Double-injection guard

- **WHEN** a template with `skip_if: react-native-fs` is applied again and the text is already present
- **THEN** the injection is skipped and the file is unchanged

### Requirement: Interactive prompts

The generator SHALL execute the `prompt.js` file in the generator directory and provide its results as template variables; CLI flags `--flag VALUE` and positional arguments MUST also become variables.

#### Scenario: Prompt fills a variable

- **WHEN** the generator directory contains `prompt.js` and `hygen mygen with-prompt` is executed
- **THEN** the user's answer is available to templates as a variable

### Requirement: Shell command execution

A template with `shell: <command>` frontmatter SHALL cause the command to be executed via a configurable `exec` hook (`execa.shell` by default), with the template body piped to stdin when present.

#### Scenario: Command after generation

- **WHEN** a template contains `shell: npm install`
- **THEN** the command is executed in the cwd after the other operations are applied

### Requirement: Error handling per the monorepo standard

All generator runtime errors (a rendering error, a missing injection target, a shell command failure) SHALL be thrown as instances of classes derived from `BaseError` from `@biorate/errors`, with a parameterized message.

#### Scenario: Template rendering error

- **WHEN** a template contains an EJS syntax error
- **THEN** an error of a `BaseError` subclass is thrown, not a "raw" `Error`

### Requirement: CLI and embeddable API

The package SHALL provide: (1) the `hygen` CLI binary installed via the `bin` field; (2) an embeddable API `runner(args, config)` with configurable `templates`, `cwd`, `logger`, `createPrompter`, `exec`.

#### Scenario: Embedding in a custom binary

- **WHEN** a third-party application calls `runner(process.argv.slice(2), { templates, cwd, logger, createPrompter, exec })`
- **THEN** generation runs with the provided templates and configuration

#### Scenario: CLI after global installation

- **WHEN** the package is installed globally and `hygen init self` is executed in a project directory
- **THEN** a starter `_templates` directory with built-in templates is created

### Requirement: Monorepo package conventions compliance

The package SHALL build in three passes (`dist/cjs`, `dist/esm`, `dist/types`), export `main`/`module`/`types`/`exports`, include only `dist/**`, `README.md`, `LICENSE` in npm, and use exact dependency versions; the `@biorate/errors` dependency goes through `workspace:*`.

#### Scenario: Build and packaging

- **WHEN** `pnpm --filter @biorate/hygen run build` runs, followed by a packaging simulation
- **THEN** all three outputs are built; `src/`, `tests/`, `docs/` are not included in the package
