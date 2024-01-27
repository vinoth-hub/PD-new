import { appApi } from "./config";

//  get call
export const getApiServices = (path) => {
  return appApi.get(`${path}`);
};

// post call
export const postApiServices = (path, value) => {
  return appApi.post(`${path}`, value);
};

// post call with query param
export const postWithQueryApiServices = (path, queryParam, value) => {
  return appApi.post(`${path}?${queryParam}`, value);
};

//  get call with query param
export const getWithQueryApiServices = (path, queryParam) => {
  return appApi.get(`${path}?${queryParam}`);
};

// put call
export const putApiServices = (path, value) => {
  return appApi.put(`${path}`, value);
};

// put call
export const putWithQueryApiServices = (path, queryParam, value) => {
  return appApi.put(`${path}?${queryParam}`, value);
};

// update call by id (put)
export const updateApiServices = (path, id, value) => {
  return appApi.put(`${path}/${id}`, value);
};

// delete api service
export const deleteApiServices = (path, id) => {
  return appApi.delete(`${path}/${id}`);
};

// delete api service with queryparam
export const deletewithQueryApiServices = (path, queryParam, id) => {
  return appApi.delete(`${path}/${id}?${queryParam}`);
};
