import { Index } from "../components/pages/companies";
import { ROUTE_PATHS } from "./routePath";

export const routes = [
  {
    path: ROUTE_PATHS.COMPANY_LIST,
    Component: Index,
    exact: true,
  },
];
