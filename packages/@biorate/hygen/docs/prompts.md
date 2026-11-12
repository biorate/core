> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream generators doc](https://github.com/jondot/hygen/blob/master/docs/generators.md)

# Prompt hooks

A prompt hook is a JavaScript module in the action folder that collects or computes the
variables handed to the templates of that action. This page is the complete reference:
file names and lookup order, the three hook forms, filtering semantics, and TypeScript
support. For a quick introduction see [generators](./generators#interactive-prompts).

## Where the hook lives

The hook file sits in the action folder and is **shared by every template** in that
folder — it runs once per action, before any template renders:

```
_templates/
  mailer/
    new/           <- the "mailer new" action
      prompt.js    <- one hook for html.ejs.t and text.ejs.t
      html.ejs.t
      text.ejs.t
```

## File names and lookup order

The runner looks for the **first existing** file in the action folder, in this order:

| Priority | File name    | Notes                             |
| -------- | ------------ | --------------------------------- |
| 1        | `index.js`   | Preferred for advanced hooks      |
| 2        | `index.ts`   | TypeScript, transpiled on the fly |
| 3        | `prompt.cjs` | Explicit CommonJS                 |
| 4        | `prompt.js`  | The conventional choice           |
| 5        | `prompt.ts`  | TypeScript, transpiled on the fly |

If none exists, no prompting happens and the action proceeds with the CLI variables only.
TypeScript hooks work out of the box: the runner lazily registers
`ts-node/register/transpile-only` on first use. Both module systems are supported —
`module.exports` (CommonJS) and `export default` / named `export` (ESM); the runner
performs a dynamic `import()` and unwraps `default` when present.

## The three hook forms

The runner inspects the module's exports and picks the matching form. The check order is
fixed: **`params` first, then `prompt`, then a plain question array** — e.g. if a module
exports `params`, the `prompt` export (if any) is never called.

### Form 1: a question array (declarative)

The simplest form — an array of [enquirer](https://github.com/enquirer/enquirer#prompt-options)
questions. The runner asks only the questions whose answers were **not** already provided
on the CLI (see [filtering](#filtering-ask-only-whats-missing)):

```javascript
// _templates/mailer/new/prompt.js
module.exports = [
  {
    type: 'input',
    name: 'message', // becomes the <%= message %> template variable
    message: "What's your message?",
    validate: (v) => v.length > 0 || 'Required',
  },
  {
    type: 'confirm',
    name: 'typescript',
    message: 'Use TypeScript?',
    initial: true,
  },
];
```

### Form 2: a `prompt` function (full control)

The hook receives `{ prompter, inquirer, args, h }` and decides itself what to ask, in how
many steps, and whether to ask at all. Everything the function returns merges into the
template variables:

```javascript
module.exports = {
  async prompt({ prompter, args, h }) {
    // custom shortcut: no prompting when the value came from the CLI
    if (args.author) return {};

    const { kind } = await prompter.prompt([
      { type: 'select', name: 'kind', message: 'Kind?', choices: ['worker', 'service'] },
    ]);

    const { name } = await prompter.prompt([
      {
        type: 'input',
        name: 'name',
        message: `${kind} name?`,
        initial: h.changeCase.paramCase(`My${kind}`),
      },
    ]);

    return { kind, name };
  },
};
```

Hook arguments:

| Field      | Description                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `prompter` | The enquirer-compatible prompter instance configured for this run                                          |
| `inquirer` | An **alias** of `prompter`, kept for compatibility with inquirer-era templates                             |
| `args`     | The parsed CLI arguments of this run (flags and positionals)                                               |
| `h`        | The built-in helpers (`h.changeCase`, `h.inflection`, `h.path`, `h.capitalize`) — same `h` as in templates |

### Form 3: a `params` function (no prompting at all)

A pure computation hook: derive the template variables from existing data — CLI args,
project files, environment. The user is never asked anything:

```javascript
const path = require('path');

module.exports = {
  params({ args, h }) {
    const pkg = require(path.join(process.cwd(), 'package.json'));
    return {
      name: args.name || pkg.name,
      author: pkg.author,
      year: new Date().getFullYear(),
    };
  },
};
```

Because `params` is checked **first**, a module exporting it turns the hook into a silent
variable-computation step even if a `prompt` export is also present.

## Filtering: ask only what's missing

In the declarative form (question array) the runner filters the questions by their `name`
against the CLI arguments: a question is asked only when `args[name]` is `undefined`,
`null`, or an empty string; a question whose variable already carries a CLI value is
**skipped**. This is what keeps generators usable non-interactively:

```bash
# asks for "message" (nothing provided)
hygen mailer new --name fancy-mailer

# asks nothing: both variables came from the CLI — safe in CI
hygen mailer new --name fancy-mailer --message "Hello"
```

In the `prompt`-function form filtering is **your** responsibility — the runner hands you
`args` and you decide what to ask (or return early, as in the example above).

## Answers become template variables

Everything the hook yields — question answers or the object returned from
`prompt`/`params` — is merged with the CLI variables and rendered into the templates:

```ejs
---
to: app/emails/<%= name %>.txt
---
<%= message %>
```

CLI flags take precedence in the declarative form (already-provided answers are filtered
out); in the function forms you control the precedence yourself.

## A complete example

The kitchen-sink fixture in this package is a real, tested hook:
[`tests/fixtures/kitchen-sink/_templates/sink/new/prompt.js`](https://github.com/biorate/core/blob/master/packages/@biorate/hygen/tests/fixtures/kitchen-sink/_templates/sink/new/prompt.js) —
a `prompt` function with a CLI shortcut and a defaulted question.

## See also

- [generators](./generators) — organizing generators and actions
- [templates](./templates) — the frontmatter reference and helpers
- [extensibility](./extensibility) — the project config file and embedding via `runner()`
