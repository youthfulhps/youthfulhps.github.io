import React, { useMemo } from 'react';

import { ThumbnailContainer } from '../thumbnail-container';
import { ThumbnailItem } from '../thumbnail-item';
import { CATEGORY_TYPE, TYPE_CATEGORY } from '../../constants';

export const Contents = ({
  posts,
  countOfInitialPost,
  count,
  category,
  typeCategory,
}) => {
  const refinedPosts = useMemo(() =>
    posts
      .filter(
        ({ node }) =>
          category === CATEGORY_TYPE.ALL ||
          node.frontmatter.category === category
      )
      .filter(
        ({ node }) =>
          typeCategory === CATEGORY_TYPE.ALL ||
          (node.frontmatter?.type ?? 'BLOG') === typeCategory
      )
      .slice(0, count * countOfInitialPost)
  );

  return (
    <ThumbnailContainer>
      {refinedPosts.map(({ node }, index) => (
        <ThumbnailItem node={node} key={`item_${index}`} />
      ))}
    </ThumbnailContainer>
  );
};
