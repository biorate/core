> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](/).

# Conditional action skipping

A template can decide at render time whether it should run at all. Declare `skip:` in the
frontmatter; it is rendered with the same locals as the rest of the template, and a truthy
result skips the action — **no operation executes** (nothing is written, injected or run in a
shell), and the run records the action as `skipped`:

```yaml
---
to: test/<%= name %>.spec.js
skip: <% if (wantTests) { %>false<% } else { %>no tests requested<% } %>
---
```

Run with `--wantTests` and the file is created; without it the action is skipped and the log
reads `skipped: no tests requested`.

Because templates render to strings, the boolean spellings are recognised case-insensitively
and trimmed:

| Rendered `skip:` value           | Result                                       |
| -------------------------------- | -------------------------------------------- |
| empty string, `false`, `'false'` | the action runs normally                     |
| `true`, `'true'`                 | skipped, no reason logged                    |
| any other non-empty string       | skipped, that string is logged as the reason |

Notes:

- **Works on every action kind** — file `add`, `glob` batches (the whole batch is skipped),
  `inject`, `echo`, `sh` and `setup`. A skipped `sh:` action never spawns a shell.
- **Transforms do not run** for a skipped action (the body is never produced), so a
  `transform:` naming an unregistered transform cannot fail a skipped action.
- **Skipped is not a failure** — skipped actions never appear in `failures`, never abort a
  fail-fast run, and never block later actions under `--keep-going`.
- **Distinct from `skipIfExists:`** — `skipIfExists` reacts to an existing target on disk;
  `skip:` is decided purely by the rendered template, regardless of the filesystem.

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](/) and the [LICENSE](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE).
