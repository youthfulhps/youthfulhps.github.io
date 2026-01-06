/// <reference types="gatsby" />

import { PageProps } from 'gatsby';

// GraphQL 쿼리 결과 타입 정의
export interface SiteMetadata {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  thumbnail: string;
  introduction?: string;
  keywords?: string[];
  configs?: {
    countOfInitialPost?: number;
  };
  social?: {
    twitter?: string;
    github?: string;
    medium?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  comment?: {
    disqusShortName?: string;
    utterances?: string;
  };
  sponsor?: {
    buyMeACoffeeId?: string;
  };
}

export interface MarkdownRemarkFrontmatter {
  title: string;
  description?: string;
  date?: string;
  category?: string;
  category_id?: string;
  draft?: boolean;
  type?: string;
  lang?: string;
}

export interface MarkdownRemarkNode {
  id: string;
  excerpt?: string;
  html?: string;
  fields?: {
    slug: string;
  };
  frontmatter?: MarkdownRemarkFrontmatter;
}

export interface MarkdownRemark extends MarkdownRemarkNode {
  frontmatter: MarkdownRemarkFrontmatter;
}

export interface AllMarkdownRemark {
  edges: Array<{
    node: MarkdownRemarkNode;
    previous?: MarkdownRemarkNode | null;
    next?: MarkdownRemarkNode | null;
  }>;
}

export interface Site {
  siteMetadata: SiteMetadata;
}

export interface File {
  childImageSharp?: {
    fixed?: {
      base64?: string;
      width: number;
      height: number;
      src: string;
      srcSet: string;
    };
    fluid?: {
      aspectRatio: number;
      src: string;
      srcSet: string;
      sizes: string;
      base64?: string;
    };
  };
}

// 페이지 쿼리 타입 예시
export interface IndexPageQuery {
  site: Site;
  allMarkdownRemark: AllMarkdownRemark;
}

export interface BlogPostQuery {
  site: Site;
  markdownRemark: MarkdownRemark;
}

export interface AboutPageQuery {
  allMarkdownRemark: AllMarkdownRemark;
}

export interface BioQuery {
  avatar: File;
  site: Site;
}

// 페이지 Props 타입
export interface IndexPageProps extends PageProps {
  data: IndexPageQuery;
}

export interface BlogPostPageProps extends PageProps {
  data: BlogPostQuery;
  pageContext: {
    slug: string;
    previous?: MarkdownRemarkNode | null;
    next?: MarkdownRemarkNode | null;
  };
}

export interface AboutPageProps extends PageProps {
  data: AboutPageQuery;
}
