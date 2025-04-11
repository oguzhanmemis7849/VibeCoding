module.exports = {
  root: true,
  env: {
  node: true,
  browser: true,
  es6: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  plugins: ['vue'],
  parserOptions: {
  ecmaVersion: 'latest',
  sourceType: 'module'
  },
  rules: {
  'vue/multi-word-component-names': 'off',
  'vue/no-reserved-component-names': 'off',
  'vue/attribute-hyphenation': 'off',
  'vue/require-v-for-key': 'off',
  'vue/require-prop-types': 'off',
  'vue/require-default-prop': 'off',
  'vue/require-explicit-emits': 'off',
  'vue/first-attribute-linebreak': 'off',
  'vue/no-v-html': 'off',
  'vue/no-parsing-error': 'off',
  'vue/valid-v-on': 'off',
  'vue/v-on-event-hyphenation': 'off',
  'vue/valid-v-for': 'off',
  'vue/no-reserved-props': 'off',
  'no-prototype-builtins': 'off',
 'no-undef': 'off',
 'vue/component-tags-order': [
 'error',
 {
 order: ['script', 'template', 'style']
 }
 ],
 'vue/attributes-order': [
 'error',
 {
 order: [
 'DEFINITION',
 'LIST_RENDERING',
 'CONDITIONALS',
 'RENDER_MODIFIERS',
 'GLOBAL',
 ['UNIQUE', 'SLOT'],
 'TWO_WAY_BINDING',
 'OTHER_DIRECTIVES',
 'OTHER_ATTR',
 'EVENTS',
 'CONTENT'
 ],
 alphabetical: false
 }
 ]
 }
};