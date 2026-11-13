# @biorate/hygen documentation site

A [Docusaurus](https://docusaurus.io/) 3.x site that documents the
`@biorate/hygen` fork. The docs content is served **directly** from the package's
source `docs/` directory (`packages/@biorate/hygen/docs/`) — the site does not
keep its own copies, so editing a page there and rebuilding is the only content
step needed.

## Build locally

Dependencies are pinned inside `site/package.json`. Run from this directory:

```bash
pnpm install && pnpm build
```

- `pnpm install` — installs the Docusaurus 3.x toolchain for this site only. The
  site is `private: true` and lives under `packages/*/*`, so `pnpm` may treat it
  as a workspace package; that is harmless. If `pnpm install` is confused by the
  monorepo, use `pnpm install --ignore-workspace` (or `npm install`).
- `pnpm build` — emits the static site into `build/`. The build treats broken
  links as errors (`onBrokenLinks: 'throw'`), so it fails rather than silently
  shipping dead links.

For local development:

```bash
pnpm start && open http://localhost:3000
pnpm clear     # clean the .docusaurus cache
pnpm serve     # serve the built build/ locally
```

## Deploy

Deployment is **manual**: the generated documentation is committed into the
repository root `docs/` directory (see the `docs` script in
`packages/@biorate/hygen/package.json`), and the `pages.yml` GitHub Actions
workflow deploys that committed `docs/` folder to GitHub Pages. For the owner's
own host, serve the same committed `docs/hygen/` directory with nginx.

### `url` and `baseUrl`

Configured for the project GitHub Pages site:

- `url: 'https://biorate.github.io'`
- `baseUrl: '/core/hygen/'` — the site is served at `https://biorate.github.io/core/hygen/`;
  the same paths work when self-hosting the docs under the same prefix.

Change both values in `docusaurus.config.js` only if the hosting model changes,
and rebuild afterwards so asset paths are correct.

## Donation platform candidates

The site shows donation links in the footer (via `docusaurus.config.js`) and in
the landing **Support** section (via `src/pages/index.tsx`). Both read from one
module — `src/data/donations.ts` — so updating a URL there and rebuilding is the
only step required; no page component has to change.

**Chosen platforms** (placeholder URLs are in place):

- Boosty — https://boosty.to
- ЮMoney — https://yoomoney.ru

**Candidates to consider** before the owner pins the final set (also reachable
from `src/data/donations.ts` — add or replace entries there):

- Open Collective — https://opencollective.com
- GitHub Sponsors — https://github.com/sponsors
- Tinkoff (T-Bank) payment links

The owner should replace the `<placeholder>` URL fragments in `src/data/donations.ts`
with the real ones at deploy time.

## Attribution

`@biorate/hygen` is a fork of [jondot/hygen](https://github.com/jondot/hygen)
(v6.2.11, MIT). The footer and the landing page attribute the original project.
