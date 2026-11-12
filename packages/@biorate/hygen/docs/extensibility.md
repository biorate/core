> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream extensibility](https://github.com/jondot/hygen/blob/master/docs/extensibility.md)

# Extensibility

`hygen` is extensible via a project config file (helpers, logger, template location, shell
executor) and, programmatically, via the embeddable `runner()` API.

## Project config file

`hygen` looks for a config file by walking up the directory tree from where you run
`hygen`, stopping at the first directory that contains any candidate file.

### File names and priority

The runner checks the candidates in each directory in this order:

| Priority | File name    | Notes                                   |
| -------- | ------------ | --------------------------------------- |
| 1        | `.hygen.js`  | Follows the host project's `type` field |
| 2        | `.hygen.cjs` | Explicit CommonJS                       |
| 3        | `.hygen.mjs` | Explicit ESM                            |
| 4        | `.hygen.ts`  | TypeScript, transpiled on the fly       |

### Nearest directory wins

The walk goes from the current directory up to the filesystem root, and the first directory
containing **any** candidate is used; within that directory, the priority order decides
between candidates. This means:

- You can set up a single file per project.
- Sub-projects can override behavior with their own file.
- You can drop one in your directory for a global default.

When candidates exist in several directories on the way up, only the nearest one is loaded
and the rest are ignored — for example a `.hygen.cjs` in a subdirectory beats a `.hygen.js`
higher up.

### Module systems

The resolved file is loaded with a dynamic `import()`, so module-system semantics follow
the file extension for the explicit formats:

- `.hygen.cjs` is CommonJS (`module.exports`).
- `.hygen.mjs` is ESM (`export default` / named `export`).
- A plain `.hygen.js` follows the **host project's** module system — the nearest
  `package.json` `type` field. In a `"type": "module"` project a `.hygen.js` written with
  `module.exports` will fail, so use `.hygen.cjs` there instead.

These explicit formats work independently of the host project's `type` field.

### TypeScript

`.hygen.ts` files are transpiled on the fly: the runner lazily registers
`ts-node/register/transpile-only` on first use, so `ts-node` must be available (install it
with `npm i -D ts-node` if it is not already a dependency).

### Backward compatibility

Projects with an existing `.hygen.js` keep resolving exactly as before — it remains the
highest priority candidate.

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

### External libraries as helpers

Anything `require`-able in the project where you run `hygen` can be exposed to templates
the same way — utility libraries, sibling packages in a monorepo, your own modules.

> **Note:** the library must be an installed dependency of the project where `hygen`
> runs. `hygen` resolves `require` from the running project, not from its own bundle —
> a library that is not installed there will fail to load.

#### Lodash (plain object form)

Require the library at config load and bind it (whole or in wrappers) under a namespace:

```javascript
// .hygen.js
const _ = require('lodash');

module.exports = {
  helpers: {
    _: _,
    slug: (s) => _.kebabCase(s),
  },
};
```

Use it in a template as `h.<namespace>`:

```yaml
---
to: given/hygen-js/libraries.md
---
<%= h._.capitalize(name) %>
<%= h.slug(name) %>
```

#### Sibling `@biorate/*` package (monorepo usage)

The same mechanism works for sibling packages in the monorepo, as long as the running
project depends on them:

```javascript
// .hygen.js
const { changeCase } = require('@biorate/change-case');

module.exports = {
  helpers: { changeCase },
};
```

```yaml
<%= h.changeCase.paramCase(name) %>
```

#### Function form (lazy resolution with a friendly error)

`helpers` can also be a function `(locals, config) => Helpers`, evaluated per run. This
is the place for lazy resolution: wrap the `require` in `try/catch` and throw a friendly
error instead of the raw `Cannot find module`:

```javascript
// .hygen.js
module.exports = {
  helpers: (locals, config) => {
    let _;
    try {
      _ = require('lodash');
    } catch (e) {
      throw new Error(
        `lodash is required by this generator's config — install it: npm i -D lodash`,
      );
    }
    return {
      _: _,
      slug: (s) => _.kebabCase(s),
    };
  },
};
```

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
  const result = await runner(['mailer', 'new', 'autumn-newsletter'], {
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
