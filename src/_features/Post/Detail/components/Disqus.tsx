import React, { useState } from 'react';
import ReactDisqusComments from 'react-disqus-comments';
import { MarkdownRemark } from '@shared/types/gatsby';

type DisqusProps = {
  post: MarkdownRemark;
  shortName: string;
  siteUrl: string;
  slug: string;
};

type Toast = {
  text: string;
};

function Disqus({ post, shortName, siteUrl, slug }: DisqusProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const onSnackbarDismiss = () => {
    const [, ...restToasts] = toasts;
    setToasts(restToasts);
  };

  const notifyAboutComment = () => {
    const newToasts = toasts.slice();
    newToasts.push({ text: 'New comment available!!' });
    setToasts(newToasts);
  };

  const url = siteUrl + slug;

  return (
    <ReactDisqusComments
      shortname={shortName}
      identifier={post.frontmatter.title}
      title={post.frontmatter.title}
      url={url}
      category_id={post.frontmatter.category_id}
      onNewComment={notifyAboutComment}
    />
  );
}

export default Disqus;
