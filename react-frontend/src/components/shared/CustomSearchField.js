import React, { useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  // borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  height: "30px",
  padding: 3,
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledCancelIcon = styled(CancelIcon)(({ theme }) => ({
  height: "20px",
  width: "20px",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  boxSizing: "border-box",
  paddingRight: "12px",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
  },
  height: "30px",
}));

export function CustomSearchField({ searchDebounce }) {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const pathName = location.pathname;
  // const pageParams = parseQueryParams(location?.search);
  // const search = location.search;
  // const searchParam = useMemo(() => new URLSearchParams(search), [search]);
  // const searchdata = searchParam?.get("search");

  // const [value, setValue] = useState("");

  // const clearSearch = () => {
  //   const data = {
  //     ...pageParams,
  //   };
  //   delete data?.search;

  //   setValue("");
  //   navigate({
  //     pathName: `${pathName}`,
  //     search: `?${createSearchParams({
  //       ...data,
  //     })}`,
  //   });
  // };

  // const searchDebounceNavigate = (e) => {
  //   let getDetails = setTimeout(() => {
  //     navigate({
  //       pathName: `${pathName}`,
  //       search: `?${createSearchParams({
  //         ...pageParams,
  //         search: e.target.value,
  //         currentPage: 1,
  //         pageSize: 10,
  //       })}`,
  //     });
  //   }, 1500);

  //   return () => clearTimeout(getDetails);
  // };

  // const handleChange = (e) => {
  //   setValue(e.target.value);
  //   if (!e.target.value && !searchDebounce) {
  //     clearSearch();
  //   }

  //   if (searchDebounce) {
  //     searchDebounceNavigate(e);
  //   }
  // };

  // const onSearchChange = (e) => {
  //   if (e.charCode === 13) {
  //     navigate({
  //       pathName: `${pathName}`,
  //       search: `?${createSearchParams({
  //         ...pageParams,
  //         search: e.target.value,
  //         currentPage: 1,
  //         pageSize: 10,
  //       })}`,
  //     });
  //   }
  // };

  // useEffect(() => setValue(""), [pathName]);
  // useEffect(() => {
  //   if (searchdata) {
  //     setValue(searchdata);
  //   }
  // }, [searchdata]);

  return (
    <Search
      style={{
        // backgroundColor: "#ffff",
        width: "250px",
        borderRadius: 4,
        borderColor: "#bdbdbd",
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      <SearchIconWrapper>
        <SearchIcon style={{ color: "#bdbdbd" }} />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        name="searchValue"
        // value={value}
        // onChange={handleChange}
        // onKeyPress={(e) => onSearchChange(e)}
        autoComplete="off"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              edge="end"
              // onClick={clearSearch}
            >
              {/* {value && <StyledCancelIcon />} */}
            </IconButton>
          </InputAdornment>
        }
      />
    </Search>
  );
}
