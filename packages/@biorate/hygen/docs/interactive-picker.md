> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](/).

# Interactive picker

Run `hygen` with no positional arguments in a terminal and it offers a two-level picker
instead of an error:

1. choose a **generator** — every top-level directory of `_templates` that contains at least
   one action is listed;
2. choose an **action** — every action directory of the chosen generator is listed.

The run then proceeds exactly as if you had typed `hygen <generator> <action>`; all flags
(`--keep-going`, data options, …) keep working:

```bash
$ hygen
? Which generator? › mailer
? Which action? › new
Loaded templates: _templates/mailer/new
...
```

In a non-interactive environment (CI, piped stdio) the picker never launches: the run fails
fast with the usual missing-arguments error plus a hint that the picker requires a terminal —
scripts depending on that exit code keep working. Embedders can control this explicitly with
the `interactive` option in `RunnerConfig` (`true` forces the picker, `false` disables it,
absent auto-detects the TTY).

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](/) and the [LICENSE](https://github.com/biorate/core/blob/master/packages/%40biorate/hygen/LICENSE).
