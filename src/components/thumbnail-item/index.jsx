import React from 'react';
import { Link } from 'gatsby';
import { TARGET_CLASS } from '../../utils/visible';

import './index.scss';
import TagList from '../tag-list';
import { TYPE_CATEGORY } from '../../constants';

export const ThumbnailItem = ({ node }) => {
  const tagList = [
    node.frontmatter.type === TYPE_CATEGORY.TIL
      ? TYPE_CATEGORY.TIL
      : TYPE_CATEGORY.BLOG,
  ];

  return (
    <Link className={`thumbnail ${TARGET_CLASS}`} to={node.fields.slug}>
      <div key={node.fields.slug}>
        <h3>{node.frontmatter.title || node.fields.slug}</h3>
        <div className={'description-wrapper'}>
          {/*<TagList tagList={tagList} />*/}
          <p
            dangerouslySetInnerHTML={{
              __html: node.frontmatter.description || node.excerpt,
            }}
          />
        </div>
      </div>
    </Link>
  );
};
