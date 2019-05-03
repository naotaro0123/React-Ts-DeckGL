module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier',
  ],
  plugins: [
    'prettier',
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    'browser': true,
    'node': true,
    'es6': true
  },
  parserOptions: {
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  // add your custom rules here
  rules: {
  }
}
