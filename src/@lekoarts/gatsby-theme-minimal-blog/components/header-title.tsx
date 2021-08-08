/** @jsx jsx */
import { Link } from "gatsby";
import { jsx } from "theme-ui";
import replaceSlashes from "../utils/replaceSlashes";
import useSiteMetadata from "../hooks/use-site-metadata";
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config";
import heroImg from "../assets/images/hero.png";
import styled from "@emotion/styled";

const StyledHeaderLink = styled(Link)`
  display: flex;
  text-decoration: none;
  align-items: center;
  color: black;
`;

const StyledHeaderTitle = styled.div`
  font-weight: 700;
`;

const StyledHeaderImage = styled.img`
  width: 36px;
`;

const HeaderTitle = () => {
  const { siteTitle } = useSiteMetadata();
  const { basePath } = useMinimalBlogConfig();

  return (
    <StyledHeaderLink
      to={replaceSlashes(`/${basePath}`)}
      aria-label={`${siteTitle} - Back to home`}
    >
      <StyledHeaderImage src={heroImg} />
      <StyledHeaderTitle>{siteTitle}</StyledHeaderTitle>
    </StyledHeaderLink>
  );
};

export default HeaderTitle;
