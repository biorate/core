> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream templates reference](https://github.com/jondot/hygen/blob/master/docs/templates.md)

# Templates

A `hygen` template is a YAML [frontmatter](#frontmatter) header plus an [EJS](https://github.com/mde/ejs)
body. The frontmatter describes _what to do_ (write, inject, run a shell command); the body
is the content that gets rendered and applied.

```yaml
---
to: app/emails/<%= name %>.html
---
Hello <%= name %>,
<%= message %>
(version <%= version %>)
```

Because both the frontmatter and the body are rendered by the same EJS engine, the `to:`
path, the values and the content can all be interpolated.

## Frontmatter

The frontmatter is delimited by a matching `---` top and bottom with YAML in it. It is
rendered first, so it can reference the same variables the body uses:

```yaml
---
to: app/<%= section %>/emails.js
foo: <%= bar %>
---
```

Given the following command, the frontmatter builds _behind the scenes_ into:

```yaml
---
to: app/weekend/emails.js
foo: ping
---
```

```bash
hygen mailer campaign --section weekend --bar ping
```

## Escaping semantics

**This is the single most important difference from upstream.** In this fork, the `<%= expr %>`
interpolation does **not** HTML-escape: the EJS `escape` option is the identity
(`(s) => s`). The tool generates source code, not markup, so code passages survive verbatim:

```yaml
---
to: app/compare.js
---
const cmp = <%= expr %>;
```

```bash
hygen sink new --expr 'a > b && c < d'
# writes: const cmp = a > b && c < d;   (no &gt; / &amp;)
```

The `<%- expr %>` tag still works and is a raw (unescaped) interpolation; in this fork
`<%= %>` and `<%- %>` therefore produce the same output. Escaping is the identity for
both — there is no upstream advice to "use `<%- %>` to avoid HTML escaping", because there
is nothing to escape.

## Template body

Template bodies are [EJS](https://github.com/mde/ejs):

```ejs
---
to: app/workers/<%= name %>.js
---
class <%= Name %> {
  work() {
    // your code here!
  }
}
```

The variable `name` is blessed: you get a capitalized version for free as `Name`. You can
also compute derived variables inline with a `<% %>` scriptlet:

```ejs
---
to: app/workers/<%= name %>.js
---
<%
  Message = message.toUpperCase()
%>
class <%= Name %> {
  work() {
    return "<%= Message %>";
  }
}
```

The same EJS engine renders both the body and the `to:` path.

## Helpers and inflections

The special object `h` hosts built-in helpers. `h.capitalize` uppercases the first
character; `h.inflection` pluralizes and singularizes, and includes the fork's
`undasherize` (kebab/snake case to `KebabCase`):

```ejs
class <%= Name %> {
  work() {
    return "<%= h.capitalize(message) %>";
  }
}
```

```ejs
<%= h.inflection.pluralize(name) %>
<%= h.inflection.undasherize('my-module') %><!-- MyModule -->
```

`h.inflection` exposes:

```
pluralize(str, plural)
singularize(str, singular)
inflect(str, count, singular, plural)
camelize(str, low_first_letter)
underscore(str, all_upper_case)
humanize(str, low_first_letter)
capitalize(str)
dasherize(str)
titleize(str)
undasherize(str)          <- fork-specific
```

## Change-case helpers

`h.changeCase` is the [change-case](https://github.com/blakeembrey/change-case) library:

```js
// example: <%= h.changeCase.camel(name) %>
camel(str);
constant(str);
dot(str);
header(str);
isLower(str);
isUpper(str);
lower(str);
lcFirst(str);
no(str);
param(str);
pascal(str);
path(str);
sentence(str);
snake(str);
swap(str);
title(str);
upper(str);
```

A typical React component generator:

```yaml
---
to: components/<%= name %>/index.jsx
---
import React from 'react'

export const <%= name %> = ({ children }) => (
<div className="<%= h.changeCase.paramCase(name) %>">{children}</div>
)
```

With `name=HelloWorld` this compiles to a `<div className="hello-world">` element.

`h.path` is the Node [`path`](https://nodejs.org/api/path.html) module, so you can join and
resolve paths inside templates.

## Local variables

Any CLI argument, positional or prompt result automatically becomes a local variable. There
are two ways to refer to them:

```ejs
Hello <%= message %>
```

The bare form refers to `message`; a missing value throws a reference error.

```ejs
Hello <%= locals.message %>
```

The `locals` form lets you test for existence before use:

```ejs
<% if (locals.message) { -%>
  message: <%= message %>
<% } -%>
```

The `-%>` slurps the trailing newline so an `if` clause does not leave blank lines in the
output.

## Predefined variables

A command like `hygen component new:story` places these values into special variables:

| Variable       | Content                   | Example              |
| -------------- | ------------------------- | -------------------- |
| `templates`    | Templates path (absolute) | /project/\_templates |
| `actionfolder` | Action path               | /.../component/new   |
| `generator`    | Generator name            | `component`          |
| `action`       | Action name               | `new`                |
| `subaction`    | Sub-action name           | `story`              |
| `cwd`          | Process working directory | /project             |

```ejs
<%= actionfolder %>
```

## Addition (`add`)

By default templates are _added_ as a new target file. The `to:` property tells `hygen`
where to put it; nested directories are created automatically. `force: true` overwrites an
existing file without prompting (the default is to prompt for confirmation).

```yaml
---
to: app/index.js
force: true
---
console.log('this is index!')
```

To leave an existing file alone, use `unless_exists: true`:

```yaml
---
to: app/index.js
unless_exists: true
---
will not render if target exists
```

## From & shared templates

`from:` loads the body from another template instead of the body of the current file. The
body of the current template is ignored:

```yaml
---
to: app/readme.md
from: shared/docs/readme.md
---
THIS BODY IS IGNORED !!!
```

`from: shared/docs/readme.md` loads `_templates/shared/docs/readme.md` as the body of
`app/readme.md`.

## Injection

To inject a template _into_ an existing file, set `inject: true` plus exactly one anchor.
The body is inserted at the resolved position. The most common guard, `skip_if`, prevents
double injection:

```yaml
---
inject: true
to: package.json
after: dependencies
skip_if: react-native-fs
---
"react-native-fs":"*",
```

This adds the `react-native-fs` dependency to `package.json`, but only once (the `skip_if`)
guard sees the text already present and skips).

`after: dependencies` is a regular expression, so it matches the `"dependencies": {` block
in a `package.json`.

### Anchors (mutually exclusive)

Exactly one of these anchor options is used per template:

- `before` / `after` — a regular expression of text to locate. The inject line appears
  _before_ or _after_ the located line. These support multi-line matches: a single-line
  match is tried across each line first; if none is found, a multi-line match across the
  whole file is attempted.
- `prepend` / `append` — boolean; add the body to the start or end of the file, respectively.
- `at_line` — a numeric line index (0-based) at which the body is inserted. It is a line
  index, so it always matches.

```yaml
---
inject: true
to: config.js
before: '// config'
---
custom-feature = true;
```

### Anchor not found fails the run

If a `before`/`after` anchor does not match (neither a single line nor the whole text), the
injection throws `InjectionAnchorNotFoundError`, the run reports `success: false`, and the
target file is left **untouched**. Unlike upstream (which silently no-ops and can even
misplace the content), this fork surfaces the failure. `prepend`/`append`/`at_line` always
have a position, so they cannot "not match".

### Guarding against double injection

- `skip_if` — a regular expression / text. If it is present in the file, the injection is
  skipped.
- `skip_if_not: true` — the pure inversion of `skip_if`: the injection runs **only when** the
  `skip_if` text/regex **is** present (and is skipped when it is absent). Use it to inject a
  block into a file that already contains a marker.

### Creating a missing target

By default, injecting into a file that does not exist is an error
(`InjectionTargetNotFoundError`). Set `create_if_missing: true` to create the target (with
parent folders) and then inject the body into it:

```yaml
---
to: config/new.json
inject: true
create_if_missing: true
append: true
---
{ 'key': 'value' }
```

### Replacement by anchor

`replace: true` switches an inject-family operation from insert to replace: the first
fragment matched by the `before`/`after` anchor is replaced by the body and the rest of the
file is preserved. `$` in the body is treated literally.

`replace` is mutually exclusive with `inject` (using both throws `TemplateConfigError`), and
only `before`/`after` anchors support it (`prepend`/`append`/`at_line` with `replace` is
also a `TemplateConfigError`). An unmatched anchor raises `InjectionAnchorNotFoundError`.

```yaml
---
to: package.json
replace: true
after: '"version": ".*"'
---
"version": "2.0.0",
```

### Line-ending control (`eof_last`)

`eof_last` tunes the trailing newline of an injected body. When `true`, a body without a
trailing newline gets one; when `false`, a body with a trailing newline has it removed.

## Shell

A template with `sh:` runs a shell command after the other actions of the run. The command
is executed via the configured `exec` hook (`execa.shell` by default), with the template
body piped to the command's stdin when a body is present. The `cwd` variable is available:

```yaml
---
sh: 'mkdir -p <%= cwd %>/given/app/shell && cat > <%= cwd %>/given/app/shell/hello.piped'
---
hello, this was piped!
```

A shell action can be combined with an `add` or `inject` in the same template — for example,
add a dependency and then run the install:

```yaml
---
inject: true
to: package.json
after: dependencies
skip_if: lodash
sh: cd <%= cwd %> && npm install
---
"lodash":"*",
```

The body is not piped when it is absent. `sh_ignore_exit: true` ignores a non-zero exit;
`spinner: true` shows a spinner during the command.

## Conditional rendering

Render a template conditionally by giving `to:` a value that resolves to `null`:

```yaml
---
to: '<%= message ? `where/to/render/${name}.js` : null %>'
---
conditionally rendering template
```

When `hygen` sees a `to:` value of `null`, it skips the output of that template entirely.

Next up: [generators](./generators).

## All frontmatter properties

| Property                                             | Type         | Default   | Example                                |
| ---------------------------------------------------- | ------------ | --------- | -------------------------------------- |
| [`to:`](#addition-add)                               | String (url) | undefined | my-project/readme.md                   |
| [`from:`](#from--shared-templates)                   | String (url) | undefined | shared/docs/readme.md                  |
| [`force:`](#addition-add)                            | Boolean      | false     | true                                   |
| [`unless_exists:`](#addition-add)                    | Boolean      | false     | true                                   |
| [`inject:`](#injection)                              | Boolean      | false     | true                                   |
| [`before:`](#anchors-mutually-exclusive)             | Regex        | undefined | devDependencies                        |
| [`after:`](#anchors-mutually-exclusive)              | Regex        | undefined | devDependencies                        |
| [`prepend:`](#anchors-mutually-exclusive)            | Boolean      | undefined | true                                   |
| [`append:`](#anchors-mutually-exclusive)             | Boolean      | undefined | true                                   |
| [`at_line:`](#anchors-mutually-exclusive)            | Number       | undefined | 123                                    |
| [`eof_last:`](#line-ending-control-eof_last)         | Boolean      | undefined | true                                   |
| [`skip_if:`](#guarding-against-double-injection)     | Regex        | undefined | myPackage                              |
| [`skip_if_not:`](#guarding-against-double-injection) | Boolean      | undefined | true                                   |
| [`create_if_missing:`](#creating-a-missing-target)   | Boolean      | false     | true                                   |
| [`replace:`](#replacement-by-anchor)                 | Boolean      | false     | true                                   |
| [`sh:`](#shell)                                      | String       | undefined | echo: "Hello this is a shell command!" |

See [Errors and troubleshooting](./faq#errors-and-troubleshooting) for the error classes these options can raise.

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).
