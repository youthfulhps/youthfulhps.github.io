import { css, Theme } from "@emotion/react";

export const GlobalStyles = (theme: Theme) => {
  return css`
    @import url(//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css);
    @import url(//fonts.googleapis.com/css?family=Monoton|Nanum+Gothic&display=swap);

    @font-face {
      font-family: "Pretendard-Regular";
      src: url("https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
        format("woff");
      font-weight: 400;
      font-style: normal;
    }

    * {
      box-sizing: border-box;
    }

    html {
      -webkit-text-size-adjust: 100%;
    }
    a {
      transition: all 0.3s ease-in-out;
    }
    body {
      font-family: "Pretendard-Regular", "Spoqa Han Sans", "Nanum Gothic",
        sans-serif;
      -webkit-font-smoothing: antialiased !important;
      text-rendering: optimizeLegibility !important;
    }
    ::selection {
      background-color: ${theme.colors.text};
      color: ${theme.colors.background};
    }

    /* section:not(:first-child) {
      border-top: 1px solid black;
      border-bottom: 1px solid black;
    }

    section:first-child {
      border-bottom: 1px solid black;
    } */

    img {
      box-shadow: 0px 2px 20px rgba(62, 74, 107, 0.08);
    }
  `;
};

export default GlobalStyles;
