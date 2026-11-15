# docs-branding Specification

## Purpose

Defines the visual branding of the repository's public documentation surfaces: the @biorate/hygen Docusaurus site (navbar logo and favicon) and the @biorate/hygen package README header that also renders on the npm package page.

## Requirements

### Requirement: Documentation site shows a navbar logo and favicon

The @biorate/hygen documentation site SHALL display the project logo in the navigation bar (left of the site title) and SHALL serve a favicon generated from the same logo. The assets SHALL live in the site's static image directory (`site/static/img/`) and be referenced from the Docusaurus theme configuration. The logo asset SHALL be a square crop of the source logo trimmed to the icon content (no transparent padding margins).

#### Scenario: Navbar shows the logo

- **WHEN** any page of the built site is opened
- **THEN** the navigation bar displays the logo image to the left of the site title, and the image loads successfully (no broken image)

#### Scenario: Favicon is served

- **WHEN** any page of the built site is loaded
- **THEN** the browser tab shows the favicon referenced from the site's static image directory

### Requirement: Package README header shows the logo

The `@biorate/hygen` package README (`packages/@biorate/hygen/README.md`) SHALL display the logo beside the package title. The image reference SHALL resolve both on GitHub and on the npm package page, without build errors or broken-image markers.

#### Scenario: Logo visible on GitHub and the npm package page

- **WHEN** the `@biorate/hygen` README is viewed on GitHub and on npmjs.com
- **THEN** the logo renders beside the title in both places, and the root README stays free of package branding

### Requirement: Package READMEs carry the donations notice

Every published package README under `packages/@biorate/*/README.md` SHALL end with the donations notice: the Boosty donate badge followed by the disclaimer that donations are voluntary and do not constitute consideration for any goods or services, grant no rights to the code or priority in decision-making, and that the project is provided AS IS under its license. New package READMEs SHALL include the same block from the start.

#### Scenario: Every package README ends with the notice

- **WHEN** all `packages/@biorate/*/README.md` files are inspected
- **THEN** each one ends with the Boosty badge and the donations disclaimer

#### Scenario: A newly created package includes the notice

- **WHEN** a new package is added under `packages/@biorate/` with a README
- **THEN** its README ends with the same donations notice as the existing packages
