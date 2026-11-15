# Tasks

## 1. Assets

- [x] 1.1 Crop the logo: `magick /home/llevkin/logo.png -trim +repage -resize 512x512 -gravity center -extent 512x512 packages/@biorate/hygen/site/static/img/logo.png` (create `site/static/img/`), and derive `favicon.png` (48×48) from the same crop; verify both files exist and are square.

## 2. Docusaurus site

- [x] 2.1 Wire branding in `packages/@biorate/hygen/site/docusaurus.config.js`: `themeConfig.navbar.logo = { src: 'img/logo.png', href: '/' }` and `themeConfig.favicon = 'img/favicon.png'`; verify with `pnpm --filter @biorate/hygen run docs` (build throws on broken links) and by opening `docs/hygen/index.html` (navbar logo visible, favicon referenced in `<head>`).

## 3. README and TypeDoc

- [x] 3.1 Add the logo header to the root `README.md` (absolute raw.githubusercontent reference to `packages/@biorate/hygen/site/static/img/logo.png` — the single committed copy of the cropped asset, since TypeDoc wipes `docs/` and does not copy README images; `<img width="120">` for size); verify on GitHub rendering and rebuild TypeDoc (`pnpm run doc`), open `docs/index.html`, confirm the logo renders on the landing page.

## 4. Regenerate and verify

- [x] 4.1 Regenerate committed outputs: `pnpm --filter @biorate/hygen run docs` and `pnpm run doc`; verify `git status` shows the updated `docs/hygen/` and `docs/` trees including the new image assets; `openspec validate add-docs-logo`.
