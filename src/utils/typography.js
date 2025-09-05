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
      fontSize: '1.8rem',
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.2,
      marginTop: '2em',
      marginBottom: '1em',
      fontFamily: 'Pretendard',
      letterSpacing: '-0.06rem',
      borderBottom: 'none',
      fontSize: '1.4rem',
    },
    h3: {
      fontWeight: 600,
      fontFamily: 'Pretendard',
      letterSpacing: '-0.06rem',
      fontSize: '1.05em',
    },
    ul: {
      marginBottom: '18px',
      lineHeight: '2.1',
    },
    li: {
      marginBottom: '2px',
      fontFamily: 'Pretendard',
    },
    'p:not(svg p)': {
      fontFamily: 'Pretendard',
      lineHeight: '2.1',
      fontSize: '0.925rem',
    },
    'p > svg': {
      margin: '2em 0',
      textAlign: 'center',
    },
    'p > svg': {
      maxWidth: 'none !important',
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
      padding: '2rem 4rem',
      margin: '2em 0',
      overflow: 'visible',
      display: 'block',
    },
    'span.gatsby-resp-image-wrapper': {
      margin: '2em 0',
    },
  };
};

// 코드 블록에 Fira Code 폰트 적용
GitHubTheme.overrideStyles = (
  { adjustFontSizeTo, rhythm },
  options,
  styles
) => ({
  ...styles,
  'code, pre, tt': {
    fontFamily:
      "'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', 'Courier New', monospace",
    fontFeatureSettings: "'liga' 1, 'calt' 1",
  },
  'pre code': {
    fontSize: 'inherit',
  },
  'code[class*="language-"]': {
    fontFamily:
      "'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', 'Courier New', monospace",
    fontWeight: '400',
    fontFeatureSettings: "'liga' 1, 'calt' 1",
  },
});

const typography = new Typography(GitHubTheme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
