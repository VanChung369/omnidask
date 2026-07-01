import { http } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import type { AuthResponse, LoginRequest } from "@/types/auth";

export const authService = {
  login(payload: LoginRequest) {
    return http.post<AuthResponse, LoginRequest>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
  },
};
