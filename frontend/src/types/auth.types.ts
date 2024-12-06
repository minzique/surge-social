export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  captchaToken: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}
