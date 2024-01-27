import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";

export const SplitContainer = styled(Box)(({ theme }) => ({
  minHeight: "100%",
  width: "35%",
  backgroundColor: "white",
  borderRadius: 14,
  boxSizing: "border-box",
  position: "relative",
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: "bold",
  margin: "20px 0",
  boxSizing: "border-box",
}));

export const StyledHeader = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: "bold",
  color: "white",
  marginBottom: "1%",
}));

export const ListBox = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  borderTopWidth: 1,
  borderTopStyle: "solid",
  borderTopColor: "#bdbdbd",
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderBottomColor: "#bdbdbd",
}));
