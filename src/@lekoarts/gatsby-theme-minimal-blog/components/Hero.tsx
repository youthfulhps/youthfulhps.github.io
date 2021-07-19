import React from "react";
import styled from "@emotion/styled";
import Me from "../assets/image/me.png";
import Spacer from "./Common/Spacer";
import { useColorMode } from "theme-ui";

type StyledHeroHeaderWrapperProps = {
  isDark: boolean;
};

const StyledHeroHeaderWrapper = styled.div<StyledHeroHeaderWrapperProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 32px;
  background: ${({ isDark }) => !isDark && `white`};
  box-shadow: 0px 2px 30px rgba(62, 74, 107, 0.08);
  width: 100%;
  padding: 32px;
`;

const StyledHeroHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const StyledProfileImage = styled.img`
  border-radius: 30px;
`;

const StyledDescription = styled.div`
  font-size: 16px;
  color: var(--theme-ui-colors-secondary);
`;

function Hero() {
  const [colorMode] = useColorMode();
  return (
    <>
      <StyledHeroHeaderWrapper isDark={colorMode === "dark"}>
        <StyledProfileImage src={Me} />
        <Spacer width={32} />
        <div>
          <StyledHeroHeader>프론트엔드 개발자 유 병호</StyledHeroHeader>
          <StyledDescription>
            옛 장인들은 자신의 작품에 서명하는 것을 자랑스러워했습니다.
          </StyledDescription>
          <StyledDescription>가치 있는 개인 기록을 남깁니다.</StyledDescription>
        </div>
      </StyledHeroHeaderWrapper>
    </>
  );
}

export default Hero;
