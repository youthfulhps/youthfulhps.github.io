import React from 'react';
import { graphql, Link, PageProps } from 'gatsby';

import Layout from '@shared/layouts';
import Head from '@shared/components/Head';
import { Site } from '@shared/types/gatsby';

type NotFoundPageData = {
  site: Site;
};

type NotFoundPageProps = PageProps<NotFoundPageData>;

function NotFoundPage({ data, location }: NotFoundPageProps) {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location}>
      <Head title="404: Not Found" />
      <h1>NOT FOUND :(</h1>
      <Link to={`/`} className="link">
        홈으로 돌아가기
      </Link>
    </Layout>
  );
}

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
