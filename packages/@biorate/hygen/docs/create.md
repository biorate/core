> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream hygen-create guide](https://github.com/jondot/hygen/blob/master/docs/create.md)

# Creating generators from existing code

Hand-authoring generators is straightforward: copy an existing file into an action folder
and replace the variable bits with EJS placeholders (see [generators](./generators) and
[templates](./templates)).

The upstream ecosystem offers `hygen-create`, a tool that takes an existing piece of code and
automatically transforms it into a generator — a quicker path when you have a lot of
existing boilerplate to generalize. `hygen-create` is an **upstream/community tool and is not
bundled with this fork**; below is how it works upstream so you can adopt it outside the fork
if you find it useful.

## How it works upstream

To create a generator using `hygen-create`:

- Start a `hygen-create` session.
- Select files to include in the generator.
- Specify a string to turn into EJS snippets in the resulting templates.
- Run `hygen-create generate`.

Your new `hygen` generator is ready, and you can use it to create new "instances" of the
code you generalized. If something is not right, fix the problem directly in the generated
code, then run `hygen-create` on it again to update the generator with your fix. It remembers
which files were originally included, so you do not have to select them again.

## Key features

- String variations (UPPERCASED, CamelCased, etc.) are recognized automatically. For example,
  generating from a `package.json` with `MyPackage` as the templatization string:

  ```json
  { "name": "MyPackage", "index": "my-package/bin/my_package.js" }
  ```

  becomes a generator that, with the name `NewUnit` passed positionally, creates:

  ```json
  { "name": "NewUnit", "index": "new-unit/bin/new_unit.js" }
  ```

- Directory hierarchy is maintained.
- Gradually add files to the generator in a git-like fashion.
- Review auto-inserted EJS placeholders with a built-in colorized diff.

## Authoring generators by hand

Everything `hygen-create` automates can be done by hand, which is the fork's primary path:

```bash
mkdir -p _templates/unit/new
cp my-unit.js _templates/unit/new/unit.ejs.t
```

Then edit `unit.ejs.t` to replace the variable parts with EJS placeholders:

```ejs
---
to: app/units/<%= name %>.js
---
export default class <%= h.changeCase.pascal(name) %> {
  // ...
}
```

Run it:

```bash
hygen unit new identity
```

## Attribution

This page is the fork's adaptation of the upstream [create](https://github.com/jondot/hygen/blob/master/docs/create.md)
guide; `hygen-create` is an upstream/community tool and is **not** shipped with this fork.
`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT);
original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).
