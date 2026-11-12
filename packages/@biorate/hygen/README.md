# @biorate/hygen

The scalable code generator that lives in your project. A fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo conventions.

## Features

- **CLI** — a project-local `hygen` binary driven by `GENERATOR ACTION` pairs, with `--version` / `-v`, `--dry` run, and `--help`.
- **EJS templates with YAML frontmatter** — template metadata lives in a `---` frontmatter block; both the frontmatter and the body are rendered by the same EJS engine, so `to:` paths, values and content can all be interpolated.
- **Add / inject / shell** — three operation families: `add` (the default, writes new files via `to:`), `inject` (inserts into an existing file), and `sh` (runs a shell command after generation).
- **Inject family** — anchor injection (`before`, `after`, `prepend`, `append`, `at_line`), guarded by `skip_if` / `skip_if_not`; create a missing target with `create_if_missing`, or replace the first anchor match with `replace`.
- **Interactive prompts** — `prompt.js` hooks (enquirer) gather values before rendering.
- **Case helpers** — `h.changeCase.*` and `h.inflection.*` transform names and strings inside templates.
- **Embeddable `runner()` API** — use it as a library with custom templates, logger, prompter and shell executor (see [Embedding API](#embedding-api)).
- **Identity escaping** — `<%= %>` does not HTML-escape (the EJS `escape` option is the identity), because the tool generates code, not HTML.
- **BaseError-based errors** — every failure is a `BaseError`-derived class from `src/errors.ts`, following the monorepo error standard.
- **`--version` flag** — `hygen --version` (or `-v`) prints `Hygen v<version>` and exits without running a generator.

## Installation

For the CLI, install globally (or run without installing):

```bash
npm i -g @biorate/hygen
# or without installing
npx @biorate/hygen ...
```

For embedding in your own project:

```bash
pnpm add @biorate/hygen
```

## Quick start

Initialize `hygen` in your project (once) and create a generator:

```bash
cd your-project
hygen init self
#       added: _templates/generator/with-prompt/hello.ejs.t
#       added: _templates/generator/with-prompt/prompt.js
#       added: _templates/generator/new/hello.ejs.t

hygen generator new mygen
#       added: _templates/mygen/new/hello.ejs.t

hygen mygen new
#       added: app/hello.js
```

Templates live in the project-local `_templates` folder — check it into your project. The folder structure maps to the command structure: `hygen worker new` renders everything in `_templates/worker/new/`.

With an interactive prompt:

```bash
hygen generator with-prompt mygen
hygen mygen with-prompt
```

## Embedding API

`runner(argv, config)` runs the full pipeline programmatically and returns a `RunnerResult` whose `success` flag tells you whether the run went through. It takes the same `GENERATOR ACTION` argv as the CLI plus a minimal `RunnerConfig`:

```ts
import { runner } from '@biorate/hygen';
import * as path from 'path';

async function main() {
  const result = await runner(process.argv.slice(2), {
    cwd: process.cwd(),
    templates: path.join(process.cwd(), 'templates'),
    logger: {
      ok: (msg: string) => console.log(msg),
      notice: (msg: string) => console.log(msg),
      warn: (msg: string) => console.warn(msg),
      err: (msg: string) => console.error(msg),
      log: (msg: string) => console.log(msg),
      colorful: (msg: string) => console.log(msg),
    },
    // Provide a factory that returns a prompter with a `prompt` method.
    createPrompter: <Q, T>() => ({
      prompt: async (_arg0: Q) => ({} as T),
    }),
    // Run shell (`sh:`) commands produced by templates.
    exec: (sh: string, body: string) => {
      void sh;
      void body;
    },
  });

  if (!result.success) {
    console.error(result.failure?.message);
    process.exit(1);
  }
}

void main();
```

`RunnerConfig` requires `cwd`, `logger` (a `Logger`-shaped object), `createPrompter`, and `exec`. Everything else — `templates`, `templatesOverride`, `helpers`, `localsDefaults`, `debug` — is optional. The result (`RunnerResult`) exposes `success`, `time`, `actions`, and a `failure` block when the run fails.

For the full API reference see the [typedoc](https://biorate.github.io/core/modules/hygen.html), and the user guide under [Documentation](#documentation).

## Documentation

The complete user guide lives in the package's local `docs/` pages. README is for the overview, quick start, and embedding; `docs/` is the full guide; typedoc is the generated API reference.

| Page                                     | Contents                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [quick-start](./docs/quick-start.md)     | CLI installation, `init`, generator creation, `--version`.                                       |
| [templates](./docs/templates.md)         | Template & frontmatter reference: `add`, `inject`, `sh`, anchors, `replace`, escaping.           |
| [generators](./docs/generators.md)       | Building and organizing reusable generators.                                                     |
| [prompts](./docs/prompts.md)             | Prompt hooks reference: file names, `params`/`prompt`/array forms, filtering, TS.                |
| [extensibility](./docs/extensibility.md) | Extending hygen via the project config file: helpers, logger, template location, shell executor. |
| [packages](./docs/packages.md)           | Sharing compiled generators as publishable packages (`hygen-add`).                               |
| [create](./docs/create.md)               | Turning existing code into a generator (`hygen-create`).                                         |
| [faq](./docs/faq.md)                     | Why hygen and its position among generator toolkits.                                             |
| [express](./docs/express.md)             | Express.js app generation pattern.                                                               |
| [redux](./docs/redux.md)                 | Redux (ducks) app generation pattern.                                                            |
| [react-native](./docs/react-native.md)   | React Native app generation pattern.                                                             |
| [standalone](./docs/standalone.md)       | Standalone binary distribution.                                                                  |

## Differences from upstream

- **Identity escaping** — `<%= %>` does not HTML-escape: the EJS `escape` option is set to the identity (`(s) => s`), since the tool generates code, not HTML. `<%- %>` semantics are unchanged.
- **`--version` flag** — `hygen --version` / `hygen -v` prints `Hygen v<version>` and exits without running any generator.
- **Anchor-not-found error** — when an `inject` `before`/`after` anchor cannot be found, the injection fails with `InjectionAnchorNotFoundError` instead of silently no-oping.
- **New inject options** — `create_if_missing: true` creates a missing target before injecting; `replace: true` replaces the first `before`/`after` anchor match with the body (mutually exclusive with `inject`); `skip_if_not: true` inverts the `skip_if` guard. Upstream treats these as plain template variables.
- **Composition** — the action and name positionals accept comma lists, so one command runs several actions and/or names (`hygen mailer new,html a,b`); action lists run sequentially, the name loop is name-outer, `--keep-going` collects failures without halting, and `name` is always a scalar in templates. A template with `mirror: true` (and no `to:`) writes to the path mirroring its location inside the action folder, with the trailing `.t` stripped (or `.ejs.t` behind `HYGEN_MIRROR_EJS_SUFFIX=1`). See [Multiple actions and names](./docs/generators.md#multiple-actions-and-names-in-one-run) and [Mirroring](./docs/templates.md#mirroring-the-template-layout-mirror).
- **`--name` flag removed (breaking, semver-major)** — the `--name` flag is no longer accepted by default. Invoking it fails with `NameFlagRemovedError`, whose message names the offending flag, shows the positional equivalent (`hygen <generator> <action[,action...]> <name[,name...]>`), and points at the legacy escape. Use the positional name instead, optionally as a comma list: `hygen mailer new fancy` or `hygen mailer new a,b`. For migration, two legacy escapes restore the pre-removal behavior: set `HYGEN_LEGACY_NAME=1`, or pass `legacyNameFlag: true` in `RunnerConfig` (embedding). Under the escape the flag behaves exactly as before this change (including the repeated-flag array). Name precedence is prompt hook > positional name; the `--name` flag participates only via the legacy escape.
- **Error classes** — errors follow the monorepo standard: `BaseError`-derived classes (`src/errors.ts`) instead of raw `Error`.
- **Strict TypeScript / Vitest** — the package is authored in strict TypeScript; the Jest tests were migrated to Vitest; metaverse tests are not included.
- **Distribution** — the CLI binary ships compiled templates (`dist/cjs/templates`); Homebrew/standalone binaries are not built.

> Note: templates are code — EJS renders arbitrary expressions, so only use templates from repositories you trust.

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE)

This is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT). Original work © Dotan Nahum; the upstream copyright line is preserved in the `LICENSE` file. Fork adaptations © Leonid Levkin.
