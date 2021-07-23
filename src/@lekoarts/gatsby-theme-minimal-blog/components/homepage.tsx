/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "gatsby";
import Layout from "./layout";
import Title from "./title";
import Listing from "./listing";
import List from "./list";
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config";
import replaceSlashes from "../utils/replaceSlashes";
import Spacer from "./Common/Spacer";
import Hero from "../components/Hero";
import styled from "@emotion/styled";
// @ts-ignore

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

const StyledLayout = styled(Layout)`
  display: grid;
`;

const Homepage = ({ posts }: PostsProps) => {
  const { basePath, blogPath } = useMinimalBlogConfig();

  return (
    <StyledLayout>
      <section
        sx={{
          p: { fontSize: [1, 2, 3] },
          variant: `section_hero`,
        }}
      >
        <Hero />
      </section>
      <Spacer height={32} />
      <Title text="BLOGS">
        <Link to={replaceSlashes(`/${basePath}/${blogPath}`)} />
      </Title>
      <Spacer height={32} />
      <Listing posts={posts} showTags={false} />
      {/* <List sx={{ variant: `section_bottom` }}>
        <Bottom />
      </List> */}
    </StyledLayout>
  );
};

export default Homepage;
