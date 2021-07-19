import React from "react";
import styled from "@emotion/styled";

type SpacerProps = {
  /**여백의 높이 */
  height?: number;
  /**여백의 너비 */
  width?: number;
  /**여백의 색상 여부를 결정합니다. */
  isColorSet?: boolean;
};

const StyledSpacer = styled.div<SpacerProps>`
  height: ${({ height }) => height && `${height}px`};
  min-height: ${({ height }) => !height && "100%"};
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  ${({ isColorSet }) =>
    isColorSet ? `background-color: var(--element-light-gray)` : ``}
`;

function Spacer({ height, width, isColorSet = false }: SpacerProps) {
  return <StyledSpacer height={height} width={width} isColorSet={isColorSet} />;
}

export default Spacer;
