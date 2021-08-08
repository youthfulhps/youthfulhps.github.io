/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "gatsby";
import Layout from "./layout";
import Title from "./title";
import Listing from "./listing";
import List from "./list";
import styled from "@emotion/styled";
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config";
import useSiteMetadata from "../hooks/use-site-metadata";
import replaceSlashes from "../utils/replaceSlashes";
import { visuallyHidden } from "../styles/utils";
import Spacer from "./Common/Spacer";

type PostsProps = {
  posts: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    description: string;
    timeToRead?: number;
    tags?: {
      name: string;
      slug: string;
    }[];
  }[];
  [key: string]: any;
};

const Homepage = ({ posts }: PostsProps) => {
  const { basePath, blogPath } = useMinimalBlogConfig();
  const { siteTitle } = useSiteMetadata();

  return (
    <Layout>
      <h1 sx={visuallyHidden}>{siteTitle}</h1>
      <Spacer height={24} />
      <Title text="최신글">
        <Link to={replaceSlashes(`/${basePath}/${blogPath}`)}>블로그 보기</Link>
      </Title>
      <Listing posts={posts} showTags={false} />
    </Layout>
  );
};

export default Homepage;
