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
import { ROUTE_PATHS } from "../../routes/routePath";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "../../apis/apiPath";
import { getWithQueryApiServices } from "../../apis/api";
import Cookies from "universal-cookie";

const navbarItems = [
  {
    Icon: <GridViewIcon style={{ color: "#4b4b4c" }} />,
    label: "Categories",
    path: ROUTE_PATHS.CATEGORY_LIST,
  },
  {
    Icon: <ApartmentIcon style={{ color: "#4b4b4c" }} />,
    label: "Company",
    path: ROUTE_PATHS.COMPANY_LIST,
  },
  {
    Icon: <PeopleOutlineIcon style={{ color: "#4b4b4c" }} />,
    label: "User",
    path: ROUTE_PATHS.ADD_USERS,
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
  const navigate = useNavigate();
  const cookies = new Cookies();
  const defaultcompany = cookies.get("defaultcompany");

  const [currentCompany, setCurrentCompany] = React.useState(
    defaultcompany || ""
  );

  const { data } = useQuery({
    queryKey: ["companyLists"],
    queryFn: () =>
      getWithQueryApiServices(apiRoutes.GET_COMPANY_LIST, `pageNumber=1`),
  });

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
              name="currentCompany"
              inputValues={data?.data?.list || []}
              value={currentCompany || ""}
              accept="companyID"
              onChange={(e) => setCurrentCompany(e.target.value)}
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
            {navbarItems?.map(({ Icon, label, path }) => (
              <IconButton onClick={() => path && navigate(path)}>
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
              </IconButton>
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
