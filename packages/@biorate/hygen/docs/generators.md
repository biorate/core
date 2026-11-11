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
hygen generator new --name mailer
#       added: _templates/mailer/new/hello.ejs.t
```

The scaffolding template lives in your project (`_templates/generator/new/hello.ejs.t`), so
you can change how `hygen` generates generators for your team.

## CLI arguments

Any double-dash (`--`) argument becomes a template variable:

```bash
hygen mailer new --name foobar --message hello --version 1
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

Add a `prompt.js` to the action folder to collect values interactively before rendering:

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
hygen mailer new --name fancy-mailer
```

Templates within an action folder are applied in `localeCompare` order.

## Advanced prompts (`index.js`)

Replace `prompt.js` with an `index.js` in the action folder to build a multi-step flow, skip
prompting conditionally, or reshape CLI arguments in a central place:

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
  - hygen {bold mailer} new --name [NAME]
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
hygen mailer new:text --name textual-mailer
# renders only text.ejs.t

hygen mailer new:.*xt --name textual-mailer
# same, via regular expression
```

## Templates location

`hygen` finds `_templates` by walking up the directory tree from the working directory and
using the first one it finds. The `HYGEN_TMPLS` environment variable overrides local lookup
(and takes priority over it), which is useful for scripting or pointing at a shared template
root:

```bash
HYGEN_TMPLS=/path/to/other/templates hygen mailer new --name x
```

In the embeddable API, the location is set via `RunnerConfig.templates` (and
`templatesOverride`); see [extensibility](./extensibility).

That's it for generators. Next: the [FAQ](./faq) and [extensibility](./extensibility).

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).
