# Tasks

## 1. Site scaffold

- [x] 1.1 Create `packages/@biorate/hygen/site/` with a fresh Docusaurus 3.x project: `package.json` (private, name `hygen-docs-site`, Docusaurus classic preset deps), `docusaurus.config.js` with `onBrokenLinks: 'throw'`, placeholder `url`/`baseUrl` (commented for deploy-time edit), title/tagline for @biorate/hygen, footer with attribution of jondot/hygen (MIT), and `.gitignore` for `build/` and `node_modules/`.
- [x] 1.2 Configure the docs preset: `docs: { path: '../docs', routeBasePath: 'docs', sidebarPath: './sidebar.js' }`; add `sidebar.js` with the three groups (Introduction: quick-start, prompts, generators, templates, glob-batch, content-transforms, conditional-skip, interactive-picker, extensibility, faq; Ecosystem: packages, create, standalone; Use Cases: redux, react-native, express).
- [x] 1.3 Add `site/README.md` documenting local build steps (`pnpm install && pnpm build` inside `site/`), that deploy is manual/out of scope, and how to set `url`/`baseUrl`.
- [x] 1.4 Verify `packages/@biorate/hygen/package.json` is unchanged regarding `files` (no `site` entry) and the site is `"private": true`.
- [x] 1.5 Add donation links as configurable site data (Boosty + ЮMoney; survey other suitable platforms and list candidates in `site/README.md` for the owner to pick): wire them into the Docusaurus footer. Real URLs come from the owner; use placeholders until provided.

## 2. Fork-feature pages (content split)

- [x] 2.1 Create `docs/glob-batch.md`: move detailed glob batch actions content (glob/base/stripExtensions/destination/skipIfExists semantics, examples) from `templates.md`/`generators.md`; leave a short summary + link at the source location(s).
- [x] 2.2 Create `docs/content-transforms.md`: move detailed transforms content (`transform:` hooks, chains, named transforms config) from `templates.md`/`extensibility.md`; leave a short summary + link at the source location(s).
- [x] 2.3 Create `docs/conditional-skip.md`: move detailed conditional `skip:` content (three-state statuses, skip vs skipIfExists) from its current page; leave a short summary + link.
- [x] 2.4 Create `docs/interactive-picker.md`: move detailed picker content (zero-positional behavior, TTY fallback, interactive option) from `generators.md`/`quick-start.md`; leave a short summary + link.
- [x] 2.5 Create `docs/ide-plugin.md` (Ecosystem): document the IDEA plugin from https://github.com/biorate/idea-hygen-plugin — features (file type with configurable patterns, frontmatter/EJS highlighting, host-language + EJS-island JS injection as a single JS document, structural inspections incl. the full fork key set with `mirror`, completion, template context), requirements (IDEA 2024.3+; Community vs Ultimate), installation from source (`./gradlew buildPlugin` → Install Plugin from Disk; current version 0.5.0), settings (Tools → Hygen Templates), link to the plugin repo. Re-check the plugin README at implementation time and mirror its then-current version/key set.
- [x] 2.6 Walk all 12+5 docs pages for cross-page links and anchors; fix relative links to the new page structure (build will throw on broken links).

## 3. Landing page

- [x] 3.1 Create `site/src/pages/index.tsx` + styles: hero, usage examples adapted to fork semantics (incl. glob batch, transforms, skip, picker), fork-features section, differences-from-upstream section mirroring `packages/@biorate/hygen/README.md`, npm link to `@biorate/hygen`.
- [x] 3.2 Ensure attribution of original hygen (jondot/hygen, MIT) is visible on the site (landing section and/or footer — footer already from 1.1; confirm landing cross-links it).
- [x] 3.3 Add an ecosystem/tools mention of the IDEA plugin on the landing (fork-features or tools section) linking to the ide-plugin docs page.
- [x] 3.4 Add a Support section on the landing page with donation links (Boosty, ЮMoney + выбранные платформы), reusing the configurable site data from 1.5.

## 4. Build verification

- [x] 4.1 Install deps inside `site/` and run the build; fix all broken-link/build errors until the build is clean and produces `site/build/`.
- [x] 4.2 Smoke-check the built output: sidebar groups render all 17 pages, landing shows all required sections (incl. Support/donations), footer donation links present, attribution visible.
- [x] 4.3 Verify the published-package surface is untouched: pack `@biorate/hygen` (or inspect `files`) and confirm no `site/` content in the tarball; run package-level `pnpm --filter @biorate/hygen run build` and tests to confirm no regressions.
- [x] 4.4 Run prettier on all edited markdown files and confirm repo lint/prettier checks pass.
