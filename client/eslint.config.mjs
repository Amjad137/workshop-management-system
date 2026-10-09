import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/.next',
    '**/.husky',
    '**/.vscode',
    '**/.idea',
    '**/__tests__',
  ]),
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier,
      sonarjs,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,
      ...sonarjs.configs['recommended-legacy'].rules,

      // overrides
      'react-hooks/exhaustive-deps': 'error',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/non-existent-operator': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-extra-arguments': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-commented-code': 'warn',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/no-nested-conditional': 'off',
      'no-unused-expressions': 'warn',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'sonarjs/no-hardcoded-passwords': 'warn',
    },
  },
]);
