export type DonationPlatform = {
  name: string;
  url: string;
  description?: string;
};

/**
 * Donation platforms for @biorate/hygen.
 *
 * Boosty is the only donation channel for now, pointing at the owner's live
 * profile. Both the site footer (docusaurus.config.js) and the landing Support
 * section read from this one module, so updating a URL here and rebuilding is
 * all that is needed; no page component has to change. Further platforms can be
 * added later as additional entries in `donations`.
 */
export const donations: DonationPlatform[] = [
  {
    name: 'Boosty',
    url: 'https://boosty.to/llevkin',
    description: 'Support the project on Boosty',
  },
];

/**
 * Legal disclaimer shown next to every donation link: the site footer, the
 * landing Support section, and the repository root README all carry it.
 */
export const DONATION_DISCLAIMER =
  'Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license.';

export default donations;
