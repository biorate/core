module.exports = {
  fix: true,
  extends: [
    'cashoff_stylelint-config-rational-order',
    'stylelint-config-recommended',
    'stylelint-config-prettier',
  ],
  rules: {
    'no-empty-source': null,
    'selector-type-no-unknown': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['define-mixin', 'mixin', 'include'],
      },
    ],
    'media-feature-name-no-unknown': [
      true,
      { ignoreMediaFeatureNames: 'min--moz-device-pixel-ratio' },
    ],
  },

  ignoreFiles: ['public/*.*', 'build/*.*', 'dist/*.*'],
};
