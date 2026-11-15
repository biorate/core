# Spec Delta

## Purpose

Defines the visual branding of the repository's public documentation surfaces: the @biorate/hygen Docusaurus site (navbar logo and favicon) and the repository README header that also renders on the TypeDoc API reference landing page.

## ADDED Requirements

### Requirement: Documentation site shows a navbar logo and favicon

The @biorate/hygen documentation site SHALL display the project logo in the navigation bar (left of the site title) and SHALL serve a favicon generated from the same logo. The assets SHALL live in the site's static image directory (`site/static/img/`) and be referenced from the Docusaurus theme configuration. The logo asset SHALL be a square crop of the source logo trimmed to the icon content (no transparent padding margins).

#### Scenario: Navbar shows the logo

- **WHEN** any page of the built site is opened
- **THEN** the navigation bar displays the logo image to the left of the site title, and the image loads successfully (no broken image)

#### Scenario: Favicon is served

- **WHEN** any page of the built site is loaded
- **THEN** the browser tab shows the favicon referenced from the site's static image directory

### Requirement: Repository documentation header shows the logo

The root `README.md` SHALL display the logo above the repository title. The image reference SHALL resolve both on GitHub and in the TypeDoc-generated API reference landing page (which renders the root README), without build errors or broken-image markers.

#### Scenario: Logo visible on GitHub and the API reference landing page

- **WHEN** the root `README.md` is viewed on GitHub and when the TypeDoc landing page (`docs/index.html`) is rebuilt and opened
- **THEN** the logo renders in the header in both places, and the rebuild of `docs/` completes without image-resolution warnings
