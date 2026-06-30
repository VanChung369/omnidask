import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

export type ApiErrorResponse = {
  error?: string;
  message?: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

let accessToken: string | null = null;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export function setApiAccessToken(token: string) {
  accessToken = token;
}

export function clearApiAccessToken() {
  accessToken = null;
}

export function isApiError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return axios.isAxiosError<ApiErrorResponse>(error);
}

