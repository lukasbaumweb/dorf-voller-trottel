module.exports = {
  extends: ['semistandard'],
  rules: {
    'space-before-function-paren': [
      'ignore',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'never'
      }
    ],
    'no-new': ['warn']
  }
};
