import React from 'react';
import { graphql, PageProps } from 'gatsby';

import { rhythm } from '@shared/utils/typography';
import * as Lang from '@shared/constants';
import { AllMarkdownRemark } from '@shared/types/gatsby';

type AboutPageData = {
  allMarkdownRemark: AllMarkdownRemark;
};

type AboutPageProps = PageProps<AboutPageData>;

function AboutPage({ data }: AboutPageProps) {
  const resumes = data.allMarkdownRemark.edges;

  const resume = resumes
    .filter(({ node }) => node.frontmatter?.lang === Lang.ENGLISH)
    .map(({ node }) => node)[0];

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(0.5)} ${rhythm(3 / 4)} ${rhythm(1.5)} ${rhythm(
          3 / 4
        )}`,
      }}
    >
      {resume && (
        <div dangerouslySetInnerHTML={{ __html: resume.html || '' }} />
      )}
    </div>
  );
}

export default AboutPage;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(filter: { frontmatter: { category: { eq: null } } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 160)
          html
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            lang
          }
        }
      }
    }
  }
`;
