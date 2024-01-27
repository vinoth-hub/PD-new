import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { ROUTE_PATHS } from "../../../routes/routePath";
import { Layout } from "../../shared/Layout";

export const ProtectedRoute = () => {
  const cookies = new Cookies();
  const auth = cookies.get("token");

  return auth ? <Layout /> : <Navigate to={ROUTE_PATHS.LOGIN} />;
};

export default ProtectedRoute;
