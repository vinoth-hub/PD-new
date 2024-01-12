import React from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  height: "30px",
  //   padding: 3,
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
  right: 0,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  boxSizing: "border-box",
  paddingRight: "12px",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0.3)})`,
  },
  height: "30px",
}));

export const CommonSearch = ({ style, label, value, handleChange }) => {
  return (
    <Search
      style={{
        width: "200px",
        borderRadius: 4,
        borderColor: "#bdbdbd",
        borderWidth: 1,
        borderStyle: "solid",
        ...style,
      }}
    >
      <StyledInputBase
        placeholder={label || "Search…"}
        inputProps={{ "aria-label": "search" }}
        name="searchValue"
        value={value}
        onChange={handleChange}
        // onKeyPress={(e) => onSearchChange(e)}
        autoComplete="off"
      />
      <SearchIconWrapper>
        <SearchIcon style={{ color: "#bdbdbd" }} />
      </SearchIconWrapper>
    </Search>
  );
};
