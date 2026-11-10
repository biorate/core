module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // commitlint's default 100 is too tight for lerna-generated version bumps
    'header-max-length': [2, 'always', 120],
    'body-max-line-length': [1, 'always', 200],
    'footer-max-line-length': [1, 'always', 200],
  },
};
