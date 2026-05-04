import { config as baseConfig } from '@repo/eslint-config/base';
import { nextJsConfig } from '@repo/eslint-config/next-js';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/out/**',
      '**/build/**',
      '**/next-env.d.ts',
      '**/node_modules/**',
    ],
  },

  ...baseConfig,
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['apps/server/**'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },

  ...nextJsConfig.map((config) => ({
    ...config,
    files: config.files || ['apps/web/**'],
  })),

  {
    files: ['apps/web/**'],
    rules: {
      '@next/next/no-html-link-for-pages': ['error', 'apps/web/app'],
    },
  },
);
