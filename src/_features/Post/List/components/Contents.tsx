import React from 'react';

import ThumbnailContainer from './ThumbnailContainer';
import ThumbnailItem from './ThumbnailItem';
import { AllMarkdownRemark } from '@shared/types/gatsby';

type ContentsProps = {
  posts: AllMarkdownRemark['edges'];
};

function Contents({ posts }: ContentsProps) {
  return (
    <ThumbnailContainer>
      {posts.map(({ node }, index) => (
        <ThumbnailItem node={node} key={`item_${index}`} />
      ))}
    </ThumbnailContainer>
  );
}

export default Contents;
