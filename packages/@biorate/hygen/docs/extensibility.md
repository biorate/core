> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream extensibility](https://github.com/jondot/hygen/blob/master/docs/extensibility.md)

# Extensibility

`hygen` is extensible via a `.hygen.js` file (helpers, logger, template location, shell
executor) and, programmatically, via the embeddable `runner()` API.

## `.hygen.js`

`hygen` looks for a `.hygen.js` file by walking up the directory tree from where you run
`hygen` and stops at the first one it finds. This means:

- You can set up a single file per project.
- Sub-projects can override behavior with their own file.
- You can drop one in your directory for a global default.

When two or more `.hygen.js` files exist on the way up, the first one found is used and the
rest are ignored.

## Helpers

Add functions to the `h` helper namespace from `.hygen.js`. A template that uses a function
called `extended`:

```yaml
---
to: given/hygen-js/new.md
---
this demonstrates hygen loaded up .hygen.js and extended helpers.
<%= h.extended('hello') %>
```

Define it in a project-root `.hygen.js`:

```javascript
module.exports = {
  helpers: {
    extended: (s) => s.toUpperCase(),
  },
};
```

Beyond inlining a utility, you can `require` any code in your project and export it for
`hygen` to use.

## Customizing logger, template location and shell executor

The same `.hygen.js` file can customize the logger, the templates folder, and the shell
executor:

```javascript
const path = require('path');

module.exports = {
  templates: `${__dirname}/_templates`,
  logger: {
    ok: (msg) => process.stdout.write(msg),
    notice: (msg) => process.stdout.write(msg),
    warn: (msg) => process.stderr.write(msg),
    err: (msg) => process.stderr.write(msg),
    log: (msg) => process.stdout.write(msg),
    colorful: (msg) => process.stdout.write(msg),
  },
  exec: (sh, body) => {
    console.log(`[dry exec] ${sh}`);
  },
};
```

## Embeddable `runner()` API

The same pipeline the CLI uses is available programmatically as `runner(argv, config)` from
the package entry point. It is useful for building your own binary, test harness, or tool
over `hygen`:

```ts
import { runner } from '@biorate/hygen';
import * as path from 'path';

async function main() {
  const result = await runner(['mailer', 'new', '--name', 'autumn-newsletter'], {
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
    createPrompter: <Q, T>() => ({
      prompt: async (_arg0: Q) => ({} as T),
    }),
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

`RunnerConfig` requires `cwd`, `logger` (a `Logger`-shaped object), `createPrompter`, and
`exec`. Everything else — `templates`, `templatesOverride`, `helpers`, `localsDefaults`,
`debug` — is optional. The result (`RunnerResult`) exposes `success`, `time`, `actions`, and
a `failure` block when the run fails.

For the full API reference see the [typedoc](https://biorate.github.io/core/modules/hygen.html).

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).
