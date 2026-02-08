import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export type { AxiosError };
