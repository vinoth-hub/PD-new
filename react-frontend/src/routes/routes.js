import { Category } from "../components/pages/categories/Category";
import { Index } from "../components/pages/companies";
import { User } from "../components/pages/user/User";
import { ROUTE_PATHS } from "./routePath";

export const routes = [
  {
    path: ROUTE_PATHS.COMPANY_LIST,
    Component: Index,
    exact: true,
  },
  {
    path: ROUTE_PATHS.CATEGORY_LIST,
    Component: Category,
    exact: true,
  },
  {
    path: ROUTE_PATHS.ADD_USERS,
    Component: User,
    exact: true,
  },
];
