# Design

## Context

Donation support already exists end-to-end: `site/src/data/donations.ts` (typed data module) is read by both the Docusaurus footer (`docusaurus.config.js`) and the landing Support section (`src/pages/index.tsx`). The main spec currently requires "Boosty and ЮMoney at minimum" with build-time placeholder URLs; this change replaces the placeholder set with a single real link.

Donation surfaces touched here: the footer Support column, the landing Support section, `site/README.md`, and the repository root `README.md`. The README and `package.json` edits are documentation/metadata only — they change no runtime behavior.

## Goals / Non-Goals

**Goals:**

- Ship the real Boosty link (`https://boosty.to/llevkin`) in footer + Support section.
- Show the same English disclaimer wherever a donation link is visible (footer, landing, both READMEs).
- Keep the data module as the single point of change for future platforms.

**Non-Goals:**

- Subscriptions/tiers, "supporters wall", services placement.
- Adding ЮMoney or other platforms now (deferred by the owner).
- Legal review of the disclaimer wording (owner-approved copy).

## Decisions

### D1: Remove the ЮMoney entry rather than keeping it disabled

A placeholder URL visible to users is worse than absence (dead/broken link). The `DonationPlatform` type and data-module pattern stay, so re-adding ЮMoney later is a one-entry edit. Alternative (keep ЮMoney with placeholder) rejected: spec and UX require working links.

### D2: Update README's candidates section instead of deleting it

Keep a one-line note that the platform set lives in `donations.ts` and others can be added later. Alternative (full removal) rejected: the pointer is useful for the owner and future contributors.

### D3: One disclaimer constant in the data module

`donations.ts` exports `DONATION_DISCLAIMER` next to the platform list; `docusaurus.config.js` and `src/pages/index.tsx` both import it. Rationale: the requirement is that every site surface shows the same statement, and a duplicated literal drifts on the next edit. Alternative (separate `disclaimer.ts` module) rejected: the donation data module is already the single point both surfaces import.

Canonical sentence: "Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license."

### D4: Footer disclaimer goes into the `copyright` string

Docusaurus footer columns render link items (label plus `to`/`href`), so a non-link sentence does not fit the Support column without custom markup. The disclaimer is appended to the footer `copyright` HTML string, which renders on every page in the same footer as the donation links. The landing page extends the existing note paragraph under the support cards. Alternative (custom footer component) rejected: disproportionate for one sentence.

### D5: Root README carries a literal copy of the same sentence

A markdown README cannot import the site's TS module, so the badge and disclaimer are written literally after `# Biorate core`. The wording must match `DONATION_DISCLAIMER` exactly; a verification task greps both files. Alternative (generated include) rejected: the repository has no markdown include mechanism.

### D6: Fix `homepage` to the fork docs site

`homepage` currently points at the TypeDoc root (`https://biorate.github.io/core`), which is the API reference index, not this package's documentation. Point it at `https://biorate.github.io/core/hygen` — the GitHub Pages build of `site/`. Alternative (leave as is) rejected: npm metadata would keep sending readers to the wrong page.

## Risks / Trade-offs

- [Wording drift between README and the site constant] → identical canonical sentence in the tasks plus a grep check in the build verification.
- [Footer copyright grows long on narrow screens] → keep the sentence to one line; the footer wraps by default.
- [Placeholder fragments survive in generated output] → grep `docs/hygen/` and `site/src` for `<placeholder>` and `ЮMoney` after the rebuild.
- [Boosty link correctness] → verify the URL resolves to the owner's profile at implementation time (HTTP 200 on https://boosty.to/llevkin).

## Migration Plan

Edit data module + README + site config/components → rebuild (`npm run docs`) → commit regenerated `docs/hygen/`; Pages picks it up on the next master deploy. Rollback = revert the commit.

## Open Questions

None.
