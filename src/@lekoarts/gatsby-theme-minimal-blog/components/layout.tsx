/** @jsx jsx */
import * as React from "react";
import { Global } from "@emotion/react";
import { Box, Container, jsx } from "theme-ui";
import Seo from "./seo";
import Header from "./header";
import Footer from "./footer";
import CodeStyles from "../styles/code";
import SkipNavLink from "./skip-nav";
import GlobalStyles from "../assets/styles/GlobalStyles";

type LayoutProps = { children: React.ReactNode; className?: string };

const Layout = ({ children, className = `` }: LayoutProps) => (
  <React.Fragment>
    <Global styles={GlobalStyles} />
    <Seo />
    <SkipNavLink>Skip to content</SkipNavLink>
    <Container>
      <Header />
      <Box id="skip-nav" sx={{ ...CodeStyles }} className={className}>
        {children}
      </Box>
      <Footer />
    </Container>
  </React.Fragment>
);

export default Layout;
