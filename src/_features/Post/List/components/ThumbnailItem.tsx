import React from 'react';
import { Link } from 'gatsby';
import { TARGET_CLASS } from '@shared/utils/visible';
import { MarkdownRemarkNode } from '@shared/types/gatsby';

type ThumbnailItemProps = {
  node: MarkdownRemarkNode;
};

function ThumbnailItem({ node }: ThumbnailItemProps) {
  return (
    <Link
      className={`thumbnail block pb-1 shadow-none transition-[text-shadow,opacity] duration-300 opacity-0 ${TARGET_CLASS} mb-0.5 hover:[text-shadow:var(--text-shadow-light-hover)] dark:hover:[text-shadow:var(--text-shadow-dark-hover)]`}
      to={node.fields?.slug || ''}
    >
      <div key={node.fields?.slug || ''}>
        <h3 className="text-base">
          {node.frontmatter?.title || node.fields?.slug}
        </h3>
        <div className="flex-row items-center">
          <p className="text-xs opacity-50">
            {node.frontmatter?.date}, {node.frontmatter?.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ThumbnailItem;
