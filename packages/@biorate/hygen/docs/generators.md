> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream generators guide](https://github.com/jondot/hygen/blob/master/docs/generators.md)

# Generators

A generator is a folder under `_templates`. The folder structure maps to the command
structure, so building a new generator is just creating a folder and a template file.

## Structure

```
_templates/
  mailer/
    new/
      html.ejs.t
      text.ejs.t
  route/
    new/
      handler.ejs.t
      inject_handler.ejs.t
```

`hygen mailer new` renders every file in `_templates/mailer/new/` (`html.ejs.t` and
`text.ejs.t`). `hygen` walks the template folder recursively, so you can nest generators as
elaborately as you like; the command still applies to the whole action folder.

Each template file begins with a `---` frontmatter block (see [templates](./templates) for
the full reference). The `.t` suffix keeps your editor from treating it as an already
compiled file — `hygen` does not care about file names or types, only the folder structure
and the contents.

## Creating a generator

`hygen generator new` (from the starter templates copied by `hygen init self`) scaffolds a
generator for you:

```bash
hygen generator new mailer
#       added: _templates/mailer/new/hello.ejs.t
```

The scaffolding template lives in your project (`_templates/generator/new/hello.ejs.t`), so
you can change how `hygen` generates generators for your team.

## CLI arguments

Any double-dash (`--`) argument becomes a template variable:

```bash
hygen mailer new foobar --message hello --version 1
```

```yaml
---
to: app/emails/<%= name %>.html
---
<h1>Hello <%= name %></h1>
<%= message %>
(version <%= version %>)
```

## Interactive prompts

Add a `prompt.js` to the action folder to collect values interactively before rendering
(the complete reference — file names, hook forms, filtering, TypeScript — lives in
[prompts](./prompts)):

```
_templates/
  mailer/
    new/           <- the mailer new generator
      prompt.js    <- your prompt file!
      html.ejs.t
      text.ejs.t
```

For example, to ask for `message`:

```javascript
module.exports = [
  {
    type: 'input',
    name: 'message',
    message: "What's your message?",
  },
];
```

The prompt format is [enquirer](https://github.com/enquirer/enquirer#prompt-options). The
answers become template variables:

```html
---
to: app/emails/<%= name %>.txt
---

<%= message %>
```

The `name` variable still comes from the CLI:

```bash
hygen mailer new fancy-mailer
```

Templates within an action folder are applied in `localeCompare` order.

## Advanced prompts (`index.js`)

Replace `prompt.js` with an `index.js` in the action folder to build a multi-step flow, skip
prompting conditionally, or reshape CLI arguments in a central place (the complete hook
reference — lookup order, hook arguments, filtering — lives in [prompts](./prompts)):

```
my-generator/
  my-action/
    index.js
    template1.ejs.t
    template2.ejs.t
```

Instead of exporting an array, export an object with a `prompt` function (and an optional
`params` function):

```javascript
// my-generator/my-action/index.js
module.exports = {
  prompt: ({ prompter, args }) =>
    prompter
      .prompt({
        type: 'input',
        name: 'email',
        message: "What's your email?",
      })
      .then(({ email }) =>
        prompter.prompt({
          type: 'input',
          name: 'emailConfirmation',
          message: `Please type your email [${email}] again:`,
        }),
      ),
};
```

The `prompt` function receives a structure with a `prompter` field. `params` reshapes CLI
arguments into new variables:

```javascript
// my-generator/my-action/index.js
module.exports = {
  params: ({ args }) => {
    return { moreConvenientName: args.foobamboozle };
  },
};
```

## Documenting generators

The `message` frontmatter prop builds generator help screens. A `help` action with a blank
template and a `message:` renders as the help text:

```yaml
---
message: |
  - hygen {bold mailer} new [NAME]
---
```

The `|` annotation is a YAML literal block. `message:` supports chalk-style coloring:

```javascript
{bold mailer}
{red mailer}
{underline mailer}
{green mailer}
```

## Selecting parts of a generator

`hygen GENERATOR ACTION:SUBACTION` selects a subset of a generator's files, where
`SUBACTION` is a string or regular expression matched against the file name:

```bash
hygen mailer new:text textual-mailer
# renders only text.ejs.t

hygen mailer new:.*xt textual-mailer
# same, via regular expression
```

## Multiple actions and names in one run

Both the action and the name positionals accept a comma-separated **list**, so one
command can render several actions and/or several names:

```bash
# two actions, one name
hygen mailer new,html my-mailer

# one action, two names (name-outer: each name completes all its actions)
hygen mailer new a,b

# two actions AND two names
hygen mailer model,controller a,b
```

### Action lists

```bash
hygen mailer new,html fancy-mailer
```

The listed actions run **sequentially in list order** — `new` completes fully before
`html` starts. Each listed action runs its own prompt hook and its own render pipeline;
shared values come from CLI flags (see [prompts](./prompts#hooks-under-lists)). A
`ACTION:SUBACTION` selector applies within each listed action, so you can restrict every
action in the list the same way (`hygen mailer new:text,html:text x`).

### Name lists

```bash
hygen mailer new a,b
```

This renders `new` once per name. The loop is **name-outer**: each entity completes all
its actions before the next entity starts. For `model,controller × a,b` the execution
order is `(model,a)`, `(controller,a)`, `(model,b)`, `(controller,b)`. Inside templates,
`name` is always a **scalar** — the current expansion's value — never an array.

The bare variant works too: when the action folder does not exist, the second positional
is treated as the (comma-list) name for the generator's `_default` action:
`hygen crud a,b` — or, combined with an action list, `hygen crud new,html a,b`.

### Fail fast vs `--keep-going`

Failure policy is **fail-fast by default**: the first failing pair stops the run and the
error names the specific action (and name) that failed. Set `--keep-going` to continue
through the remaining pairs and collect every failure:

```bash
hygen mailer new,html a,b --keep-going
```

With `--keep-going`, the returned `RunnerResult` carries both the partial `actions` that
did complete and a `failures` list — one entry per failed pair (`action`, optional `name`,
`error`). Fail-fast pairs raise the error immediately (in the embeddable `runner()` API,
`result.failure.message` names the pairing that went wrong, and any prior actions are
already on disk).

### No transactionality — use `--dry` first

A multi-run is **sugar over sequential runs, not a transaction**: there is no rollback.
If an early pair succeeds and a later one fails, the earlier output stays on disk. On
fail-fast runs this leaves partial results. To preview what a multi-run would write, run
with `--dry` (`hygen mailer new,html a,b --dry`) — files are generated but not saved —
before committing to a real run.

## Templates location

`hygen` finds `_templates` by walking up the directory tree from the working directory and
using the first one it finds. The `HYGEN_TMPLS` environment variable overrides local lookup
(and takes priority over it), which is useful for scripting or pointing at a shared template
root:

```bash
HYGEN_TMPLS=/path/to/other/templates hygen mailer new x
```

In the embeddable API, the location is set via `RunnerConfig.templates` (and
`templatesOverride`); see [extensibility](./extensibility).

That's it for generators. Next: the [FAQ](./faq) and [extensibility](./extensibility).

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).
