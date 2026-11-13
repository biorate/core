# Proposal

## Why

The `@biorate/hygen` fork has its own rewritten documentation (12 markdown pages in `packages/@biorate/hygen/docs/`), including fork-specific features that upstream does not have (glob batch actions, content transforms, conditional `skip:`, interactive picker). There is no browsable documentation site: readers must open raw markdown files in the repository. Upstream hygen ships a documentation site (`hygen.io/` directory, a Docusaurus v2 app), and the fork can port that shell while keeping its own content — giving users a hosted, navigable docs experience with search, sidebar, and a landing page.

## What Changes

- Add a Docusaurus 3.x documentation site at `packages/@biorate/hygen/site/`, ported in structure from upstream `hygen.io/` (config, sidebar shape, landing ideas) but built fresh — upstream lockfiles and catalogs are NOT copied.
- Content is single-sourced: the site's docs preset points at `packages/@biorate/hygen/docs/` — no markdown copies inside `site/`.
- Document the IDEA plugin (`biorate/idea-hygen-plugin`) in a new docs page `ide-plugin.md` (Ecosystem group): what the plugin does (template file type, syntax highlighting, host-language and EJS-island JS injection, structural inspections, completion, template context), requirements (IDEA 2024.3+, CE vs Ultimate), installation from source, and settings — with links to the plugin repository.
- Add donation support to the site: links to Boosty and ЮMoney (plus other suitable platforms, to be surveyed) placed in the site footer and as a Support section on the landing page. Final links/targets are provided by the owner; the site exposes them as configurable footer/landing entries.
- Split fork features into their own pages. Four new docs pages are added (content moved out of existing pages): `glob-batch`, `content-transforms`, `conditional-skip`, `interactive-picker`. Three existing pages (`templates.md`, `extensibility.md`, `generators.md`) are edited: moved text is replaced by a short section + link to the new page.
- Sidebar (3 groups, like upstream):
  - Introduction: quick-start, prompts, generators, templates, glob-batch, content-transforms, conditional-skip, interactive-picker, extensibility, faq
  - Ecosystem: packages, create, standalone, ide-plugin
  - Use Cases: redux, react-native, express
- Expanded landing page (`site/src/pages/index.tsx`): hero, usage examples, fork-features section, differences from upstream, npm package link, attribution of original hygen (MIT, jondot/hygen v6.2.11).
- Attribution of the original hygen project is required on the site (landing/footer).
- `url`/`baseUrl` in `docusaurus.config.js` are set for the project GitHub Pages site: `url: 'https://biorate.github.io'`, `baseUrl: '/core/hygen/'` — the site is served at `https://biorate.github.io/core/hygen/` (also valid when self-hosting under the same path prefix).
- Documentation is published into the repository's generated root `docs/` directory: a `docs` script in `packages/@biorate/hygen/package.json` builds the site and copies `site/build/**` into root `docs/hygen/`; a root `docs` script (`npx lerna run docs`) regenerates it. The generated `docs/hygen/` is committed (model: local generation + commit, like the existing TypeDoc output).
- Deployment to GitHub Pages happens via a new `pages.yml` workflow that deploys the committed `docs/` folder (`actions/deploy-pages`, triggers: push to `master` touching `docs/**` and manual `workflow_dispatch`). Enabling Pages (Settings → Pages → Source: GitHub Actions) is a one-time manual owner step. Self-hosting remains possible by serving the same committed `docs/hygen/` directory.
- The package is NOT republished differently: `site/` must not be added to `files` in `packages/@biorate/hygen/package.json`; the site is not a workspace package and is not published to npm.

## Capabilities

### New Capabilities

- `hygen-docs-site`: A Docusaurus documentation site for the @biorate/hygen fork: serves the fork's markdown docs from a single source directory, organizes pages into Introduction/Ecosystem/Use Cases groups with dedicated fork-feature pages, provides an expanded landing page with upstream attribution, and builds to static output deployable by the owner (deployment itself out of scope).

### Modified Capabilities

<!-- None: the hygen-generator spec (28 requirements, generator behavior) is untouched. Docs page content changes are covered by the new hygen-docs-site capability. -->

## Impact

- **New code:** `packages/@biorate/hygen/site/` (Docusaurus 3.x app: `docusaurus.config.js`, `sidebar.js`, `src/pages/index.tsx`, `package.json`, static assets). Self-contained npm project inside the package directory, not a pnpm workspace package. Plus `.github/workflows/pages.yml` (deploys committed `docs/` to GitHub Pages).
- **Edited configs:** `packages/@biorate/hygen/package.json` (new `docs` script; `files` untouched), root `package.json` (new `docs` script), root `docs/` gains generated `docs/hygen/` (committed, alongside existing TypeDoc output).
- **Edited docs:** `packages/@biorate/hygen/docs/templates.md`, `extensibility.md`, `generators.md` (content moved to new pages + links); 5 new docs pages `glob-batch.md`, `content-transforms.md`, `conditional-skip.md`, `interactive-picker.md`, `ide-plugin.md`.
- **No impact:** `hygen-generator` runtime behavior, package `files`/npm publishing, existing `publish.yml` workflow, TypeDoc generation (`doc`/`postdoc`/`demo` scripts unchanged).
- **Dependencies:** Docusaurus 3.x dev dependencies only inside `site/` (not added to the monorepo root or the published package).
