# Design

## Context

Both documentation surfaces are generated and committed: TypeDoc (`pnpm run doc` → `docs/`) and the hygen Docusaurus site (`pnpm --filter @biorate/hygen run docs` → `site/build` → `docs/hygen/`). Neither has a logo today. The source asset `/home/llevkin/logo.png` is 800×600 with large transparent margins around the icon; using it directly in a ~36 px navbar would render the icon tiny inside empty space.

## Goals / Non-Goals

**Goals:**

- Logo in the Docusaurus navbar, a favicon, and a logo header in the root README (covers GitHub + TypeDoc landing page).
- Assets committed once, in the right homes; generated site output rebuilt in the same change.

**Non-Goals:**

- No dark-theme-specific logo variant (the asset works on light and dark backgrounds — transparent background, mid-tone fill; revisit if it proves illegible).
- No changes to `hygen-docs-site` requirements, sidebar, or content pages.
- No logo in individual package READMEs.

## Decisions

- **Trim + square crop via ImageMagick.** `magick logo.png -trim +repage -resize 512x512 -gravity center -extent 512x512` produces a square icon-centered asset; favicon derived from the same crop (32/48 px PNG). Source stays outside the repo (user-provided file); only the cropped derivatives are committed — the original padded version has no use in-tree.
- **Asset locations.** `packages/@biorate/hygen/site/static/img/logo.png` + `favicon.png` (Docusaurus serves `static/` at the site root and copies it into the build) hold the only committed copy of the cropped asset; the README references the same file through the absolute raw.githubusercontent URL.
- **Docusaurus wiring.** `themeConfig: { navbar: { logo: { src: 'img/logo.png', href: '/' }, ... }, favicon: 'img/favicon.png' }` in `docusaurus.config.js`.
- **README wiring.** Markdown image directly under the `# Biorate core` heading. A repo-relative reference does not survive TypeDoc rebuilds (TypeDoc wipes `docs/` and does not copy README-referenced images), so use the absolute raw.githubusercontent URL pointing at `assets/logo.png` (repo-root `assets/` is not touched by any rebuild) — it renders on GitHub and in the TypeDoc landing page; keep width reasonable via HTML `<img width="120">`.
- **Rebuild both outputs in the change.** The generated trees are committed in this repo by convention (established by the previous feat commit), so the tasks include `pnpm --filter @biorate/hygen run docs` and `pnpm run doc`.

## Risks / Trade-offs

- TypeDoc README asset handling: if TypeDoc does not copy the referenced image, the landing page shows a broken image — verify after rebuild and fall back to a `site`-independent absolute path (raw.githubusercontent URL) only if needed.
- Docusaurus `onBrokenLinks: 'throw'` will fail the build if `static/img/` paths are mistyped — the build itself is the verification.
- 512×512 PNG is well within reason for a navbar asset; no SVG conversion (source is raster).
