import { graphql, PageProps } from 'gatsby';
import React, { useRef, useEffect, useState } from 'react';
import Contents from '@features/Post/List/components/Contents';
import Head from '@shared/components/Head';
import { HOME_TITLE } from '@shared/constants';
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver';
import { useRenderedCount } from '@shared/hooks/useRenderedCount';
import { useScrollEvent } from '@shared/hooks/useScrollEvent';
import Layout from '@shared/layouts';
import * as Dom from '@shared/utils/dom';
import * as EventManager from '@shared/utils/event-manager';
import { Site, AllMarkdownRemark } from '@shared/types/gatsby';

type IndexPageData = {
  site: Site;
  allMarkdownRemark: AllMarkdownRemark;
};

type IndexPageProps = PageProps<IndexPageData>;

const BASE_LINE = 80;

function getDistance(currentPos: number): number {
  return Dom.getDocumentHeight() - currentPos;
}

function IndexPage({ data, location }: IndexPageProps) {
  const { siteMetadata } = data.site;
  const { countOfInitialPost } = siteMetadata.configs || {};
  const posts = data.allMarkdownRemark.edges;
  const bioRef = useRef<HTMLDivElement>(null);
  const [DEST, setDEST] = useState(316);
  const [count, countRef, increaseCount] = useRenderedCount();

  useEffect(() => {
    setDEST(
      !bioRef.current
        ? 316
        : bioRef.current.getBoundingClientRect().bottom +
            window.pageYOffset +
            24
    );
  }, []);

  useIntersectionObserver();
  useScrollEvent(() => {
    const currentPos = window.scrollY + window.innerHeight;
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE;
    const doesNeedMore = () =>
      posts.length > countRef.current * (countOfInitialPost || 5);

    return EventManager.toFit(increaseCount, {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })();
  });

  return (
    <Layout location={location}>
      <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
      <Contents posts={posts} />
    </Layout>
  );
}

export default IndexPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { ne: null }, draft: { eq: false } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, truncate: true)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY.MM.DD")
            title
            description
            category
            draft
            type
          }
        }
      }
    }
  }
`;
