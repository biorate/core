# Proposal

## Why

The documentation site ships donation support with placeholder URLs (`Boosty — https://boosty.to/<placeholder>`, `ЮMoney — https://yoomoney.ru/to/<placeholder>`). The owner has decided on a minimal tip-jar monetization (option A from the discussion): a single donation channel, Boosty, with a real profile URL (`https://boosty.to/llevkin`). ЮMoney is deferred — the entry is removed for now and can be added back later by editing the same data module.

The owner also needs the donate surfaces to be legally unambiguous: a donation must not read as buying rights to the code or priority in decisions, or as consideration for any goods or services. Every README and site surface that shows a donation link therefore carries an English disclaimer stating that donations are voluntary, are not consideration for goods or services, grant no rights to the code or decision-making priority, and that the project is provided AS IS under its license.

## What Changes

- `packages/@biorate/hygen/site/src/data/donations.ts`: keep only the Boosty entry with the real URL `https://boosty.to/llevkin`; remove the ЮMoney entry (and its placeholder).
- `packages/@biorate/hygen/site/README.md`: shorten the "Donation platform candidates" section — Boosty is the chosen platform with the live link; note that ЮMoney and others can be re-added in `donations.ts` later.
- Root `README.md`: add a Boosty donate badge (shields.io) right after the title, linking to `https://boosty.to/llevkin`, plus a short English disclaimer that donations are voluntary and not consideration for goods or services, grant no rights to the code or decision-making priority, and the project is provided AS IS under its license.
- Site donation surfaces: wherever a donation link is shown, accompany it with the same English disclaimer — the site footer (via `docusaurus.config.js`), the landing Support section (via `src/pages/index.tsx`), and `site/README.md`.
- `packages/@biorate/hygen/package.json`: fix `homepage` from `https://biorate.github.io/core` (TypeDoc root — wrong target) to `https://biorate.github.io/core/hygen` (the fork's documentation site on GitHub Pages).
- Regenerate the site output: run the `docs` build (`npm run docs`) so `docs/hygen/` (footer + landing Support section) shows the Boosty link only.
- No markup restructuring: the footer (`docusaurus.config.js`) and the landing Support section (`src/pages/index.tsx`) keep reading the platform list from `donations.ts`; only the shared disclaimer copy is added around the existing links.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `hygen-docs-site`: The "Donation links on the site" requirement changes — the platform set is Boosty only (the previous main-spec text required "Boosty and ЮMoney at minimum" and the build-time placeholder defaults; the site now ships a real Boosty link and ЮMoney is deferred).

## Impact

- **Edited files:** `packages/@biorate/hygen/site/src/data/donations.ts` (platform set + shared disclaimer string), `packages/@biorate/hygen/site/docusaurus.config.js` (footer disclaimer), `packages/@biorate/hygen/site/src/pages/index.tsx` (landing Support disclaimer), `packages/@biorate/hygen/site/README.md`, root `README.md` (donate badge + disclaimer), `packages/@biorate/hygen/package.json` (`homepage` fix), regenerated `docs/hygen/**` (committed static output).
- **No impact:** page layout and component structure (only disclaimer copy is added), navigation, package publishing, other site features.
