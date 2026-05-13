module.exports = {
  fix: true,
  extends: ['stylelint-config-recommended', 'stylelint-config-rational-order'],
  customSyntax: 'postcss-less',
  rules: {
    'no-empty-source': null,
    'selector-type-no-unknown': null,
    'no-descending-specificity': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['define-mixin', 'mixin', 'include', 'import', 'theme', 'apply'],
      },
    ],
    'media-feature-name-no-unknown': [
      true,
      { ignoreMediaFeatureNames: ['min--moz-device-pixel-ratio'] },
    ],
    'property-no-unknown': null,
    'unit-no-unknown': null,
    'declaration-property-value-no-unknown': null,
  },
  ignoreFiles: ['dist/**/*', 'node_modules/**/*'],
};
