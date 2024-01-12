import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { singinInitialValues } from "../../../constants";
import { postApiServices } from "../../../apis/api";
import { apiRoutes } from "../../../apis/apiPath";
import { useMutation } from "@tanstack/react-query";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/routePath";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  height: "100vh",
}));

const StyledInput = styled("input")(({ theme }) => ({
  padding: "1.1% 1.5%",
  width: "27%",
  borderRadius: "100px",
  fontSize: "18px",
  margin: ".8%",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#2c7aef",
  fontFamily: "Poppins",
  backgroundColor: "#F5F5F5",
  boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.1)",
  boxSizing: "border-box",
}));
const StyledButton = styled(Button)(({ theme }) => ({
  padding: "1.1% 1.5%",
  width: "27%",
  borderRadius: "100px",
  color: "white",
  fontSize: "18px",
  margin: ".8%",
  backgroundColor: "#2c7aef",
  fontFamily: "Poppins",
}));
const LoginText = styled(Typography)(({ theme }) => ({
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: 16,
  fontFamily: "Poppins",
}));

export const Singin = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [values, setValues] = useState(singinInitialValues);

  const onChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const login = useMutation({
    mutationFn: () => postApiServices(apiRoutes.login, values),
    onSuccess: ({ data }) => {
      cookies.set("token", data?.token, { path: "/" });
      navigate(ROUTE_PATHS.COMPANY_LIST);
    },
  });

  const handleSubmit = () => {
    if (!Object.values(values)?.every((val) => val !== "")) {
      return alert("Please fill all the fields");
    } else {
      login.mutate();
    }
  };

  return (
    <Container>
      <LoginText>Login</LoginText>
      <StyledInput
        name="username"
        type="text"
        placeholder="User Name"
        value={values?.username}
        onChange={onChange}
      />
      <StyledInput
        name="password"
        type="password"
        placeholder="Password"
        value={values?.password}
        onChange={onChange}
      />
      <StyledInput
        name="tenantName"
        type="text"
        placeholder="Tenant Name"
        value={values?.tenantName}
        onChange={onChange}
      />
      <StyledButton variant="contained" onClick={handleSubmit}>
        Login
      </StyledButton>
    </Container>
  );
};
