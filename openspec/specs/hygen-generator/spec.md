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

The generator SHALL execute the action's hook module — `hooks.*` (class-based) or the
legacy `prompt.*`/`index.*` — and provide its results as template variables; CLI
flags `--flag VALUE` and positional arguments MUST also become variables.

#### Scenario: Prompt fills a variable

- **WHEN** the generator directory contains `prompt.js` and `hygen mygen with-prompt` is executed
- **THEN** the user's answer is available to templates as a variable

#### Scenario: Hooks class prompt section fills a variable

- **WHEN** the action folder contains `hooks.ts` with a `prompt` section and
  `hygen mygen with-prompt` is executed
- **THEN** the answers returned by that section are available to templates as
  variables

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
and merges the nearest match into the effective runner configuration. The merged
configuration MAY carry an optional `hooks` object with lifecycle methods that apply
to every generator run.

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

#### Scenario: Project lifecycle hooks apply to every run

- **WHEN** the resolved project configuration exports a `hooks` object with
  `beforeAll` and `afterAll`
- **THEN** both run once around any generator run, regardless of the generator and
  action names

### Requirement: Template mirroring

The runner SHALL support opt-in mirroring: when a template declares `mirror: true` and
has no `to:`, its rendered body SHALL be written to the path mirroring the template's
location inside the action folder, with the template suffix resolved per the suffix
convention. Each path segment of the mirrored target MAY contain one or more macros of
the form `$IDENTIFIER$`; every macro SHALL be substituted with the string value of
`IDENTIFIER` from the run locals (prompt-hook answers, positional/flag `name`, CLI
args, and values exported by the config helpers factory), evaluated once per render
pass so a macro is always a scalar. An identifier with no resolvable value SHALL fail
the run with a standardized error naming the template file, the path segment and the
identifier. Template files whose segments contain no macros SHALL resolve exactly as
before.

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

#### Scenario: Macro segment resolves from helpers

- **WHEN** a template resides at `<generator>/<action>/apps/$CLIENT_NAME$/src/index.ts.t`
  with `mirror: true`, and the config helpers factory exports `CLIENT_NAME`
- **THEN** the rendered body is written to `<cwd>/apps/<resolved CLIENT_NAME>/src/index.ts`

#### Scenario: Macro segment with surrounding literal text

- **WHEN** a mirrored template's path contains a segment `v$VERSION$-build`
  and `VERSION` resolves to `2`
- **THEN** the segment resolves to `v2-build` in the target path

#### Scenario: Unknown macro identifier fails the run

- **WHEN** a mirrored template's path contains a segment `$NOPE$` and no `NOPE`
  value exists in the run locals
- **THEN** the run fails with a standardized error naming the template file, the
  segment and the identifier `NOPE`, and no file is written by that action

#### Scenario: Macro is a scalar per pass under name expansion

- **WHEN** a mirrored template's path contains a segment `$name$` and the run
  expands names `a,b`
- **THEN** each pass resolves the segment with its own scalar `name`, producing
  `<cwd>/a/...` and `<cwd>/b/...` in two separate passes

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

### Requirement: Glob-based batch file actions

A template MAY declare a `glob:` frontmatter attribute selecting multiple template files, resolved relative to the template's generator directory. The glob action SHALL expand, at render time, into one rendered file action per matched file. Each matched file's relative path (after applying `base:` stripping and `stripExtensions:` removal) and its content SHALL be rendered with the template engine before being written.

#### Scenario: Batch copy of a module directory

- **WHEN** a template declares `glob: module/**/*` with `to: src/{{name}}/` and the glob matches `module/service.t`, `module/index.t`
- **THEN** files `src/<name>/service.ts` and `src/<name>/index.ts` are created, each rendered from its matched template

#### Scenario: base and stripExtensions shape destination paths

- **WHEN** a glob action matches a file whose path is below the `base:` prefix and whose name ends with a listed `stripExtensions:` extension
- **THEN** the rendered destination keeps only the path below `base` with the listed extension removed, and file-name EJS expressions are evaluated against the run locals

#### Scenario: glob conflicts with mirroring

- **WHEN** a template declares both `mirror: true` and a `glob:` attribute
- **THEN** the run fails with a configuration error explaining the incompatibility

#### Scenario: name lists multiply with glob matches

- **WHEN** a glob action runs with a comma-separated name list of two names
- **THEN** the glob is expanded once per name in the name-outer × action-inner order already defined for multi-action runs

### Requirement: skipIfExists on file actions

A file-creating action (`to:`-based, mirroring, or glob-expanded) MAY declare `skipIfExists: true`. When the destination file already exists, the action SHALL be skipped without failure and without modifying the existing file. Without the attribute, existing-file behavior remains as currently defined (overwrite for `to:` actions).

#### Scenario: existing target with skipIfExists

- **WHEN** a file action with `skipIfExists: true` targets an existing file
- **THEN** the file is left untouched and the action outcome is reported as skipped, not failed

#### Scenario: skipIfExists interacts with keep-going

- **WHEN** a run with `--keep-going` contains a mix of skipped and successful file actions
- **THEN** skipped actions do not appear in `RunnerResult.failures` and later actions still run

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

### Requirement: Interactive generator and action picker

When the CLI is invoked without positional arguments in an interactive terminal, the runner SHALL present a two-level picker: first the list of generators discovered in the templates root, then the list of actions within the selected generator. The selected generator and action SHALL be used for the run exactly as if passed positionally; all flags remain in effect.

#### Scenario: Two-level selection drives the run

- **WHEN** the user runs `hygen` with no arguments and picks generator `module` and action `new`
- **THEN** the run executes the `module/new` templates and prompts for the remaining inputs (name, etc.) as usual

#### Scenario: Multiple actions are selectable individually

- **WHEN** the chosen generator contains several action directories
- **THEN** the second picker level lists all of them and the user's single selection determines the action

#### Scenario: No generators found

- **WHEN** the templates root contains no generators and the picker is invoked
- **THEN** the CLI reports that no generators were found with guidance on creating `_templates`, instead of an empty menu

### Requirement: Non-interactive fallback for the picker

When stdout/stdin is not a TTY, the no-argument invocation SHALL NOT launch the picker; it SHALL fail with the existing missing-arguments error, extended to mention that the interactive picker requires a terminal.

#### Scenario: Piped invocation fails fast

- **WHEN** `hygen` is invoked with no arguments in a non-interactive environment (e.g. CI, piped stdio)
- **THEN** the run exits with the missing-arguments error without attempting any prompting

### Requirement: Action hooks file resolution

The runner SHALL look for an action hook module in the action folder in this
priority order: `hooks.ts`, `hooks.js`, `hooks.mjs`, `hooks.cjs`, then the legacy
`index.js`, `index.ts`, `prompt.cjs`, `prompt.js`, `prompt.ts`. The first existing
candidate SHALL be used and no other candidate SHALL be loaded.

#### Scenario: Hooks file wins over legacy prompt hook

- **WHEN** an action folder contains both `hooks.ts` and `prompt.js`
- **THEN** the runner loads `hooks.ts` and ignores `prompt.js`

#### Scenario: Module formats honored

- **WHEN** the action folder contains `hooks.cjs`, `hooks.mjs`, or `hooks.js`
- **THEN** the runner loads it with the module-system semantics of that extension

#### Scenario: Legacy hook unchanged

- **WHEN** an action folder contains only `prompt.js` or `index.js`
- **THEN** the runner treats it as before and runs no lifecycle methods

#### Scenario: No hook file

- **WHEN** an action folder contains no hook candidate
- **THEN** the run proceeds with CLI-supplied and prompted values only and no error

### Requirement: Action hooks class contract

A `hooks.*` module SHALL export a class as its default export. The runner SHALL
construct one instance per action run and use it for every pair of that action, so
instance fields carry state across pairs. Every method SHALL be optional and MAY be
asynchronous.

#### Scenario: State carried across pairs

- **WHEN** `hooks.ts` increments an instance counter in `beforeEach` and the run
  expands two names
- **THEN** the second `beforeEach` sees the counter incremented by the first

#### Scenario: Minimal hooks class

- **WHEN** the class defines only `afterAll`
- **THEN** missing lifecycle methods are treated as no-ops and the run succeeds

### Requirement: Prompt section in the hooks class

When the hooks class defines `prompt({ prompter, args, h })`, the runner SHALL call
it in place of prompting for unresolved values, and its resolved object SHALL become
the template variables for the pair. The legacy `params`, `prompt`, and
question-array shapes SHALL keep their current behavior for legacy hook files.

#### Scenario: Prompt section supplies variables

- **WHEN** the hooks class returns `{ componentName: 'button' }` from its prompt
  section and a template uses `<%= componentName %>`
- **THEN** the rendered output contains `button`

### Requirement: Lifecycle unit and order

The runner SHALL call `beforeAll` once per run before the pair loops and `afterAll`
once per run after them. It SHALL call `beforeEach` before the pair's prompt phase
and `afterEach` after the pair's execution, passing the pair's results. Both pair
hooks SHALL receive the pair's `name` and `action`.

#### Scenario: Per-pair hooks around one pair

- **WHEN** a run expands one action and one name with all four methods defined
- **THEN** the call order is `beforeAll`, `beforeEach`, generation, `afterEach`,
  `afterAll`

#### Scenario: Pair hooks repeat per expansion

- **WHEN** a run expands one action over two names
- **THEN** `beforeEach` and `afterEach` run twice while `beforeAll` and `afterAll`
  run once

#### Scenario: afterEach receives results

- **WHEN** the pair created a file and `afterEach(ctx, results)` is defined
- **THEN** `results` contains the pair's operation outcomes

### Requirement: Lifecycle composition across levels

Project-level hooks SHALL wrap action-level hooks: `beforeAll` and `beforeEach` run
project hooks first, `afterEach` and `afterAll` run action hooks first.

#### Scenario: Both levels defined

- **WHEN** the project config declares `hooks.beforeEach` and the action declares
  `beforeEach`
- **THEN** the project hook runs before the action hook, and their `afterEach`
  counterparts run in reverse order

### Requirement: Lifecycle failure semantics

A failing `beforeAll` SHALL skip every pair of that level and the matching
`afterAll` SHALL still run. A failing `beforeEach` SHALL skip its pair while
`afterEach` still runs for both levels. A failing `afterEach` or `afterAll` SHALL
mark the run as failed. Hook failures SHALL be reported through the existing
`statuses`/`failures` model with the hook error message.

#### Scenario: beforeAll failure

- **WHEN** the action's `beforeAll` throws and the run expands two names
- **THEN** neither pair is generated, `afterAll` still runs, and the run fails

#### Scenario: beforeEach failure with keep-going

- **WHEN** `beforeEach` throws for one pair of a `--keep-going` run
- **THEN** that pair is recorded as failed while the remaining pairs still generate

#### Scenario: afterEach failure

- **WHEN** every pair generated successfully but `afterEach` throws
- **THEN** the run is reported as failed with the hook error message

### Requirement: Lifecycle hooks in dry mode

The runner SHALL call lifecycle hooks in `--dry` mode and SHALL expose the dry flag
to them, leaving side effects to the hook's own decision.

#### Scenario: Dry run still runs hooks

- **WHEN** `--dry` is passed and the action defines `beforeAll`
- **THEN** `beforeAll` runs and receives a context whose dry flag is true, while no
  files are written
