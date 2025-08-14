import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService } from "@/services";
import { ApiClientError } from "@/lib/apiClient";
import type { User, RegisterRequest, LoginRequest } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
  clearError: () => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Helper functions to update state
  const setUser = (user: User | null) => {
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      error: null,
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setError(null);
  };

  // Check authentication status on app load
  const checkAuth = async () => {
    const token = authService.getToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.verify();
      if (response.valid) {
        setUser(response.user);
      } else {
        authService.removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.removeToken();
      setUser(null);
      
      // Don't show error for expired tokens
      if (error instanceof ApiClientError && error.isUnauthorized()) {
        // Token expired, silently log out
      } else {
        setError('Authentication check failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      const message = error instanceof ApiClientError 
        ? (Array.isArray(error.message) ? error.message.join(', ') : error.message)
        : 'Login failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      const message = error instanceof ApiClientError 
        ? (Array.isArray(error.message) ? error.message.join(', ') : error.message)
        : 'Registration failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login
  const googleLogin = () => {
    setError(null);
    window.location.href = authService.getGoogleAuthUrl();
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  // Refetch user data
  const refetch = async () => {
    setLoading(true);
    try {
      await checkAuth();
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth callback on mount
  useEffect(() => {
    const handleGoogleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const error = urlParams.get('error');
      
      if (token) {
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        authService.setToken(token);
        checkAuth();
      } else if (error) {
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        setError('Google login failed: ' + error);
        setLoading(false);
      } else {
        checkAuth();
      }
    };

    handleGoogleCallback();
  }, []);

  // Handle token changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          // Token added/changed in another tab
          checkAuth();
        } else {
          // Token removed in another tab
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auto-refresh token periodically (optional)
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(() => {
      checkAuth().catch(console.error);
    }, 15 * 60 * 1000); // Check every 15 minutes

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    googleLogin,
    clearError,
    refetch,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Custom hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page or show login modal
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);
  
  return { isAuthenticated, isLoading };
}

// Custom hook for guest routes (login/register pages)
export function useGuestOnly() {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to dashboard
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);
  
  return { isAuthenticated, isLoading };
}
