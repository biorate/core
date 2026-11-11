> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream packages guide](https://github.com/jondot/hygen/blob/master/docs/packages.md)

# Packages

Sharing generators across projects and across teams can be done simply by copying your
`_templates` folder wherever you need it. Because `hygen` templates are checked in and
collaborate like code, this is the most robust form of sharing — the templates live next to
the code that consumes them and evolve in the same branch.

The upstream ecosystem also offers a _package_ mechanism: a compiled set of generators
published as a node module that you install and share. The `hygen-add` tool (part of the
upstream `hygen` toolbelt, **not** bundled in this fork) reads a package and copies its
generators into your local `_templates` directory.

## Sharing in the monorepo

For `@biorate/*` and the monorepo, the idiomatic approach is to keep generators in a
project-local `_templates` folder and either:

- **Copy the folder** — pull a team's `_templates` into your project and commit it; you can
  tweak the generator to your team's preference.
- **Point `HYGEN_TMPLS` at a shared folder** — [templates location](./generators#templates-location)
  lets a script reference a shared template root without copying.

## Installing an upstream package

`hygen-add` installs a published `hygen-<name>` module. Install the tool first:

```bash
npm install -g hygen-add
```

Then, for a module called `hygen-acme-generators`, run it without the `hygen-` prefix:

```bash
hygen-add acme-generators
```

This installs the `acme-generators` package, pins it, and copies its generators into your
current project's `_templates` directory. Copying is deliberate: it is more resilient than
referencing something that can change unexpectedly.

## Installing from GitHub

`hygen-add` can install directly from a GitHub URL, inferring the package name from the
repository URL:

```bash
hygen-add https://github.com/acme/acme-generators
```

If the URL does not reveal the name, specify it manually (the package `name` in its
`package.json`):

```bash
hygen-add https://github.com/acme/archive --name acme-generators
```

## Name clashes

Prefix packages to avoid clashes:

```bash
hygen-add acme-react
hygen-add awesome-react --prefix awsm
```

## Attribution

This page is the fork's adaptation of the upstream [packages](https://github.com/jondot/hygen/blob/master/docs/packages.md)
guide; `hygen-add` and `hygen-create` are upstream ecosystem tools and are **not** shipped
with this fork. `@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen)
(v6.2.11, MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).
