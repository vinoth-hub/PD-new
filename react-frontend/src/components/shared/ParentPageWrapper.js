import styled from "@emotion/styled";
import { Box } from "@mui/material";
import React from "react";

const StyledBox = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 64px)",
  width: "100vw",
  backgroundColor: "#7285b3",
}));

export const ParentPageWrapper = (props) => {
  return <StyledBox>{props.children}</StyledBox>;
};
