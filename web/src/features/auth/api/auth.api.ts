import { http } from "@/shared/api/http";
import { API_ENDPOINTS } from "@/shared/constants/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  SessionResponse,
} from "../types/auth.types";

export const authService = {
  register(payload: RegisterRequest) {
    return http.post<RegisterResponse, RegisterRequest>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload,
    );
  },
  login(payload: LoginRequest) {
    return http.post<AuthResponse, LoginRequest>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
  },
  refresh() {
    return http.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
  },
  me() {
    return http.get<SessionResponse>(API_ENDPOINTS.AUTH.ME);
  },
  logout() {
    return http.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
