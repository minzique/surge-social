import apiClient from "../lib/axios";
import { LoginCredentials, RegisterCredentials } from "../types/auth.types";
import { ApiResponse } from "../types/shared/api.types";
import { User } from "../types/auth.types";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
      
      // Store token if present in response data
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // Handle specific error cases
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error.message);
      }
      throw new Error("Failed to login. Please try again.");
    }
  },

  async register(data: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data);
      
      // Store token if present in response data
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error.message);
      }
      throw new Error("Failed to register. Please try again.");
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      // Always clear local storage on logout attempt
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        // Clear storage if unauthorized
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      throw error;
    }
  },

  // Helper method to check if user is logged in
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Helper method to get stored token
  getToken(): string | null {
    return localStorage.getItem("token");
  }
};
