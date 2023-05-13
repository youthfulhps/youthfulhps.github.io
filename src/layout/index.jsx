import React, { useEffect } from 'react';
import { Top } from '../components/top';
import { Header } from '../components/header';
import { ThemeSwitch } from '../components/theme-switch';
import { Footer } from '../components/footer';
import { rhythm } from '../utils/typography';

import './index.scss';
import * as Dom from '../utils/dom';
import { THEME } from '../constants';

export const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;

  useEffect(() => {
    Dom.addClassToBody(THEME.LIGHT);
    Dom.removeClassToBody(THEME.DARK);
  }, []);

  return (
    <React.Fragment>
      <Top title={title} location={location} rootPath={rootPath} />
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(28),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {/*<ThemeSwitch />*/}
        <Header title={title} location={location} rootPath={rootPath} />
        {children}
        <Footer />
      </div>
    </React.Fragment>
  );
};
