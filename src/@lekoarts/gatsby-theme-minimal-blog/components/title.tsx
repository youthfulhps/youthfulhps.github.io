/** @jsx jsx */
import * as React from "react";
import { jsx, Box } from "theme-ui";
import Plus from "../assets/icons/plus.svg";
import styled from "@emotion/styled";

type TitleProps = {
  children: React.ReactNode;
  as?: string;
  className?: string;
  text: string;
};

const StyledMore = styled.div`
  height: 100%;
  width: 51px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const Title = ({ text, children, as = `h1`, className = `` }: TitleProps) => (
  <div
    sx={{
      justifyContent: `space-between`,
      alignItems: `center`,
      flexFlow: `wrap`,
      boxSizing: `border-box`,
      display: `flex`,
      height: "51px",
    }}
  >
    <Box
      as={as as React.ElementType}
      sx={{
        fontWeight: 900,
        fontSize: [5, 6],
        fontFamily: `heading`,
        lineHeight: 1,
        color: `heading`,
      }}
      className={className}
    >
      {text}
    </Box>
    <StyledMore
      sx={{
        color: `secondary`,
        // borderLeft: "1px solid black",
        a: {
          variant: `links.secondary`,
        },
      }}
    >
      <img src={Plus} />
    </StyledMore>
  </div>
);

export default Title;
