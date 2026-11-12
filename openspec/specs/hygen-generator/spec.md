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
