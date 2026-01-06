import React from 'react';
import { Link } from 'gatsby';
import { TARGET_CLASS } from '@shared/utils/visible';

import './index.scss';

export const ThumbnailItem = ({ node }) => {
  return (
    <Link className={`thumbnail ${TARGET_CLASS} mb-0.5`} to={node.fields.slug}>
      <div key={node.fields.slug}>
        <h3>{node.frontmatter.title || node.fields.slug}</h3>
        <div className="flex-row items-center">
          <p>
            {node.frontmatter.date}, {node.frontmatter.description}
          </p>
        </div>
      </div>
    </Link>
  );
};
