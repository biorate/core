# @biorate/hygen

The scalable code generator that lives in your project. Fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo conventions.

## Installation

```bash
npm i -g @biorate/hygen
# или без установки
npx @biorate/hygen ...
```

## Quick start

Initialize `hygen` in your project (once):

```bash
cd your-project
hygen init self
```

Build a generator called `mygen`:

```bash
hygen generator new mygen
#       added: _templates/mygen/new/hello.ejs.t

hygen mygen new
#       added: app/hello.js
```

Templates live in the local `_templates` folder — check it into your project. Folder structure maps to the command structure: `hygen worker new` renders everything in `_templates/worker/new/`.

With an interactive prompt:

```bash
hygen generator with-prompt mygen
hygen mygen with-prompt
```

Check the installed version with `hygen --version` (or `hygen -v`) — it prints `Hygen v<version>` and exits without running any generator.

## Key features

- **Add** — templates create files (`to:` frontmatter, folders auto-created)
- **Inject** — insert into existing files (`inject: true` + `before|after|prepend|append|line_at`, guarded by `skip_if`), create a missing target (`create_if_missing: true`), or replace the first anchor match (`replace: true`, mutually exclusive with `inject`)
- **Shell** — run commands after generation (`sh:` frontmatter)
- **Prompts** — interactive flows via `prompt.js` (enquirer)
- **EJS + frontmatter** — metadata is rendered by the same engine; case helpers (`h.changeCase.*`)
- **Embeddable** — use `runner()` as a library with custom templates, logger, prompter and exec:

```js
const { runner } = require('@biorate/hygen');
const Logger = require('@biorate/hygen/dist/cjs/logger').default;

runner(process.argv.slice(2), {
  templates: path.join(__dirname, 'templates'),
  cwd: process.cwd(),
  logger: new Logger(console.log.bind(console)),
  exec: (action, body) =>
    require('execa').command(
      action,
      body && body.length > 0 ? { input: body, shell: true } : { shell: true },
    ),
  createPrompter: () => require('enquirer'),
});
```

## Documentation

- [Quick start](./docs/quick-start.md)
- [Templates](./docs/templates.md)
- [Generators](./docs/generators.md)
- [Extensibility](./docs/extensibility.md)
- [FAQ](./docs/faq.md)

Full list: `docs/`.

## Differences from upstream

- Errors follow the monorepo standard: `BaseError`-derived classes (`src/errors.ts`) instead of raw `Error`.
- Strict TypeScript; Jest tests migrated to Vitest; metaverse tests not included.
- CLI binary ships compiled templates (`dist/cjs/templates`); Homebrew/standalone binaries are not built.
- `<%= %>` does not HTML-escape: the ejs `escape` option is set to the identity (`(s) => s`), since the tool generates code, not HTML. Use `<%- %>` semantics are unchanged.
- Inject-family extensions on top of upstream: `create_if_missing: true` creates a missing target before injecting; `replace: true` replaces the first `before`/`after` anchor match with the body (mutually exclusive with `inject`); `skip_if_not: true` inverts the `skip_if` guard. Upstream treats these as plain template variables.

> Note: templates are code — EJS renders arbitrary expressions, so only use templates from repositories you trust.

## License

MIT — original work © Dotan Nahum (jondot/hygen), fork adaptations © biorate. This is a fork of [jondot/hygen](https://github.com/jondot/hygen): the copyright was updated to the repository owner (Leonid Levkin) and the upstream copyright line is preserved in the `LICENSE` file.
