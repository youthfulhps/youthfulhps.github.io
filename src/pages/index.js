import { graphql } from 'gatsby';
import _ from 'lodash';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import Contents from '@features/Post/List/components/Contents';
import Head from '@shared/components/Head';
import { HOME_TITLE, TYPE_CATEGORY } from '@shared/constants';
import { useCategory } from '@shared/hooks/useCategory';
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver';
import { useRenderedCount } from '@shared/hooks/useRenderedCount';
import { useScrollEvent } from '@shared/hooks/useScrollEvent';
import Layout from '@shared/layouts';
import * as Dom from '@shared/utils/dom';
import * as EventManager from '@shared/utils/event-manager';

const BASE_LINE = 80;

function getDistance(currentPos) {
  return Dom.getDocumentHeight() - currentPos;
}

export default ({ data, location }) => {
  const { siteMetadata } = data.site;
  const { countOfInitialPost } = siteMetadata.configs;
  const posts = data.allMarkdownRemark.edges;
  const categories = useMemo(
    () => _.uniq(posts.map(({ node }) => node.frontmatter.category)),
    []
  );
  const lengthCategories = Object.keys(TYPE_CATEGORY);
  const bioRef = useRef(null);
  const [DEST, setDEST] = useState(316);
  const [count, countRef, increaseCount] = useRenderedCount();
  const [
    category,
    selectCategory,
    typeCategory,
    selectTypeCategory,
  ] = useCategory(DEST);

  useEffect(
    tabRef => {
      setDEST(
        !bioRef.current
          ? 316
          : bioRef.current.getBoundingClientRect().bottom +
              window.pageYOffset +
              24
      );
    },
    [bioRef.current]
  );

  useIntersectionObserver();
  useScrollEvent(() => {
    const currentPos = window.scrollY + window.innerHeight;
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE;
    const doesNeedMore = () =>
      posts.length > countRef.current * countOfInitialPost;

    return EventManager.toFit(increaseCount, {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })();
  });

  return (
    <Layout location={location} title={siteMetadata.title}>
      <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
      <Contents posts={posts} />
    </Layout>
  );
};

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
