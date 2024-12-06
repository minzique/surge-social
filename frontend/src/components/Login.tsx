"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ReCaptchaV3 from "../lib/recaptcha";
import { AuthCard } from "./ui/auth-card";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    const recaptcha = ReCaptchaV3.getInstance(RECAPTCHA_SITE_KEY);
    recaptcha.loadScript().catch((error) => {
      console.error("Failed to load ReCAPTCHA:", error);
      setLoginError("Failed to initialize security check");
    });
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login error:", err);
      setLoginError(
        err instanceof Error 
          ? err.message 
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      name: "email",
      type: "text",
      value: email,
      placeholder: "Email",
      onChange: (value: string) => {
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: undefined }));
      },
      error: errors.email,
    },
    {
      name: "password",
      type: "password",
      value: password,
      placeholder: "Password",
      onChange: (value: string) => {
        setPassword(value);
        setErrors((prev) => ({ ...prev, password: undefined }));
      },
      error: errors.password,
    },
  ];

  return (
    <AuthCard
      isLoading={isLoading}
      error={loginError}
      onSubmit={handleSubmit}
      fields={fields}
      submitText="Log in"
      alternateText="Don't have an account?"
      alternateLinkText="Sign up"
      alternateLinkTo="/register"
    />
  );
}
