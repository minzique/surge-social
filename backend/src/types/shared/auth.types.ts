export interface LoginRequest {
  email: string;
  password: string;
}

// Auth-specific types
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
}

// Login/Register request types
export interface LoginRequest {
  email: string;
  password: string;

}

export interface RegisterRequest extends LoginRequest {
  username: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
