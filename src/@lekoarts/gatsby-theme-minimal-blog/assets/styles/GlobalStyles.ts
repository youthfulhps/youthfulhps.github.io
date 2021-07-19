import { css, Theme } from "@emotion/react";

export const GlobalStyles = (theme: Theme) => {
  return css`
    @import url(//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css);
    @import url(//fonts.googleapis.com/css?family=Monoton|Nanum+Gothic&display=swap);

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
      font-family: "Spoqa Han Sans", "Nanum Gothic", sans-serif;
    }
    ::selection {
      background-color: ${theme.colors.text};
      color: ${theme.colors.background};
    }

    img {
      box-shadow: 0px 2px 20px rgba(62, 74, 107, 0.08);
    }
  `;
};

export default GlobalStyles;
