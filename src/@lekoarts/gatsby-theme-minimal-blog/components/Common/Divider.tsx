import React from "react";
import styled from "@emotion/styled";

const StyledDivider = styled.div`
  height: auto;
  border-left: 3px solid black;
`;

function Divider() {
  return <StyledDivider />;
}

export default Divider;
