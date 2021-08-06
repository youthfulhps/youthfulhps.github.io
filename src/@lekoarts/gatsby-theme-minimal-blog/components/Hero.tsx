import React from "react";
import styled from "@emotion/styled";
import Me from "../assets/images/me.png";
import HeroImg from "../assets/images/hero.png";
import Spacer from "./Common/Spacer";
import { useColorMode } from "theme-ui";
import Divider from "./Common/Divider";

type StyledHeroHeaderWrapperProps = {
  isDark: boolean;
};

const StyledHeroHeaderWrapper = styled.div<StyledHeroHeaderWrapperProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 463px;
  width: 100%;
  background-image: url(${HeroImg});
  background-size: cover;
  background-position: top;
  backdrop-filter: blur(2px) grayscale(30%);
`;

const StyledHeroHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 1px 1px 2px black;
`;

const StyledDescription = styled.div`
  font-size: 16px;
  color: #ffffff;
  text-shadow: 1px 1px 2px black;
`;

function Hero() {
  const [colorMode] = useColorMode();
  return (
    <>
      <Spacer height={32} />
      <StyledHeroHeaderWrapper isDark={colorMode === "dark"}>
        <Divider />
        <Spacer width={32} />
        {/* <div>
          <StyledHeroHeader>브랜든 기술 블로그입니다</StyledHeroHeader>
          <StyledDescription>
            옛 장인들은 자신의 작품에 서명하는 것을 자랑스러워했습니다
          </StyledDescription>
          <StyledDescription>가치 있는 개인 기록을 남깁니다.</StyledDescription>
        </div> */}
      </StyledHeroHeaderWrapper>
    </>
  );
}

export default Hero;
