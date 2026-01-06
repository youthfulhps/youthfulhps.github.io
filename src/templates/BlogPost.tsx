import React, { useEffect } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '@shared/layouts';
import Head from '@shared/components/Head';
import PostTitle from '@features/Post/Detail/components/PostTitle';
import PostDate from '@features/Post/Detail/components/PostDate';
import PostContainer from '@features/Post/Detail/components/PostContainer';
import PostNavigator from '@features/Post/Detail/components/PostNavigator';
import Disqus from '@features/Post/Detail/components/Disqus';
import Utterances from '@features/Post/Detail/components/Utterances';
import * as ScrollManager from '@shared/utils/scroll';
import { Site, MarkdownRemark, MarkdownRemarkNode } from '@shared/types/gatsby';

import 'katex/dist/katex.min.css';

type BlogPostPageData = {
  site: Site;
  markdownRemark: MarkdownRemark;
};

type BlogPostPageProps = PageProps<BlogPostPageData> & {
  pageContext: {
    slug: string;
    previous?: MarkdownRemarkNode | null;
    next?: MarkdownRemarkNode | null;
  };
};

function BlogPostPage({ data, pageContext, location }: BlogPostPageProps) {
  useEffect(() => {
    ScrollManager.init();
    return () => {
      ScrollManager.destroy();
    };
  }, []);

  const post = data.markdownRemark;
  const metaData = data.site.siteMetadata;
  const { comment, siteUrl } = metaData;
  const { disqusShortName, utterances } = comment || {};
  const { title: postTitle, date, description } = post.frontmatter;

  return (
    <Layout location={location}>
      <Head
        title={postTitle || ''}
        description={description}
        thumbnail={metaData.thumbnail}
      />
      {postTitle && <PostTitle title={postTitle} />}
      {date && <PostDate date={date} />}
      <PostContainer html={post.html} />
      <PostNavigator pageContext={pageContext} />
      {!!disqusShortName && (
        <Disqus
          post={post}
          shortName={disqusShortName}
          siteUrl={siteUrl}
          slug={pageContext.slug}
        />
      )}
      {!!utterances && <Utterances repo={utterances} />}
    </Layout>
  );
}

export default BlogPostPage;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
        thumbnail
        comment {
          disqusShortName
          utterances
        }
        sponsor {
          buyMeACoffeeId
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 280)
      html
      frontmatter {
        title
        description
        date(formatString: "YYYY.MM.DD")
      }
    }
  }
`;
