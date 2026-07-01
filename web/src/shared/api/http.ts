import axios from "axios";
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

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

export async function get<TResponse>(url: string, config?: AxiosRequestConfig) {
  const response = await api.get<TResponse>(url, config);
  return response.data;
}

export async function post<TResponse, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig,
) {
  const response = await api.post<TResponse>(url, data, config);
  return response.data;
}

export async function put<TResponse, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig,
) {
  const response = await api.put<TResponse>(url, data, config);
  return response.data;
}

export async function patch<TResponse, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig,
) {
  const response = await api.patch<TResponse>(url, data, config);
  return response.data;
}

export async function del<TResponse>(url: string, config?: AxiosRequestConfig) {
  const response = await api.delete<TResponse>(url, config);
  return response.data;
}

export const http = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export function isApiError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> {
  return axios.isAxiosError<ApiErrorResponse>(error);
}
