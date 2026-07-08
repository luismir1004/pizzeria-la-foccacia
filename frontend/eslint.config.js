import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

/** Globals de navegador usados por la app (evita depender del paquete `globals`). */
const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  localStorage: 'readonly',
  console: 'readonly',
  confirm: 'readonly',
  fetch: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  requestAnimationFrame: 'readonly',
  IntersectionObserver: 'readonly',
  CustomEvent: 'readonly',
  HTMLElement: 'readonly',
  customElements: 'readonly',
  URLSearchParams: 'readonly',
};

export default [
  {
    ignores: ['dist/**', 'dev-dist/**', 'node_modules/**', '.vite/**'],
  },
  js.configs.recommended,
  prettier,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
