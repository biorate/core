# Proposal

## Why

The monorepo's two public documentation surfaces have no visual identity: the TypeDoc API reference (`docs/`, title "biorate") and the Docusaurus site for `@biorate/hygen` (`site/` → `docs/hygen/`, served on GitHub Pages) both show text-only headers. A logo asset exists (`/home/llevkin/logo.png`, 800×600, transparent background, padded). Adding it makes the docs recognizable and gives the hygen site a favicon.

## What Changes

- Trim the padded 800×600 logo to a square crop around the icon (target ~512×512) and derive a favicon from it.
- Docusaurus site: add `site/static/img/` with the cropped logo and favicon; configure `themeConfig.navbar.logo` and `favicon` in `docusaurus.config.js`.
- Root `README.md`: show the logo in the header. The same image renders on GitHub and on the TypeDoc landing page (TypeDoc renders the root README as the index page), so one edit covers both.
- Rebuild and commit the generated outputs: `docs/hygen/` (via `pnpm --filter @biorate/hygen run docs`) and the TypeDoc `docs/` tree (via `pnpm run doc`).
- No runtime code, package APIs, or specs behavior change.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none — documentation/site branding only; no existing requirement in `openspec/specs/` constrains logos or site chrome)

## Impact

- `packages/@biorate/hygen/site/static/img/logo.png`, `favicon.png` — new assets.
- `packages/@biorate/hygen/site/docusaurus.config.js` — navbar logo + favicon entries.
- `README.md` — header image markup.
- Generated: `docs/hygen/**` (rebuilt site), root `docs/**` (rebuilt TypeDoc).
- SemVer: no package code changes; docs-only, no release impact beyond assets.
