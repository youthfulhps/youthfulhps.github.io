import React from 'react';

function Footer() {
  return (
    <footer className="footer pt-[52px] text-center text-xs text-[var(--color-light-gray)] dark:text-[var(--color-dark-middle-font)]">
      ©
      <a
        href="https://github.com/youthfulhps"
        className="no-underline text-[var(--color-gray)] dark:text-[var(--color-dark-lightest-font)]"
      >
        youthfulhps
      </a>
      , Built with{' '}
      <a
        href="https://github.com/JaeYeopHan/gatsby-starter-bee"
        className="no-underline text-[var(--color-gray)] dark:text-[var(--color-dark-lightest-font)]"
      >
        Gatsby-starter-bee
      </a>
    </footer>
  );
}

export default Footer;
