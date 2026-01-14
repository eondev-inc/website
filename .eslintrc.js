module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended',
    'plugin:vuejs-accessibility/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-reserved-component-names': 'off',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    // Accessibility rules - convertir a warnings en lugar de errores
    'vuejs-accessibility/anchor-has-content': 'warn',
    'vuejs-accessibility/label-has-for': 'warn',
    'vuejs-accessibility/form-control-has-label': 'warn',
    'vuejs-accessibility/click-events-have-key-events': 'warn',
    'vuejs-accessibility/mouse-events-have-key-events': 'warn'
  }
}
