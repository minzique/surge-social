import { IUserResponse } from "@/dtos/user.dto";

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  username: string;
}

// Endpoint response types

// /api/login
export interface LoginResponse {
  user: IUserResponse;
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
}
// api/register
export interface RegisterResponse extends LoginResponse {

}

// User Types

export interface GetProfileResponse{
  user: IUserResponse;
}


// Post Types
export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
  };
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export type SortBy = 'createdAt' | 'likes';
export type SortOrder = 'asc' | 'desc';

export interface PostQueryParams {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

// Common Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}
