import axios, { AxiosRequestConfig } from "axios";

export async function apiRequest(config: AxiosRequestConfig) {
  return axios(config);
}
