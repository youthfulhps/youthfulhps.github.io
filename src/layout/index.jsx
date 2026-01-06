import React, { useEffect } from 'react';
import Top from '@shared/components/Top';
import ThemeSwitch from '@shared/components/ThemeSwitch';
import Footer from '@shared/components/Footer';
import { rhythm } from '@shared/utils/typography';

export const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;

  return (
    <React.Fragment>
      <Top title={title} location={location} rootPath={rootPath} />
      <div
        className="mx-auto"
        style={{
          maxWidth: rhythm(31),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {children}
        <Footer />
      </div>
    </React.Fragment>
  );
};
