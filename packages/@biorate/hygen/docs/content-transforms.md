> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](/).

# Content transforms

Besides helpers, the config file can declare a `transforms` namespace: named
post-processors that run over the rendered template content before it is written or
injected. Each transform is a function `(content, locals) => string | Promise<string>` —
`locals` carries the same locals the template was rendered with, and returning a promise
is supported, so async formatters work too.

```javascript
// .hygen.js
const prettier = require('prettier');

module.exports = {
  transforms: {
    prettier: (content, locals) => prettier.format(content, { parser: 'typescript' }),
  },
};
```

> **Note:** as with helpers, the library must be an installed dependency of the project
> where `hygen` runs.

Opt a template in with the `transform:` frontmatter attribute, naming the transform to
apply:

```yaml
---
to: src/gen/{{ name }}.ts
transform: prettier
---
export const <%= name %> = <%= value %>;
```

Several transforms can be chained left-to-right with `|` (whitespace around the names is
trimmed), each receiving the output of the previous one:

```yaml
transform: strip-comments | prettier
```

Transforms run for every file-creating action — `add`, `inject` and `mirror` targets
alike. Two failure/edge modes to be aware of:

- Referencing a name that is not declared under `transforms` fails the run with an
  `UnknownTransformError`.
- `transform:` on a template whose only action is `sh:` does nothing (there is no content
  to post-process) and produces a warning.

Templates without a `transform:` attribute are rendered exactly as before.

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](/) and the [LICENSE](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE).
