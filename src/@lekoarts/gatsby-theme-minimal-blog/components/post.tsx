/** @jsx jsx */
import * as React from "react";
import { jsx, Heading } from "theme-ui";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "./layout";
import ItemTags from "./item-tags";
import Seo from "./seo";
import Spacer from "./Common/Spacer";

type PostProps = {
  data: {
    post: {
      slug: string;
      title: string;
      date: string;
      tags?: {
        name: string;
        slug: string;
      }[];
      description?: string;
      canonicalUrl?: string;
      body: string;
      excerpt: string;
      timeToRead?: number;
      banner?: {
        childImageSharp: {
          resize: {
            src: string;
          };
        };
      };
    };
  };
};

const px = [`32px`, `16px`, `8px`, `4px`];
const shadow = px.map((v) => `rgba(0, 0, 0, 0.15) 0px ${v} ${v} 0px`);

const Post = ({ data: { post } }: PostProps) => (
  <Layout>
    <Seo
      title={post.title}
      description={post.description ? post.description : post.excerpt}
      image={post.banner ? post.banner.childImageSharp.resize.src : undefined}
      pathname={post.slug}
      canonicalUrl={post.canonicalUrl}
    />
    <Spacer height={48} />
    <Heading as="h1" variant="styles.h1" sx={{ margin: "0 auto" }}>
      {post.title}
    </Heading>
    <p
      sx={{
        margin: "0 auto",
        color: `secondary`,
        mt: 3,
        a: { color: `secondary` },
        fontSize: [0.5, 0.5, 1],
      }}
    >
      <time
        sx={{
          color: `#2d3748`,
          fontSize: [12, 12, 12],
          backgroundColor: "#feb2b2",
          padding: "4px",
          marginRight: "2px",
          borderRadius: "2px",
        }}
      >
        {post.date}
      </time>
      {post.tags && <ItemTags tags={post.tags} />}
      {post.timeToRead && (
        <span sx={{ fontSize: [12, 12, 12], ml: "4px" }}>
          - {post.timeToRead} min read
        </span>
      )}
    </p>
    <Spacer height={48} />
    <section
      sx={{
        my: 5,
        width: `100%`,
        margin: "0 auto",
        ".gatsby-resp-image-wrapper": {
          my: [4, 4, 5],
          boxShadow: shadow.join(`, `),
        },
        variant: `layout.content`,
        img: {
          display: "block",
          width: "100%",
          margin: `0 auto`,
        },
        ".gatsby-highlight": {
          my: [4, 4, 5],
          boxShadow: shadow.join(`, `),
        },
      }}
    >
      <MDXRenderer>{post.body}</MDXRenderer>
    </section>
  </Layout>
);

export default Post;
