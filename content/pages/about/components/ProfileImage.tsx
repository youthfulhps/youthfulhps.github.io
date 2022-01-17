import React from "react";
import styled from "styled-components";

const StyledMe = styled.div`
  width: 50px;
  height: 50px;
`;

function ProfileImage() {
  return (
    <StyledMe>
      <img src={"../images/me.png"} />
    </StyledMe>
  );
}

export default ProfileImage;
