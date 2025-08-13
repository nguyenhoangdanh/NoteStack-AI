import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  name: string;
  email: string;
  image?: string;
  authProvider: "credentials" | "google";
  createdAt: number;
  updatedAt: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );

  const createUser = useMutation(api.auth.createUser);
  const authenticateUser = useMutation(api.auth.authenticateUser);
  const deleteSession = useMutation(api.auth.deleteSession);
  
  const userFromSession = useQuery(
    api.auth.validateSession,
    token ? { token } : "skip"
  );

  useEffect(() => {
    if (userFromSession) {
      setUser(userFromSession);
      setLoading(false);
    } else if (userFromSession === null && token) {
      // Session expired or invalid
      localStorage.removeItem("auth_token");
      setToken(null);
      setUser(null);
      setLoading(false);
    } else if (!token) {
      setLoading(false);
    }
  }, [userFromSession, token]);

  const login = async (email: string, password: string) => {
    try {
      const result = await authenticateUser({ email, password });
      localStorage.setItem("auth_token", result.token);
      setToken(result.token);
      setUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const userId = await createUser({
        name,
        email,
        password,
        authProvider: "credentials",
      });
      
      // Auto login after registration
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await deleteSession({ token });
      } catch (error) {
        console.error("Error deleting session:", error);
      }
      localStorage.removeItem("auth_token");
    }
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
