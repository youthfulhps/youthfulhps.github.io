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
      fontWeight: 800,
      lineHeight: 1.2,
      fontFamily: 'Catamaran',
    },

    h2: {
      fontWeight: 700,
      lineHeight: 1.2,
      marginTop: '56px',
      marginBottom: '20px',
      fontFamily: 'Catamaran',
    },

    h3: {
      fontFamily: 'Catamaran',
    },

    ul: {
      marginBottom: '18px',
    },

    li: {
      marginBottom: '2px',
      fontFamily: 'Pretendard',
      // fontFamily: 'IBM Plex Sans KR',
    },

    p: {
      // fontFamily: 'Pretendard',
      lineHeight: '1.8',
      fontFamily: 'IBM Plex Sans KR',
    },

    'span.gatsby-resp-image-wrapper': {
      margin: '2em 0',
    }
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
