// @ts-check

/**
 * Static sidebar: explicit page lists per group, exact ordering guaranteed.
 * Item ids are documentation page file names (no frontmatter -> id = filename).
 */
module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'quick-start',
        'prompts',
        'generators',
        'templates',
        'glob-batch',
        'content-transforms',
        'conditional-skip',
        'interactive-picker',
        'extensibility',
        'faq',
      ],
    },
    {
      type: 'category',
      label: 'Ecosystem',
      collapsed: false,
      items: ['packages', 'create', 'standalone', 'ide-plugin'],
    },
    {
      type: 'category',
      label: 'Use Cases',
      collapsed: false,
      items: ['redux', 'react-native', 'express'],
    },
  ],
};
