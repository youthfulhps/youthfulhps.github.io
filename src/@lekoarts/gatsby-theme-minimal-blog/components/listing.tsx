/** @jsx jsx */
import { jsx, useColorMode } from "theme-ui";
import BlogListItem from "./blog-list-item";
import styled from "@emotion/styled";

type StyledListingProps = {
  isDark: boolean;
};

type ListingProps = {
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
  className?: string;
  showTags?: boolean;
};
const StyledListing = styled.section<StyledListingProps>`
  background: ${({ isDark }) => !isDark && `#ffffff`};
`;

const Listing = ({ posts, className = ``, showTags = true }: ListingProps) => {
  const [colorMode] = useColorMode();

  return (
    <StyledListing
      isDark={colorMode === "dark"}
      sx={{ mb: [5, 6, 7] }}
      className={className}
    >
      {posts.map((post) => (
        <BlogListItem key={post.slug} post={post} showTags={showTags} />
      ))}
    </StyledListing>
  );
};

export default Listing;
