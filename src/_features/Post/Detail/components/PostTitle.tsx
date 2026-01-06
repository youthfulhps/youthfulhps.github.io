import React from 'react';

type PostTitleProps = {
  title: string;
};

function PostTitle({ title }: PostTitleProps) {
  return <h1>{title}</h1>;
}

export default PostTitle;
