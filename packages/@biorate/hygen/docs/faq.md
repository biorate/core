> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream FAQ](https://github.com/jondot/hygen/blob/master/docs/faq.md)

# FAQ

## Why should I use hygen?

There are a few generator toolkits; arguably Yeoman is the most popular. Hyggen was born to
solve developer effectiveness in a multi-team, multi-module monorepo containing frontend
(React, Redux) and backend (Node.js) projects. Every team had its nuances, ceremonies and
ways of staying effective, and every project had those as well. With hygen, developers can
create many different generators, suited to any kind of development workflow, and evolve,
improve and adapt them as the project and workflow change.

This is also why `hygen` keeps generator code as close to your actual code as possible: you
include generator changes in the same PR as your code, for it to be reviewed by the same
people.

Whereas Yeoman is great for building self-sufficient, wholesale generators for a specific
problem by one person passionate about it, with hygen your _team_ builds generators, all the
time, collaboratively.

## How do I lowercase, uppercase or transform variables?

`EJS` lets you use JavaScript, so plenty of what you know is already available. Transform
text inline and make new variables in code blocks on the fly:

```yaml
---
to: app/reducers/<%= reducer.toLowerCase() %>.js
---
<%
defaulted = reducer || 'my-reducer'
%>
Hello <%= defaulted %>.
```

## Can I inject using regular expressions that span across newlines?

`hygen` works on a line-by-line basis: injection inserts the _lines_ of the template
_between lines_ (by `\n`) of the target file according to the expression supplied.

The `before`, `after`, and `skip_if` injection properties support multi-line regular
expressions:

- `skip_if` is always evaluated as a potentially multi-line expression across the entire
  target file.
- `before` and `after` first try to match the expression within any single line of the
  target file; if no match is found, they then attempt a multi-line match.
- `before` injects before the line on which the match began, and `after` injects after the
  line on which the match ended.

If a `before`/`after` anchor still does not match (neither a single line nor the whole
text), the injection **fails** with `InjectionAnchorNotFoundError` and the file is left
untouched — see [errors](#errors-and-troubleshooting).

## Can I inject multiple times into the same file?

Yes! Use multiple template files, each responsible for a different part of the injection:

```
my-generator/
  new/
    index.js.t
    add-redux-to-package.json.t    <- injects to package.json
    add-lodash-to-package.json.t   <- injects to package.json
```

`hygen` parallelizes most of its book-keeping for speed, but file operations are executed
serially to avoid operations stepping on each other.

## How do I generate for several names/actions in one command?

Pass comma-separated **lists** to the action and/or name positionals:

```bash
hygen mailer new,html a,b
```

Actions run sequentially in list order; the name loop is name-outer (each name completes
all its actions before the next starts). A multi-run is **fail-fast by default** — pass
`--keep-going` to continue past a failing pair and collect every failure. Because a
multi-run is sugar over sequential runs (no rollback), preview with `--dry` first. See
[Multiple actions and names in one run](./generators#multiple-actions-and-names-in-one-run).

## Why does my template without `to:` create nothing?

Because a template with no `to:` is a **no-op by default** — hygen renders the body but
does not write a file (this is the long-standing behavior for `sh`-only and un-targeted
templates, and it is preserved to avoid silently creating files). If you want the output
to mirror the template's location inside the action folder, opt in with `mirror: true`:

```yaml
---
mirror: true
---
```

The target path then mirrors the template's location (with the trailing `.t` suffix
stripped) relative to the current directory. Explicit `to:` always wins over `mirror`, and
`sh`-only templates never mirror. See [Mirroring the template layout](./templates#mirroring-the-template-layout-mirror).

## I want to use generators from a single place

If you have several `_templates` locations within a project (say for a server and a client),
you usually `cd` into each sub-project to use hygen:

```bash
[src/] $ cd server
[server/] $ hygen route new --name authentication
[server/] $ cd ../client
[client/] $ hygen page new --name authentication
```

`hygen` does not discover templates down the folder tree out of the box. But it is flexible
about template location, so point `HYGEN_TMPLS` at the right root via your `package.json`
scripts:

```json
{
  "scripts": {
    "g:client": "HYGEN_TMPLS=src/client/_templates hygen",
    "g:server": "HYGEN_TMPLS=src/server/_templates hygen"
  }
}
```

Then run from the top `src/` vantage point:

```bash
[src/] $ yarn g:client page new --name authentication
[src/] $ yarn g:server page new --name authentication
```

## Should I check in my templates?

Yes. A critical point of the hygen approach is that templates and generators are co-located
with a project, a team, a branch. A team can review templates in the same way they review
their code.

## Isn't generating code counteracting DRY (don't repeat yourself)?

Not in this case. `hygen` is built for modern app architectures that demand modularity,
clean code and high maintainability and are already DRY. There are still multiple tools
requiring various ceremonies (most trivially, tests) that are set up by hand or by a
combination of shortcuts. `hygen` streamlines all these, giving you the tools to save time.

## What's the difference from generator X/Y/Z?

Compared with `plop`: hygen was built to support a large number of teams, developers, and/or
a big code base, so it scales and evolves with your project and team. Plop makes all these
people and activity share a single file, which is a pain in merges, conflicts and code
reviews. `hygen` is contextual: it automatically understands where it is in your code base
and what generators are relevant for each part (think monorepos) and uses only those.

A design goal for hygen is to be _instinctive_: the effort to make a generator and meet your
goal should always go toward zero. Hence generator-generators, helpers, a familiar
logic-full templating engine, and attention to speed.

## Can I force hygen to always overwrite (e.g. `--force`)?

To avoid prompts and force overwrites, use the `HYGEN_OVERWRITE` environment flag:

```bash
HYGEN_OVERWRITE=1 hygen generator new --name foobar
```

With this set, `hygen` always writes content without asking, even if the file already
exists.

## Escaping and HTML

In this fork, `<%= %>` does **not** HTML-escape (the EJS `escape` option is the identity),
because the tool generates code, not markup. Both `<%= %>` and `<%- %>` are raw
interpolations, so `a > b && c < d` is written to the target file verbatim (no `&gt;` /
`&amp;`). See [Escaping semantics](./templates#escaping-semantics).

## Errors and troubleshooting

All runtime errors in this fork are `BaseError` subclasses from the monorepo error standard
(`@biorate/errors`). They are exported from the package as `errors` and have parameterized
messages. When a run fails, `success` is `false`, the file is untouched, and the process
exits non-zero (in the embeddable API, `run result.failure` carries the error).

| Error class                    | Thrown when                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `TemplateRenderError`          | An EJS template or its frontmatter fails to render (e.g. a syntax error).                                                 |
| `TemplateNotFoundError`        | The action folder for a generator does not exist.                                                                         |
| `InjectionTargetNotFoundError` | An inject target file does not exist and `create_if_missing` is not set.                                                  |
| `InjectionAnchorNotFoundError` | An inject `before`/`after` anchor is not found; the inject operation fails and the file is untouched.                     |
| `TemplateConfigError`          | Inject-family options are used together incorrectly (`inject`+`replace`, or `replace` with `prepend`/`append`/`at_line`). |
| `ShellCommandError`            | A shell command fails and its exit code is not ignored.                                                                   |
| `ShowHelpError`                | The user did not specify a generator/action, or the action folder was not found; the CLI prints help.                     |
| `SetupRepositoryError`         | A `setup` frontmatter value is not a valid repository.                                                                    |

`ShowHelpError` is what triggers the CLI's help output when you run `hygen` with no
arguments or an unknown generator/action. (`ShellCommandError` is raised by the default
`exec` hook; the exact set and messages are defined in `src/errors.ts`.)

See [Injection](./templates#injection) for the inject-family error behavior, and
[extensibility](./extensibility) for the embeddable `runner()` API's `failure` result.

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).
