import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { CustomSelectField } from "./CustomSelectField";
import { CustomSearchField } from "./CustomSearchField";
import { Typography } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import GridViewIcon from "@mui/icons-material/GridView";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PublicIcon from "@mui/icons-material/Public";

const navbarItems = [
  {
    Icon: <GridViewIcon style={{ color: "#4b4b4c" }} />,
    label: "Categories",
  },
  {
    Icon: <ApartmentIcon style={{ color: "#4b4b4c" }} />,
    label: "Company",
  },
  {
    Icon: <PeopleOutlineIcon style={{ color: "#4b4b4c" }} />,
    label: "User",
  },
  {
    Icon: <QrCodeScannerIcon style={{ color: "#4b4b4c" }} />,
    label: "Scan",
  },
  {
    Icon: <DescriptionIcon style={{ color: "#4b4b4c" }} />,
    label: "Reporting",
  },
];

function Navbar() {
  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <PublicIcon
            color="primary"
            style={{ fontSize: 50, marginRight: 20 }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <CustomSelectField
              label="Current Company"
              style={{ width: "200px" }}
            />
            <CustomSearchField />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {navbarItems?.map(({ Icon, label }) => (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "0 16px",
                }}
              >
                {Icon}
                <Typography
                  style={{
                    fontSize: 14,
                    color: "#4b4b4c",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
            <NotificationsNoneIcon
              style={{ fontSize: "30px", marginRight: 20, color: "#4b4b4c" }}
            />
            <IconButton sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
