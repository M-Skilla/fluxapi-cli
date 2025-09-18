import axios, { AxiosRequestConfig } from "axios";

const apiClient = axios.create({});

apiClient.interceptors.request.use((config) => {
    if (process.env.AUTH_TOKEN) {
        config.headers["Authorization"] = `Bearer ${process.env.AUTH_TOKEN}`;
    }
    return config;
});

apiClient.interceptors.request.use((config) => {
  config.headers["User-Agent"] = "fluxapi-cli/1.0.0";
  return config;
});

export async function apiRequest(config: AxiosRequestConfig) {
  return apiClient(config);
}
