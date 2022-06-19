module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'no-redeclare': 0,
    'import/no-dynamic-require': 0,
    'global-require': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'class-methods-use-this': 0,
    'import/prefer-default-export': 0,
    'no-nested-ternary': 0,
    'nonblock-statement-body-position': 0,
  },
};
