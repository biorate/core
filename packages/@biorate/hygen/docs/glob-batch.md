> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](/).

# Glob batch actions

A single template can scaffold a whole directory tree. Declare `glob:` instead of writing one
template per output file; the pattern is resolved **relative to the template's own directory**,
and every match becomes its own rendered file:

```yaml
---
# _templates/module/new/spec.ejs.t
glob: module/**/*
to: src/<%= name %>/
base: module
stripExtensions: ['.t']
---
```

With `_templates/module/new/module/service.ts.t` and `_templates/module/new/module/index.ts.t`,
`hygen module new billing` writes `src/billing/service.ts` and `src/billing/index.ts`.

| Property               | Type            | Default   | Meaning                                                                           |
| ---------------------- | --------------- | --------- | --------------------------------------------------------------------------------- |
| `glob:`                | String          | undefined | Pattern selecting template files, relative to the template's own directory        |
| `to:` / `destination:` | String          | undefined | Destination **folder**, joined with each match's relative path (EJS-rendered)     |
| `base:`                | String          | undefined | Prefix stripped from each match's relative path before it becomes the target path |
| `stripExtensions:`     | String \| Array | undefined | Extension suffix(es) removed from each match's file name                          |
| `skipIfExists:`        | Boolean         | false     | Skip a matched file whose target already exists (soft, non-failing)               |

Notes:

- **The glob template itself writes nothing** — it is a specification, not an output file.
- **EJS renders in both places** — the file name (`README-<%= name %>.t`) and the file content.
- **`glob` and `mirror: true` are mutually exclusive** — combining them fails the run with
  `GlobMirrorConflictError`, because mirroring derives the path from the template's own name.
- **Comma name lists multiply** — `hygen module new a,b` expands the glob once per name.
- **Skipped files are not failures** — under `--keep-going`, `skipIfExists` skips never appear in
  the failure list and later actions still run.

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](/) and the [LICENSE](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE).
