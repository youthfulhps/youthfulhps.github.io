import React, { useMemo } from 'react';

import { ThumbnailContainer } from '../thumbnail-container';
import { ThumbnailItem } from '../thumbnail-item';

export const Contents = ({ posts }) => {
  return (
    <ThumbnailContainer>
      {posts.map(({ node }, index) => (
        <ThumbnailItem node={node} key={`item_${index}`} />
      ))}
    </ThumbnailContainer>
  );
};
