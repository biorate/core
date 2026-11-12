> Part of **@biorate/hygen** — a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11, MIT), adapted to the `@biorate/*` monorepo. Rewritten for this fork's semantics; see [Differences from upstream](../README.md#differences-from-upstream).
>
> Based on: [Upstream standalone guide](https://github.com/jondot/hygen/blob/master/docs/standalone.md)

# Standalone distribution

The upstream `hygen` project ships standalone binaries (Homebrew taps, GitHub release
binaries) for environments without Node.js. **This fork does not build standalone
binaries** — see [Differences from upstream](../README.md#differences-from-upstream). It is
distributed as an npm package, so Node.js is the runtime.

## Running the CLI

Install globally for a project-wide `hygen` binary:

```bash
npm i -g @biorate/hygen
```

Or run without installing, using `npx`:

```bash
npx @biorate/hygen ...
```

For a shared toolchain, add it as a dev dependency in your project and invoke it via your
package manager's script runner:

```bash
pnpm add -D @biorate/hygen
pnpm hygen generator new mailer
```

## Embedding in your own tooling

If you are packaging `hygen` into your own software, a Docker image, or re-distributing it,
the recommended route is the embeddable `runner()` API rather than a standalone binary. See
[extensibility](./extensibility) for a `runner()` example, or consume it as an ordinary
npm dependency in your own CLI:

```bash
pnpm add @biorate/hygen
```

## Upstream binary releases

The upstream project publishes pre-built binaries on the GitHub releases page for each major
platform. Those binaries are not produced by this fork; if you need a binary-only
distribution, build against the upstream `jondot/hygen` package instead. This page is kept
as a fork of the upstream [standalone](https://github.com/jondot/hygen/blob/master/docs/standalone.md)
guide for provenance and for users who migrate from upstream.

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen) (v6.2.11,
MIT); original work © Dotan Nahum, fork adaptations © Leonid Levkin. See
[Differences from upstream](../README.md#differences-from-upstream) and the [LICENSE](../LICENSE).
