# Spec Delta

## Purpose

Provides a browsable documentation site for the @biorate/hygen fork: a Docusaurus application that serves the fork's markdown documentation from a single source directory, with an extended sidebar covering fork-specific features, a landing page, and static build output for self-hosted deployment.

## ADDED Requirements

### Requirement: Documentation site serves fork docs from a single content source

The documentation site SHALL render its documentation pages directly from the markdown files in `packages/@biorate/hygen/docs/` via the site's docs configuration, without maintaining copies of those markdown files inside the site directory. Adding or editing a documentation page in the source directory SHALL be reflected in the built site without any content synchronization step beyond rebuilding.

#### Scenario: Content edit appears in the site

- **WHEN** a markdown file in `packages/@biorate/hygen/docs/` is edited and the site is rebuilt
- **THEN** the built site shows the edited content on the corresponding documentation page, and no file inside the site directory contains a duplicate of that content

#### Scenario: No duplicated content

- **WHEN** the site directory contents are inspected
- **THEN** no documentation markdown page from the source docs directory is duplicated there

### Requirement: Sidebar organizes pages into three groups with fork-feature pages

The site navigation SHALL organize documentation pages into three groups: Introduction (quick-start, prompts, generators, templates, glob-batch, content-transforms, conditional-skip, interactive-picker, extensibility, faq), Ecosystem (packages, create, standalone, ide-plugin), and Use Cases (redux, react-native, express).

#### Scenario: Full sidebar coverage

- **WHEN** the built site navigation is inspected
- **THEN** every page in the group lists above is present, correctly grouped, and links to its documentation page

#### Scenario: Fork features have dedicated pages

- **WHEN** a reader opens the site navigation
- **THEN** glob batch actions, content transforms, conditional `skip:`, and the interactive picker each have their own documentation page

### Requirement: Fork-feature pages are split out of existing pages

The four fork-feature pages (glob-batch, content-transforms, conditional-skip, interactive-picker) SHALL contain the detailed fork-feature documentation moved from the existing `templates`, `extensibility`, and `generators` pages. The source pages that previously held this content SHALL retain a short section describing the feature with a link to the dedicated page, and SHALL NOT retain a full duplicate of the moved text.

#### Scenario: Moved content is linked, not duplicated

- **WHEN** the templates, extensibility, or generators documentation page is inspected
- **THEN** each fork feature formerly described there appears as a short section with a link to its dedicated page, and the detailed text lives only on the dedicated page

### Requirement: Landing page presents the fork

The site landing page SHALL present the @biorate/hygen fork with: a hero section, usage examples, a section describing the fork-specific features, a section describing differences from upstream hygen, a link to the published npm package, and attribution of the original hygen project.

#### Scenario: Landing page content

- **WHEN** a reader opens the site root page
- **THEN** the page shows the hero, usage examples, fork-features section, upstream-differences section, npm package link, and attribution of the original hygen project

### Requirement: IDEA plugin documentation page

The site SHALL include a documentation page for the IntelliJ IDEA plugin (`biorate/idea-hygen-plugin`) that describes: what the plugin provides for hygen templates (`.t`) — file type recognition with configurable filename patterns, syntax highlighting of frontmatter and EJS tags, host-language injection, JavaScript injection into EJS islands, structural inspections, completion of frontmatter keys / `h` helpers / context variables; the requirements (IDEA 2024.3+, Community vs Ultimate capabilities); how to install it from source; and its settings page. The page SHALL link to the plugin repository.

#### Scenario: Plugin page content

- **WHEN** a reader opens the ide-plugin documentation page
- **THEN** the page describes the plugin features, requirements, installation from source, settings, and links to the `biorate/idea-hygen-plugin` repository

### Requirement: Donation links on the site

The site SHALL expose donation links ( Boosty and ЮMoney at minimum; the platform set MAY be extended after surveying options) in two places: the site footer (visible on all pages) and a Support section on the landing page. Donation targets SHALL be configurable site data (not hardcoded inline in page markup) so the owner can update links without touching page components.

#### Scenario: Donation links are visible

- **WHEN** a reader opens any site page
- **THEN** donation links (Boosty, ЮMoney) are visible in the footer, and a Support section with the same links is present on the landing page

#### Scenario: Links are configurable

- **WHEN** the owner updates a donation URL in the site configuration data
- **THEN** the next build reflects the new link in both the footer and the landing Support section without editing page components

### Requirement: Original hygen project is attributed on the site

The site SHALL include attribution of the original hygen project (jondot/hygen, MIT license), visible on the site (e.g., footer or landing page), in addition to any attribution already present in the documentation content.

#### Scenario: Attribution is visible

- **WHEN** a reader opens the site
- **THEN** attribution naming the original hygen project and its MIT license is visible without navigating into the documentation body

### Requirement: Static build output with self-hosting placeholders

The site SHALL build to a self-contained static output directory using the standard Docusaurus build, with the production `url` and `baseUrl` configurable in the site configuration. Default values MAY be placeholders; the site owner sets the final values for their hosting environment. Deployment of the build output (CI or manual) is out of scope for this capability.

#### Scenario: Clean build without deployment setup

- **WHEN** the site build is run from the site directory with dependencies installed
- **THEN** the build completes without errors and produces a static output directory deployable by any static file server

#### Scenario: Host configuration is adjustable

- **WHEN** the owner sets their production host URL and base path in the site configuration
- **THEN** the next build produces output with correct asset paths for that host, without any other code changes

### Requirement: Site does not affect package publishing

The site directory SHALL NOT be included in the published npm package: the package `files` allowlist SHALL NOT include the site directory, and the site SHALL NOT be a workspace package or a published package itself.

#### Scenario: npm package contents unchanged

- **WHEN** the `@biorate/hygen` package is packed for publication
- **THEN** the package tarball contains no part of the site directory and the package manifest is unchanged with respect to the site
