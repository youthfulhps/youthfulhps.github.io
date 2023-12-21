import Typography from 'typography';
import GitHubTheme from 'typography-theme-github';

GitHubTheme.overrideThemeStyles = () => {
  return {
    a: {
      boxShadow: `none`,
    },

    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
      textDecoration: `none`,
    },

    'a:hover': {
      textDecoration: `none`,
    },

    h1: {
      fontWeight: 600,
      lineHeight: 1.6,
      fontFamily: 'Pretendard',
      letterSpacing: '-0.08rem',
      borderBottom: 'none',
    },

    h2: {
      fontWeight: 600,
      lineHeight: 1.2,
      marginTop: '56px',
      marginBottom: '20px',
      fontFamily: 'Pretendard',
      letterSpacing: '-0.06rem',
      borderBottom: 'none',
    },

    h3: {
      fontWeight: 600,
      fontFamily: 'Pretendard',
      letterSpacing: '-0.06rem',
    },

    ul: {
      marginBottom: '18px',
      lineHeight: '2.1',
    },

    li: {
      marginBottom: '2px',
      fontFamily: 'Pretendard',
    },

    p: {
      fontFamily: 'Pretendard',
      lineHeight: '2.1',
    },

    'span.gatsby-resp-image-wrapper': {
      margin: '2em 0',
    },
  };
};

const typography = new Typography(GitHubTheme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
