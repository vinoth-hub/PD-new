import { appApi } from "./config";

//  get call
export const getApiServices = (path) => {
  return appApi.get(`${path}`);
};

// post call
export const postApiServices = (path, value) => {
  return appApi.post(`${path}`, value);
};

//  get call with query param
export const getWithQueryApiServices = (path, queryParam) => {
  return appApi.get(`${path}?${queryParam}`);
};

// put call
export const putApiServices = (path, value) => {
  return appApi.put(`${path}`, value);
};

// update call by id (put)
export const updateApiServices = (path, id, value) => {
  return appApi.put(`${path}/${id}`, value);
};

// delete api service
export const deleteApiServices = (path, id) => {
  return appApi.delete(`${path}/${id}`);
};
