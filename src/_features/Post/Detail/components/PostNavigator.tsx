import React from 'react';
import { Link } from 'gatsby';
import { MarkdownRemarkNode } from '@shared/types/gatsby';

type PostNavigatorProps = {
  pageContext: {
    previous?: MarkdownRemarkNode | null;
    next?: MarkdownRemarkNode | null;
  };
};

function PostNavigator({ pageContext }: PostNavigatorProps) {
  const { previous, next } = pageContext;

  return (
    <ul className="navigator my-10 flex flex-wrap justify-between list-none p-0">
      <li className="mb-3">
        {previous && previous.fields && previous.frontmatter && (
          <Link
            to={previous.fields.slug}
            rel="prev"
            className="py-[7px] px-4 rounded-md text-xs opacity-80 bg-[var(--color-navigator-bg)] text-[var(--color-navigator-text)]"
          >
            ← {previous.frontmatter.title}
          </Link>
        )}
      </li>
      <li className="mb-3">
        {next && next.fields && next.frontmatter && (
          <Link
            to={next.fields.slug}
            rel="next"
            className="py-[7px] px-4 rounded-md text-xs opacity-80 bg-[var(--color-navigator-bg)] text-[var(--color-navigator-text)]"
          >
            {next.frontmatter.title} →
          </Link>
        )}
      </li>
    </ul>
  );
}

export default PostNavigator;
