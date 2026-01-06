import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import { Layout } from '../layout';
import Head from '@shared/components/Head';
import PostTitle from '@features/Post/Detail/components/PostTitle';
import PostDate from '@features/Post/Detail/components/PostDate';
import PostContainer from '@features/Post/Detail/components/PostContainer';
import PostNavigator from '@features/Post/Detail/components/PostNavigator';
import Disqus from '@features/Post/Detail/components/Disqus';
import Utterances from '@features/Post/Detail/components/Utterances';
import * as ScrollManager from '@shared/utils/scroll';

import 'katex/dist/katex.min.css';

export default ({ data, pageContext, location }) => {
  useEffect(() => {
    ScrollManager.init();
    return () => ScrollManager.destroy();
  }, []);

  const post = data.markdownRemark;
  const metaData = data.site.siteMetadata;
  const { title, comment, siteUrl, author, sponsor } = metaData;
  const { disqusShortName, utterances } = comment;
  const { title: postTitle, date, description } = post.frontmatter;

  return (
    <Layout location={location} title={title}>
      <Head
        title={postTitle}
        description={description}
        thumbnail={metaData.thumbnail}
      />
      <PostTitle title={postTitle} />
      <PostDate date={date} />
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
};

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
