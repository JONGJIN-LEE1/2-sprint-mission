import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; // Prettier 플러그인 가져오기
import tseslint from 'typescript-eslint'; // 👈 TypeScript용 플러그인 불러오기

export default [
  // 1. 기본 JavaScript 설정
  js.configs.recommended,

  // 2. JavaScript 전용 설정
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // ✅ 3. TypeScript 전용 설정 추가
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // tsconfig 경로
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules, // 기본 타입스크립트 권장 규칙 불러오기
    },
  },

  // 4. Prettier 적용 (맨 마지막에)
  eslintPluginPrettierRecommended,
];
