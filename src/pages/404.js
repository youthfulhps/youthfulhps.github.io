import React from 'react';
import { graphql, Link } from 'gatsby';

import { Layout } from '../layout';
import Head from '@shared/components/Head';

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <h1>NOT FOUND :(</h1>
        <Link to={`/`} className="link">
          <a>홈으로 돌아가기</a>
        </Link>
      </Layout>
    );
  }
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
