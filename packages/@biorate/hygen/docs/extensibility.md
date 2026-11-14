> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](/).
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

### Project lifecycle hooks

The config file may declare an optional `hooks` field: a **plain object** with the four
lifecycle methods `beforeAll`, `beforeEach`, `afterEach`, `afterAll`. Project hooks apply
to **every** generator run, wrapping whatever the action-level hooks do (see
[Ordering and composition](#ordering-and-composition)):

```javascript
// .hygen.js
module.exports = {
  helpers: {
    /* ... */
  },
  hooks: {
    async beforeAll(ctx) {
      ctx.logger.log(`run starting in ${ctx.cwd}`);
    },
    async beforeEach(ctx) {
      // runs before each (name, action) pair's prompt phase
    },
    async afterEach(ctx, results) {
      // results is the pair's ActionResult[]
    },
    async afterAll(ctx, results) {
      // results accumulates all pair results of the run
    },
  },
};
```

Key points:

- **Plain object, not a class.** Unlike action hooks (a class, see
  [The hooks class](#the-hooks-class)), the project-level `hooks` is a plain object with
  the same four methods — there is no `prompt` section at this level.
- **State via closure.** Since the object is plain, any cross-run or cross-pair state must
  live in the config module's closure (a variable captured by the hook methods).
- **Lenient validation.** Only function-valued entries are used; unknown or non-function
  entries are ignored with a warning instead of failing the run.
- Run-scoped methods (`beforeAll`, `afterAll`) are called once per run and receive
  `action: '*'` with no `name`.
- All methods are optional and may be `async`.

## Action hooks and lifecycle

An action folder can carry a hook module that both prompts and observes the run through
lifecycle methods.

### Where action hooks live

The runner checks the candidates in the action folder in this order; the first existing
file wins and **nothing else is loaded**:

| Priority | File name    | Notes                                     |
| -------- | ------------ | ----------------------------------------- |
| 1        | `hooks.ts`   | Modern form — TypeScript, on-the-fly      |
| 2        | `hooks.js`   | Modern form — follows host project `type` |
| 3        | `hooks.mjs`  | Modern form — explicit ESM                |
| 4        | `hooks.cjs`  | Modern form — explicit CommonJS           |
| 5        | `index.js`   | Legacy prompt hook                        |
| 6        | `index.ts`   | Legacy prompt hook                        |
| 7        | `prompt.cjs` | Legacy prompt hook                        |
| 8        | `prompt.js`  | Legacy prompt hook                        |
| 9        | `prompt.ts`  | Legacy prompt hook                        |

- The four `hooks.*` files always take priority over the legacy files.
- Legacy modules (`index.*`, `prompt.*`) keep working unchanged and have **no lifecycle
  methods** — they only prompt (see [prompt hooks](./prompts)).
- Hook files are not rendered as templates; they are loaded as modules.

### The hooks class

A `hooks.*` file **must export a class as its default export**; otherwise a
`HookModuleError` naming the file is thrown. The runner constructs **one instance per
action run** and reuses it for every `(name, action)` pair, so instance fields carry state
across pairs.

All methods are optional and may be `async`:

| Method                          | Called                                                                      |
| ------------------------------- | --------------------------------------------------------------------------- |
| `beforeAll(ctx)`                | Once per action run, before that action's pairs                             |
| `beforeEach(ctx)`               | Before the pair's prompt phase                                              |
| `afterEach(ctx, results)`       | After the pair's execution; `results` is that pair's `ActionResult[]`       |
| `afterAll(ctx, results)`        | Once per action run; `results` accumulates all of the action's pair results |
| `prompt({ prompter, args, h })` | The prompt section — replaces the legacy prompt hook                        |

The `ctx` object passed to the lifecycle methods:

| Field       | Description                                                                     |
| ----------- | ------------------------------------------------------------------------------- |
| `cwd`       | Working directory of the run                                                    |
| `templates` | Resolved templates directory                                                    |
| `generator` | Generator name (e.g. `mailer`)                                                  |
| `action`    | Action name (`new`, or `new:subaction`) — `'*'` for run-scoped hooks            |
| `subaction` | Subaction, when present                                                         |
| `name`      | Current name expansion, when present                                            |
| `args`      | CLI flags plus `name`, before prompt answers                                    |
| `h`         | Helpers (built-in + project), resolved once per run from CLI args on first read |
| `logger`    | The run's logger                                                                |
| `dry`       | `true` in `--dry` runs                                                          |

Run-scoped hooks (`project.beforeAll`, `project.afterAll`) receive `action: '*'` and no
`name`.

### The prompt section

The `prompt({ prompter, args, h })` method is the prompt phase of the class — it replaces
the legacy prompt hook, and its returned object becomes template variables. The `h`
namespace is resolved lazily on first read from the run's CLI arguments (positionals plus
flags). Everything documented on the [prompt hooks](./prompts) page (prompter usage,
filtering, `args`) applies.

### Declarative parameters (`params`)

A class-based hook module can also export a **parameter schema** — a `params` array that
drives flag coercion, prompting and validation for the action, replacing hand-written
prompt questions with one declaration:

```ts
// hooks.ts
class Hooks {
  beforeAll(ctx) {
    /* ... */
  }
}
export const params = [
  { name: 'label', type: 'string', required: true, message: 'Component name?' },
  { name: 'count', type: 'number', default: 1 },
  { name: 'dry', type: 'boolean' },
  { name: 'stamp', type: (raw) => new Date(raw ?? Date.now()) }, // custom type
];
export default Hooks;
```

Per `(name, action)` pair the engine:

1. **Coerces** each declared parameter found among the CLI flags to its type
   (`'3'` → `3` for `number`, `'true'` → `true` for `boolean`). A value that cannot be
   coerced fails the run naming the parameter and the expected type.
2. **Prompts once** for every _required_ parameter that was not supplied as a flag
   (`message` is the question text, `default` the initial answer). Parameters already
   supplied are never asked again.
3. **Validates** the merged values against the declared types; a `required` parameter
   that stayed absent fails the run naming the parameter.

`type` accepts `'string'` (default), `'number'`, `'boolean'` — or a **function** whose
return value becomes the parameter value (a thrown error surfaces under the parameter
name). An unknown string type fails when the hooks are loaded, so a schema mistake never
reaches a run. Only the modern class form (`hooks.*`, kind `class`) honors `params`;
legacy modules keep their own `params(...)` function.

### Flag-key normalization (`argCase`)

By default flag keys keep their CLI spelling: `--my-flag` reaches templates as the
`my-flag` local. When the runner configuration declares `argCase: 'upper-underscore'`,
hyphenated and camel-cased flag keys are normalized to `UPPER_UNDERSCORE`
(`--my-flag` and `--myFlag` both become `MY_FLAG`). The reserved keys (`_`, `ts`,
`name`, `generator`, `action`) are never normalized.

### Ordering and composition

Project hooks wrap action hooks like nested test suites:

```
project.beforeAll
  action.beforeAll
    for each (name, action) pair:
      project.beforeEach
      action.beforeEach
      prompt -> render -> execute
      action.afterEach(results)
      project.afterEach(results)
  action.afterAll
project.afterAll
```

`project.beforeAll`/`afterAll` run once per run; the action-level ones run once per action
run. `beforeEach` runs **before** the prompt phase; `afterEach` runs **after** execution.

Because the class instance persists across pairs, instance fields make per-run state
trivial — for example a counter that increments per pair:

```typescript
// _templates/mailer/new/hooks.ts
export default class Hooks {
  private n = 0;

  async beforeEach(ctx) {
    this.n += 1;
    ctx.logger.log(`pair #${this.n}`);
  }
}
```

With `hygen mailer new a,b` the two name expansions see `1` then `2`.

### Failure semantics

| Hook that throws | Effect                                                                                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `beforeAll`      | Every pair it guards is skipped and marked `failed` with the hook error; its matching `afterAll` still runs. A project `beforeAll` failure guards all pairs; an action `beforeAll` failure guards only that action's pairs. |
| `beforeEach`     | That pair is skipped and marked `failed`; both `afterEach` levels still run for it.                                                                                                                                         |
| `afterEach`      | The pair is recorded as failed; the run fails.                                                                                                                                                                              |
| `afterAll`       | The run fails even when every pair succeeded.                                                                                                                                                                               |

Pair-attributable failures (`beforeEach`, `afterEach`) are reported with the pair's
`action` and `name` in `failures`/`statuses`. Run-scoped failures (`afterAll`, and
`beforeAll` with no pair to guard) use the sentinel `action: '*'` with no `name`.

A single-pair × single-action run rethrows the original hook error unchanged. Without
`--keep-going` the run fails with the pair label; with `--keep-going` hook failures are
collected per pair and the remaining pairs still run.

### Dry mode

In `--dry` runs hooks are called exactly as usual and receive `ctx.dry === true`; no files
are written. A hook can use `ctx.dry` to skip its own side effects.

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

`helpers` can also be a function `(locals, config) => Helpers`. It is invoked for every
template render — once for the frontmatter attributes and once for the body — with that
action's locals (`name`, flags and prompt answers included), and lazily at most once per
run when lifecycle hooks or a class `prompt` section read `h`. A hook-scoped call
receives the run's CLI arguments (`_` positionals plus flags, without the per-pair
`name` and without prompt answers).

Because the same factory can be called several times in one run, it must be re-entrant
and must not depend on per-template or prompt-provided values: `locals` is the raw
argument object of that particular call, not a stable per-run store. Outside rendering
the runner never calls the factory with empty locals.

This is the place for lazy resolution: wrap the `require` in `try/catch` and throw a
friendly error instead of the raw `Cannot find module`:

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

## Content transforms

Besides helpers, the config file can declare a `transforms` namespace: named
post-processors that run over the rendered template content before it is written or
injected. Each transform is a function `(content, locals) => string | Promise<string>`;
a template opts in with the `transform:` frontmatter attribute, and several transforms can
be chained left-to-right with `|`.

See [Content transforms](./content-transforms) for the full reference — the config shape,
chaining, and the failure/edge modes.

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
[Differences from upstream](/) and the [LICENSE](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE).
