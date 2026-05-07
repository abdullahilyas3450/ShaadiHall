"use client";

import { useState } from "react";
import api from "@/lib/api";
import { setTokens, clearTokens } from "@/lib/auth";
import { useAuthContext } from "@/store/authStore";
import { LoginRequest, UserCreate, User } from "@/types";

export const useAuth = () => {
  const { login: setAuthUser, logout: clearAuthUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", data);
      const { access_token, refresh_token, user } = response.data;
      setTokens(access_token, refresh_token);
      setAuthUser(user);
      return user;
    } catch (err: any) {
      const message = err.response?.data?.detail || "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: UserCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", data);
      const { access_token, refresh_token, user } = response.data;
      setTokens(access_token, refresh_token);
      setAuthUser(user);
      return user;
    } catch (err: any) {
      const message = err.response?.data?.detail || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // clearAuthUser() in the store already calls clearTokens() internally;
    // calling clearTokens() here too would be a double invocation.
    clearAuthUser();
  };

  return { login, register, logout, isLoading, error };
};
