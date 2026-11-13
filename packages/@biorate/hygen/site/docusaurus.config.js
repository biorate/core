// @ts-check
// `@ts-ignore` — Node cannot load the TS module directly; Docusaurus resolves it
// through its own Babel pipeline when the site is built.
// @ts-ignore
const { donations } = require('./src/data/donations');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '@biorate/hygen',
  tagline: 'The scalable code generator that lives in your project.',
  // GitHub Pages (project site) serves this under https://biorate.github.io/core/hygen/;
  // the same paths work when self-hosting the docs under the same prefix.
  url: 'https://biorate.github.io',
  baseUrl: '/core/hygen/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  organizationName: 'biorate',
  projectName: 'hygen',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        // The docs content lives in the package's source `docs/` directory,
        // NOT inside the site — a single source of truth. Editing a page there
        // and rebuilding the site is the only content step needed.
        docs: {
          path: '../docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebar.js',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: '@biorate/hygen',
      items: [
        { type: 'doc', docId: 'quick-start', position: 'left', label: 'Docs' },
        {
          href: 'https://www.npmjs.com/package/@biorate/hygen',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/biorate/core',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      additionalLanguages: ['bash', 'yaml', 'typescript', 'javascript', 'shell-session'],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Quick start', to: '/docs/quick-start' },
            { label: 'Generators', to: '/docs/generators' },
            { label: 'Templates', to: '/docs/templates' },
            { label: 'FAQ', to: '/docs/faq' },
          ],
        },
        {
          title: 'Support',
          items: donations.map((donation) => ({
            label: donation.name,
            href: donation.url,
          })),
        },
      ],
      copyright: `@biorate/hygen — a fork of <a href="https://github.com/jondot/hygen">jondot/hygen</a> (v6.2.11, MIT). Original work © Dotan Nahum, fork adaptations © Leonid Levkin. Built with <a href="https://docusaurus.io/">Docusaurus</a>.`,
    },
  },
};

module.exports = config;
