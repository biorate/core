# Spec Delta

## MODIFIED Requirements

### Requirement: Donation links on the site

The site SHALL expose donation links in two places: the site footer (visible on all pages) and a Support section on the landing page. The donation platform set is Boosty only, with the owner's profile URL (`https://boosty.to/llevkin`). Donation targets SHALL remain configurable site data (not hardcoded inline in page markup) so the owner can add platforms (e.g., ЮMoney later) or update links without touching page components. Wherever a donation link is shown on the site, it SHALL be accompanied by an English disclaimer stating that donations are voluntary, do not constitute consideration for any goods or services, grant no rights to the code or decision-making priority, and that the project is provided AS IS under its license.

#### Scenario: Donation links are visible

- **WHEN** a reader opens any site page
- **THEN** a Boosty donation link pointing to `https://boosty.to/llevkin` is visible in the footer, and a Support section with the same link is present on the landing page

#### Scenario: Disclaimer accompanies donation links

- **WHEN** a reader views a donation link on the site (footer or landing Support section)
- **THEN** an English disclaimer is shown nearby stating that donations are voluntary, are not consideration for goods or services, grant no rights to the code or decision-making priority, and that the project is provided AS IS under its license

#### Scenario: Links are configurable

- **WHEN** the owner updates or extends the donation platform list in the site configuration data
- **THEN** the next build reflects the change in both the footer and the landing Support section without editing page components
