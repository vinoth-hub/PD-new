import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const appApi = axios.create({
  baseURL: "http://localhost:42069/api/",

  responseType: "json",
  headers: {
    Accept: "application/json",
    "content-type": "application/json",
  },
});

appApi.interceptors.request.use(
  (config) => {
    config.headers["authorization"] = `Bearer ${cookies.get("token")}`;

    // store.dispatch(isLoading(true));
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

appApi.interceptors.response.use(
  (response) => {
    // store.dispatch(isLoading(false));
    return response;
  },
  async (error) => {
    // store.dispatch(isLoading(false));
    return Promise.reject(error);
  }
);
