import apiClient from "@/lib/axios";
import { LoginRequest, RegisterRequest, ApiResponse } from "@/types/shared/api.types";
import { AuthResponse } from "@/types/shared/auth.types";

export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
    
    // Store token if present in headers
    const token = response.headers.authorization;
    if (token) {
      localStorage.setItem("token", token);
    }
    
    return response.data;
  },

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data);
    
    // Store token if present in headers
    const token = response.headers.authorization;
    if (token) {
      localStorage.setItem("token", token);
    }
    
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
  },

  async getCurrentUser(): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.get<ApiResponse<AuthResponse>>("/auth/me");
    return response.data;
  },

  // Helper method to check if user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }
};
