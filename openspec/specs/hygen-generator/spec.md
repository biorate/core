# hygen-generator Specification

## Purpose

The `@biorate/hygen` package — a hygen generator fork in the monorepo standard: generates files from templates in the project's `_templates` directory (adding new files, injecting into existing ones, running shell commands) via a CLI and an embeddable API.

## Requirements

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

Each template SHALL consist of YAML frontmatter and an EJS body; the frontmatter MUST be processed by the same engine (variables available in the metadata). The `to` field is the only required one and defines the target path of the created file; nested directories are created automatically. The interpolation `<%= expr %>` SHALL substitute the expression value without HTML escaping — source code is generated, not markup.

#### Scenario: File creation via `to`

- **WHEN** a template contains `to: app/workers/<%= name %>.js` and the parameter `name=jobrunner`
- **THEN** the file `app/workers/jobrunner.js` is created with the rendered body

#### Scenario: Case conversion via helpers

- **WHEN** a template uses `h.changeCase.paramCase(name)` with `name=HelloWorld`
- **THEN** `hello-world` is substituted in the result

#### Scenario: Expression value contains markup characters

- **WHEN** the expression `<%= expr %>` evaluates to the string `a > b && c < d`
- **THEN** the result contains `a > b && c < d` verbatim, without `&gt;`/`&amp;`

### Requirement: Injection into existing files

When `inject: true`, the generator SHALL insert the template body into an existing file at the position defined by one of the mutually exclusive anchors: `before`, `after`, `prepend`, `append`, `line_at`; `skip_if` MUST abort the injection when the given text/regex is present in the file; `skip_if_not: true` MUST invert the `skip_if` condition (injection runs only on a match). If none of the anchors is found in the file, the generator MUST report an error (a `BaseError` subclass); the operation is NOT considered successful and the file remains unchanged.

#### Scenario: Insert after an anchor

- **WHEN** a template with `to: package.json`, `inject: true`, `after: dependencies` is applied to an existing file
- **THEN** the body is inserted immediately after the `dependencies` line

#### Scenario: Double-injection guard

- **WHEN** a template with `skip_if: react-native-fs` is applied again and the text is already present
- **THEN** the injection is skipped and the file is unchanged

#### Scenario: Inverted skip_if

- **WHEN** a template contains `skip_if: X` with `skip_if_not: true`, and the text `X` is present in the file
- **THEN** the injection runs; if `X` is absent, it is skipped

#### Scenario: Anchor not found

- **WHEN** none of the anchors (`before`/`after`/`line_at`) matched the file contents
- **THEN** an error of a `BaseError` subclass is thrown, the file is unchanged, and the run fails

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

### Requirement: Monorepo package conventions compliance

The package SHALL build in three passes (`dist/cjs`, `dist/esm`, `dist/types`), export `main`/`module`/`types`/`exports`, include only `dist/**`, `README.md`, `LICENSE` in npm, and use exact dependency versions; the `@biorate/errors` dependency goes through `workspace:*`.

#### Scenario: Build and packaging

- **WHEN** `pnpm --filter @biorate/hygen run build` runs, followed by a packaging simulation
- **THEN** all three outputs are built; `src/`, `tests/`, `docs/` are not included in the package

### Requirement: CLI version output

The CLI SHALL support the `--version` and `-v` flags: print the package version and exit with code 0, without requiring a generator/action.

#### Scenario: Successful version output

- **WHEN** `hygen --version` is executed
- **THEN** the package version is printed and the process exits with code 0

### Requirement: Injection with file creation

When `inject: true` and `create_if_missing: true`, if the target file does not exist, the generator SHALL create it with the template body (per `to`); without this option a missing file MUST remain an operation error.

#### Scenario: File is created

- **WHEN** a template with `inject: true`, `create_if_missing: true`, `to: config/new.json` is applied where the file does not exist
- **THEN** the file is created with the template body

#### Scenario: Without the option, no file is created

- **WHEN** a template with `inject: true` (no `create_if_missing`) is applied where the file does not exist
- **THEN** the operation fails with an error and the file is not created

### Requirement: Replacement by anchor

When `replace: true`, the generator SHALL replace the first fragment of the file matching the `before`/`after` anchor (regex/text) with the template body; the option is mutually exclusive with `inject: true` — specifying both MUST be a template configuration error.

#### Scenario: Matched fragment replaced

- **WHEN** a template with `replace: true`, `after: "version": ".*"` is applied to an existing file
- **THEN** the matched fragment is replaced with the template body and the rest of the file is preserved

#### Scenario: Mutually exclusive options

- **WHEN** a template contains both `inject: true` and `replace: true`
- **THEN** a template configuration error is thrown (a `BaseError` subclass)

### Requirement: Documented public API

The package's public API SHALL carry TSDoc blocks (`@description`, plus `@param`/`@returns`/`@example` where useful) following the monorepo style, so that `pnpm run doc` (typedoc over `packages/@biorate/*/index.ts`) generates an API reference with meaningful descriptions. Exported types SHALL NOT use `any`.

#### Scenario: Typedoc generates documented API

- **WHEN** `pnpm run doc` is executed at the monorepo root
- **THEN** the generated API reference for `@biorate/hygen` contains descriptions for `runner`, the runner configuration types, and the error classes

#### Scenario: No arbitrary any in exported types

- **WHEN** the exported types of the package are inspected
- **THEN** none of them uses `any`; `unknown`, generics, or concrete types are used instead

### Requirement: Package documentation and fork attribution

The package README, the `docs/` user guide, and the repository root README SHALL document the package consistently and preserve fork attribution to jondot/hygen (v6.2.11, MIT) with a link to the upstream source.

#### Scenario: README documents embedding

- **WHEN** a reader opens the package README looking to use the generator from code
- **THEN** an embedding section with a working `runner()` example and links to the API reference and user guide is present

#### Scenario: User guide matches fork semantics

- **WHEN** the docs/ pages describing escaping or injection are read
- **THEN** they describe identity escaping and the anchor-not-found error behavior of this fork, and mention the fork attribution with the upstream source link

#### Scenario: Root README lists the package

- **WHEN** the repository root README Modules list is inspected
- **THEN** it contains a `hygen` entry linking to the generated API reference

### Requirement: Project configuration file

The runner SHALL resolve project-level configuration from a prioritized family of
configuration file names, walking directories up from the current directory,
and merges the nearest match into the effective runner configuration.

#### Scenario: Single config file resolution

- **WHEN** a project contains only a `.hygen.js` at or above the current directory
- **THEN** the runner loads it and merges its exports into the runner configuration

#### Scenario: Candidate priority

- **WHEN** multiple configuration candidates exist in the same directory
  (`.hygen.js`, `.hygen.cjs`, `.hygen.mjs`, `.hygen.ts`)
- **THEN** the runner uses exactly one file, in the priority order
  `.hygen.js` → `.hygen.cjs` → `.hygen.mjs` → `.hygen.ts`

#### Scenario: Nearest directory wins

- **WHEN** configuration candidates exist in several directories along the
  path from the current directory to the filesystem root
- **THEN** the nearest directory containing any candidate determines the
  resolved file, and only that file is loaded

#### Scenario: No configuration file present

- **WHEN** no candidate exists in any walked directory
- **THEN** the runner proceeds with no project configuration and no error

#### Scenario: TypeScript configuration file

- **WHEN** the resolved file is `.hygen.ts`
- **THEN** the runner loads it as TypeScript (on-the-fly transpilation) and
  merges its exports into the runner configuration

#### Scenario: Explicit module systems

- **WHEN** the resolved file is `.hygen.cjs` (CommonJS) or `.hygen.mjs` (ESM)
- **THEN** the runner loads it with the corresponding module-system semantics,
  independent of the host project's `type` field

#### Scenario: Backward compatibility

- **WHEN** a project uses an existing `.hygen.js` configuration
- **THEN** resolution and merge behavior is unchanged from prior versions

### Requirement: Template mirroring

The runner SHALL support opt-in mirroring: when a template declares `mirror: true` and
has no `to:`, its rendered body SHALL be written to the path mirroring the template's
location inside the action folder, with the template suffix resolved per the suffix
convention.

#### Scenario: Mirror with default suffix rule

- **WHEN** a template `parts/header.ejs.t` declares `mirror: true` and no `to:`
- **THEN** the rendered body is written to `<cwd>/parts/header.ejs` (trailing `.t` stripped)

#### Scenario: Mirror with EJS suffix flag

- **WHEN** `HYGEN_MIRROR_EJS_SUFFIX=1` is set for the same template
- **THEN** the rendered body is written to `<cwd>/parts/header` (`.ejs.t` stripped)

#### Scenario: Explicit to wins

- **WHEN** a template declares both `to:` and `mirror: true`
- **THEN** the explicit `to:` target is used and `mirror` has no effect

#### Scenario: Mirror never applies to shell templates

- **WHEN** a template declares `sh` (shell execution) without `to:`
- **THEN** no file is created, regardless of `mirror`

#### Scenario: Nested template directories

- **WHEN** a mirrored template resides in nested subdirectories of the action folder
- **THEN** the target path reproduces that nesting under the current directory,
  creating missing directories

### Requirement: Multiple actions per invocation

The runner SHALL accept a comma-separated list of actions in the action positional and
execute them sequentially in list order, each with its own prompt hook and render
pipeline.

#### Scenario: Sequential action execution

- **WHEN** the runner is invoked with actions `new,html`
- **THEN** the `new` action completes fully before the `html` action starts

#### Scenario: Per-action prompt hooks

- **WHEN** each listed action has its own prompt hook
- **THEN** each hook runs once for its action, and questions already answered via CLI
  flags are skipped

#### Scenario: Fail fast on error

- **WHEN** an action fails and `--keep-going` is not set
- **THEN** execution stops at the failing action and the result reports the failure

#### Scenario: Keep going

- **WHEN** `--keep-going` is set and an action fails
- **THEN** remaining actions still run and the result reports every failure

#### Scenario: Subaction scope

- **WHEN** `--subaction` is provided with a list of actions
- **THEN** the subaction filter applies within each listed action

### Requirement: Name expansion

The runner SHALL accept a comma-separated list of names in the name positional and
render every listed action once per name, completing each name across all actions before
starting the next name.

#### Scenario: Name-outer expansion

- **WHEN** invoked with actions `model,controller` and names `a,b`
- **THEN** execution order is (model, a), (controller, a), (model, b), (controller, b)

#### Scenario: Scalar name in templates

- **WHEN** a run expands multiple names
- **THEN** every template render sees `name` as a scalar string of the current expansion

#### Scenario: Single name unchanged

- **WHEN** invoked with one name or no name positional
- **THEN** behavior is identical to single-run semantics

#### Scenario: Action not found in list

- **WHEN** a listed action folder does not exist
- **THEN** the error names the specific missing action from the list

### Requirement: Documented path macros and name precedence

The package documentation SHALL document that frontmatter (including `to:`) is fully
EJS-rendered — enabling macro-built output paths — and SHALL document the `name`
variable precedence chain.

#### Scenario: Macro-built output path

- **WHEN** documentation describes building output paths
- **THEN** it shows `to:` with EJS expressions building nested directories

#### Scenario: Name precedence documented

- **WHEN** documentation describes the `name` variable
- **THEN** it states the precedence: prompt hook answer > positional name > `--name` flag

### Requirement: Documented helper library usage

The package documentation SHALL show how external utility libraries and sibling packages
are exposed to templates through the project config file's `helpers` option, including
the plain-object form, the function form for per-run resolution, and the requirement that
libraries be installed dependencies of the project where the runner executes.

#### Scenario: Library exposed via config

- **WHEN** a reader looks up how to use lodash (or any installed library) in templates
- **THEN** the documentation shows a project config file exporting `helpers` with the
  library bound under a namespace, and the template calling it as `h.<namespace>`

#### Scenario: Missing library surfaced

- **WHEN** the documentation describes the function form of `helpers`
- **THEN** it shows per-run resolution with a friendly error when the library is not
  installed in the running project

#### Scenario: Sibling package example

- **WHEN** the documentation covers monorepo usage
- **THEN** it shows a sibling `@biorate/*` package exposed as a helper namespace
