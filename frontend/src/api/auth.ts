import apiClient from "../lib/axios";
import { LoginCredentials, RegisterCredentials } from "../types/auth.types";
import { ApiResponse } from "../types/shared/api.types";
import { User } from "../types/auth.types";
import { AxiosError } from "axios";
import { LoginResponse, RegisterResponse } from "../types/shared/api.types";
interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}



export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        credentials
      );
      
      // Store token if present in response data
      if (response.data.success && response.data.data?.tokens) {
        this.setTokens(response.data.data.tokens);
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

  async register(data: RegisterCredentials): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>("/auth/register", data);
      
      // Store token if present in response data
      if (response.data.success && response.data.data?.tokens) {
        this.setTokens(response.data.data.tokens);
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
      this.clearTokens();
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
        this.clearTokens();
      }
      throw error;
    }
  },

  // Helper method to check if user is logged in
  isAuthenticated(): boolean {
    const token = localStorage.getItem("accessToken");
    return !!token;
  },

  // Helper method to get stored token
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  setTokens(tokens: { accessToken: string; refreshToken?: string }): void {
    localStorage.setItem("accessToken", tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
  }
};
