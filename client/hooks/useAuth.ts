import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from '../lib/api';
import { User, RegisterDto, LoginDto } from '../types/api.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const setUser = useCallback((user: User | null) => {
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      error: null,
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.auth.login({ email, password });
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user as User);
      return response;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Login failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const register = useCallback(async (data: RegisterDto) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.auth.register(data);
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user as User);
      return response;
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Registration failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
  }, [setUser]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.auth.verify();
      if (response.valid) {
        setUser(response.user);
      } else {
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const googleLogin = useCallback(() => {
    apiClient.auth.googleAuth();
  }, []);

  // Handle Google OAuth callback
  const handleGoogleCallback = useCallback(async (token: string) => {
    setLoading(true);
    try {
      localStorage.setItem('auth_token', token);
      await checkAuth();
    } catch (error) {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  }, [checkAuth, setError, setLoading]);

  useEffect(() => {
    // Check for Google OAuth token in URL on mount
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      handleGoogleCallback(token);
    } else {
      checkAuth();
    }
  }, [checkAuth, handleGoogleCallback]);

  return {
    ...state,
    login,
    register,
    logout,
    googleLogin,
    refetch: checkAuth,
  };
}
