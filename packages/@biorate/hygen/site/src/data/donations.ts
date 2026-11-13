export type DonationPlatform = {
  name: string;
  url: string;
  description?: string;
};

/**
 * Donation platforms for @biorate/hygen.
 *
 * THE OWNER FILLS IN REAL URLS — the values below are clearly-placeholder URLs.
 * Both the site footer (docusaurus.config.js) and the landing Support section
 * read from this one module, so updating a URL here and rebuilding is all that
 * is needed; no page component has to change. See site/README.md for the
 * "Donation platform candidates" note (Boosty and ЮMoney are the chosen pair;
 * Open Collective, GitHub Sponsors and Tinkoff payment links are candidates to
 * consider before the owner pins the final set).
 */
export const donations: DonationPlatform[] = [
  {
    name: 'Boosty',
    url: 'https://boosty.to/<placeholder>',
    description: 'Support the project on Boosty',
  },
  {
    name: 'ЮMoney',
    url: 'https://yoomoney.ru/to/<placeholder>',
    description: 'Send a donation via ЮMoney',
  },
];

export default donations;
