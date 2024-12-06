import React, { useState, useEffect, createContext, useContext } from 'react';
import { authApi } from '../api/auth';
import { User, AuthContextType, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import ReCaptchaV3 from '../lib/recaptcha';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const recaptcha = ReCaptchaV3.getInstance(RECAPTCHA_SITE_KEY);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        // Verify token with backend
        if (authApi.isAuthenticated()) {
          const response = await authApi.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        }
      } catch {
        // Clear invalid session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const captchaToken = await recaptcha.execute('login');
    const credentials: LoginCredentials = { email, password, captchaToken };
    const response = await authApi.login(credentials);
    
    if (response.success && response.data) {
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      throw new Error(response.error?.message || 'Login failed');
    }
  };

  const register = async (email: string, username: string, password: string) => {
    const captchaToken = await recaptcha.execute('register');
    const credentials: RegisterCredentials = { email, username, password, captchaToken };
    const response = await authApi.register(credentials);
    
    if (response.success && response.data) {
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      throw new Error(response.error?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
