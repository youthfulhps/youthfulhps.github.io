import React from 'react';
import Top from '@shared/components/Top';
import Footer from '@shared/components/Footer';
import { rhythm } from '@shared/utils/typography';

import { PageProps } from 'gatsby';

type LayoutProps = {
  location: PageProps['location'];
  children: React.ReactNode;
};

function Layout({ location, children }: LayoutProps) {
  // @ts-ignore
  const rootPath = `${__PATH_PREFIX__}/`;

  return (
    <React.Fragment>
      <Top location={location} rootPath={rootPath} />
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
}

export default Layout;
