import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; // Prettier 플러그인 가져오기

export default [
  // 1. 기본 ESLint 추천 규칙 활성화
  js.configs.recommended,

  // 2. JavaScript 파일에 대한 추가 설정 (브라우저, Node.js 전역 변수 등)
  {
    files: ['**/*.{js,mjs,cjs}'], // .js, .mjs, .cjs 파일에 이 설정 적용
    languageOptions: {
      ecmaVersion: 'latest', // 최신 ECMAScript 버전 사용
      sourceType: 'module', // 모듈 방식 사용
      globals: {
        ...globals.browser, // 브라우저 환경 전역 변수 (ex: window, document)
        ...globals.node, // Node.js 환경 전역 변수 (ex: process, require)
      },
    },
    rules: {
      // 여기에 필요한 추가 ESLint 규칙을 정의할 수 있습니다.
      // 예: 'no-unused-vars': 'warn', // 사용되지 않는 변수에 대해 경고
    },
  },

  // 3. Prettier 관련 ESLint 규칙 활성화 및 충돌 규칙 비활성화 (가장 마지막에 위치)
  // 이 부분이 Prettier와 ESLint가 충돌하지 않도록 합니다.
  eslintPluginPrettierRecommended,
];
