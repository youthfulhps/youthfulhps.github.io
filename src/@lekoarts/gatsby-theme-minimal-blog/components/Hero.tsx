import React from "react";
import styled from "@emotion/styled";
import Me from "../assets/images/me.png";
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
  background: ${({ isDark }) => !isDark && `#ffffff`};
  box-shadow: 0px 2px 20px rgba(62, 74, 107, 0.08);
  border-radius: 16px;
  width: 100%;
`;

const StyledHeroHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
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
        <img src={Me} />
        <Divider />
        <Spacer width={32} />
        <div>
          {/* <StyledHeroHeader></StyledHeroHeader> */}
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
