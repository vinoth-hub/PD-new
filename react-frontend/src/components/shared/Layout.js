import React from "react";
import { Box } from "@mui/material";
import { useWindowHeight } from "@react-hook/window-size";
import { Outlet } from "react-router-dom";
import { styled } from "@mui/system";
import Navbar from "./Navbar";

const MainLayout = styled("div")(({ height }) => ({
  //   paddingTop: theme.spacing(8),
  //   height: height - 64,
}));

const BodyContainer = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
}));

const StyledLayout = styled(Box)(() => ({
  overflow: "auto",
  height: "100%",
  width: "100%",
}));

export function Layout() {
  const height = useWindowHeight();

  return (
    <MainLayout height={height}>
      <Navbar />
      <BodyContainer>
        <StyledLayout>
          <Outlet />
        </StyledLayout>
      </BodyContainer>
    </MainLayout>
  );
}
