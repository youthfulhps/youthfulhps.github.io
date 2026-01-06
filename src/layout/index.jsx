import React, { useEffect } from 'react';
import { Top } from '@shared/components/top';
import { ThemeSwitch } from '@shared/components/theme-switch';
import { Footer } from '@shared/components/footer';
import { rhythm } from '@shared/utils/typography';

import './index.scss';

export const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;

  return (
    <React.Fragment>
      <Top title={title} location={location} rootPath={rootPath} />
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
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
