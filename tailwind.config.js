/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './gatsby-*.js',
  ],
  // Tailwind CSS v4는 CSS-first 접근 방식을 사용하므로
  // 대부분의 설정은 CSS 파일에서 @theme를 통해 할 수 있습니다
  // 이 파일은 IDE 지원과 호환성을 위해 제공됩니다
};

