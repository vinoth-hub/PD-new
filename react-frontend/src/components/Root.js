import React from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./shared/Layout";
import { routes } from "../routes/routes";
import { Singin } from "./pages/login/Singin";

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
      <Route
        path="/"
        element={<Layout />}
        // element={
        //   auth ? <Layout /> : <Navigate to={ROUTE_PATHS.login} /> // to protect route
        // }
      >
        {routes.map(({ path, Component, exact, nestedRoutes }, index) =>
          routeMapping(path, Component, exact, nestedRoutes, index)
        )}
      </Route>
    </Routes>
  );
};
