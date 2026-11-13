# Tasks

## 1. Donation data

- [x] 1.1 Update `packages/@biorate/hygen/site/src/data/donations.ts`: keep only the Boosty entry with the real URL `https://boosty.to/llevkin`, remove the ЮMoney entry, adjust the header comment to the single-platform set, and export `DONATION_DISCLAIMER` with the canonical sentence. Verify: the file contains exactly one platform, no `<placeholder>` fragment, and the exported constant (`grep`).

## 2. Documentation and metadata

- [x] 2.1 Update `packages/@biorate/hygen/site/README.md`: replace the "Donation platform candidates" section with a short note — Boosty is the chosen platform with the live link, further platforms can be added in `src/data/donations.ts` (ЮMoney deferred) — and include the canonical disclaimer sentence. Verify: no `<placeholder>` or ЮMoney remains in the file and the disclaimer sentence matches `DONATION_DISCLAIMER`.
- [x] 2.2 Add the Boosty donate badge right after `# Biorate core` in the root `README.md`: `[![Donate on Boosty](https://img.shields.io/badge/Boosty-donate-orange)](https://boosty.to/llevkin)`, followed by the canonical disclaimer line: "Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license." Verify: the badge links to `https://boosty.to/llevkin` and the disclaimer text is byte-identical to `DONATION_DISCLAIMER` (`grep`/`diff`).
- [x] 2.3 Render the disclaimer next to the site donation links: import `DONATION_DISCLAIMER` in `packages/@biorate/hygen/site/docusaurus.config.js` and append it to the footer `copyright`, and append it to the Support section note in `packages/@biorate/hygen/site/src/pages/index.tsx`. Verify: neither file repeats the sentence literally (`grep` finds no literal copy, only the import/usage) and task 3.2 shows it in the build.
- [x] 2.4 Fix `homepage` in `packages/@biorate/hygen/package.json`: `https://biorate.github.io/core` → `https://biorate.github.io/core/hygen`. Verify: `node -p "require('./packages/@biorate/hygen/package.json').homepage"` prints the new value.

## 3. Rebuild and verify

- [x] 3.1 Verify `https://boosty.to/llevkin` resolves (HTTP 200) before shipping.
- [x] 3.2 Run `npm run docs` from the repository root; verify `docs/hygen/`: the footer and the landing Support section show the Boosty link and the disclaimer, and no `<placeholder>` fragment or ЮMoney entry remains anywhere in `docs/hygen/` or `site/src` (`grep`).
- [x] 3.3 Run prettier on the edited files and verify `npx prettier --check` passes for them.

## Workflow follow-up

- The author commits and pushes (the assistant does not run `git add` / `commit` / `push`).
- Archive the change after the project's review requirements are satisfied.
