import React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "../routes/routes";
import { Singin } from "./pages/login/Singin";
import ProtectedRoute from "./pages/login/protectedRoute";

export const Root = () => {
  const routeMapping = (path, Component, exact, nestedRoutes, index) => {
    return (
      <Route path={path} element={<Component />} exact={exact} key={index}>
        {nestedRoutes &&
          nestedRoutes.map(({ path, Component, exact, nestedRoutes }, index) =>
            routeMapping(path, Component, exact, nestedRoutes, index)
          )}
      </Route>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Singin />} />
      <Route path="/" element={<ProtectedRoute />}>
        {routes.map(({ path, Component, exact, nestedRoutes }, index) =>
          routeMapping(path, Component, exact, nestedRoutes, index)
        )}
      </Route>
    </Routes>
  );
};
