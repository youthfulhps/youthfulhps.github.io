/** @jsx jsx */
import { jsx, useColorMode, Flex, Link } from "theme-ui";
import useMinimalBlogConfig from "../hooks/use-minimal-blog-config";
import ColorModeToggle from "./colormode-toggle";
import Navigation from "./navigation";
import HeaderTitle from "./header-title";
import HeaderExternalLinks from "./header-external-links";
import github from "../assets/icons/github.png";

const Header = () => {
  const { navigation: nav } = useMinimalBlogConfig();
  const [colorMode, setColorMode] = useColorMode();
  const isDark = colorMode === `dark`;
  const toggleColorMode = (e: any) => {
    e.preventDefault();
    setColorMode(isDark ? `light` : `dark`);
  };

  return (
    <header>
      <Flex sx={{ alignItems: `center`, justifyContent: `space-between` }}>
        <HeaderTitle />
        <Link href={"https://github.com/youthfulhps"} sx={{ height: 30 }}>
          <img src={github} width={30} height={30} />
        </Link>
        {/* <ColorModeToggle isDark={isDark} toggle={toggleColorMode} /> */}
      </Flex>
      <div
        sx={{
          boxSizing: `border-box`,
          display: `flex`,
          variant: `dividers.bottom`,
          alignItems: `center`,
          justifyContent: `space-between`,
          mt: 3,
          color: `secondary`,
          a: { color: `secondary`, ":hover": { color: `heading` } },
          flexFlow: `wrap`,
        }}
      >
        <Navigation nav={nav} />
        <HeaderExternalLinks />
      </div>
    </header>
  );
};

export default Header;
