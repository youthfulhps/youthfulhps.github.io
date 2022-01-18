import { css, Theme } from "@emotion/react";

export const GlobalStyles = (theme: Theme) => {
  return css`
    @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

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
      font-family: "Pretendard", "Spoqa Han Sans", "Nanum Gothic", sans-serif;
      -webkit-font-smoothing: antialiased !important;
      text-rendering: optimizeLegibility !important;
    }
    ::selection {
      background-color: ${theme.colors.text};
      color: ${theme.colors.background};
    }
  `;
};

export default GlobalStyles;
