import React from 'react';
import { Link } from 'gatsby';
import { PageProps } from 'gatsby';
import ThemeSwitch from './ThemeSwitch';
import { rhythm } from '@shared/utils/typography';

type TopProps = {
  location: PageProps['location'];
  rootPath: string;
};

function Top({ location, rootPath }: TopProps) {
  const isRoot = location.pathname === rootPath;
  return (
    <div
      className="flex flex-row items-center justify-between"
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(31),
        padding: `${rhythm(1)} ${rhythm(3 / 4)} 0`,
      }}
    >
      <div className="flex-col items-center">
        {!isRoot && (
          <Link to={`/`} className="mr-2 text-gray-400 hover:text-gray-200">
            Posts
          </Link>
        )}
        <a
          target="_blank"
          href="https://github.com/youthfulhps"
          className="text-gray-400 hover:text-gray-200"
        >
          Github
        </a>
      </div>
      {/* <ThemeSwitch /> */}
    </div>
  );
}

export default Top;
