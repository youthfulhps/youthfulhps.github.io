/** @jsx jsx */
import * as React from "react";
import { jsx, Link as TLink, Box } from "theme-ui";
import { Link } from "gatsby";
import ItemTags from "./item-tags";
import styled from "@emotion/styled";
import Spacer from "./Common/Spacer";

type BlogListItemProps = {
  post: {
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
  };
  showTags?: boolean;
};

const StyledBox = styled(Box)`
  margin-bottom: 0;
  /* border-bottom: 1px solid black; */
  min-height: 135px;
  padding: 24px 12px;
`;

const StyledTLink = styled(TLink)`
  display: block;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
`;

const StyledDescription = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  font-size: 14px;
`;

const BlogListItem = ({ post, showTags = true }: BlogListItemProps) => (
  <StyledBox>
    <StyledTLink
      as={Link}
      to={post.slug}
      sx={{ fontSize: [2, 3, 3], color: `text` }}
    >
      {post.title}
    </StyledTLink>
    <p
      sx={{
        color: `#2d3748`,
        mt: 1,
        a: { color: `secondary` },
        fontSize: [12, 12, 12],
      }}
    >
      <time
        sx={{
          backgroundColor: "#feb2b2",
          padding: "4px",
          marginRight: "2px",
          borderRadius: "2px",
        }}
      >
        {post.date}
      </time>
      {post.tags && showTags && (
        <React.Fragment>
          <ItemTags tags={post.tags} />
        </React.Fragment>
      )}
    </p>
    <StyledDescription
      sx={{
        color: `secondary`,
        mt: 2,
        a: { color: `secondary` },
      }}
    >
      {post.description}
    </StyledDescription>
  </StyledBox>
);

export default BlogListItem;
