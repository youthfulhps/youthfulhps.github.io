import React from "react";
import styled from "@emotion/styled";
import Me from "../assets/images/me.png";
import heroImg from "../assets/images/hero.png";
import HeroBackground from "../assets/images/hero_background.jpeg";
import Spacer from "./Common/Spacer";
import { useColorMode } from "theme-ui";

type StyledHeroHeaderWrapperProps = {
  isDark: boolean;
};

const StyledHeroHeaderWrapper = styled.div<StyledHeroHeaderWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 24px;
  height: 463px;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${HeroBackground});
`;

const StyledHeroHeader = styled.div`
  font-size: 24px;
  font-weight: 200;
  color: #ffffff;
`;

const StyledDescription = styled.div`
  font-size: 16px;
  color: #ffffff;
`;

const StyledHeroImage = styled.img`
  width: 240px;
  /* box-shadow: 0px 3px 15px 2px #000000; */
`;

function Hero() {
  const [colorMode] = useColorMode();
  return (
    <>
      <Spacer height={32} />
      <StyledHeroHeaderWrapper isDark={colorMode === "dark"}>
        <StyledHeroImage src={heroImg} />
        <StyledHeroHeader>브랜든의 기술 블로그</StyledHeroHeader>
        <StyledDescription>
          옛 장인들은 자신의 작품에 서명하는 것을 자랑스러워했습니다, 가치 있는
          개인 기록을 남깁니다.
        </StyledDescription>
        <Spacer width={32} />
      </StyledHeroHeaderWrapper>
    </>
  );
}

export default Hero;
