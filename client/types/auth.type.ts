// Base User type (matches backend User model)
export interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// Authentication request DTOs
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Authentication response types
export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface VerifyResponse {
  valid: boolean;
  user: User;
}

// Error response types
export interface AuthError {
  message: string | string[];
  error: string;
  statusCode: number;
}

// API response wrapper types
export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;
export type MeResponse = User;

// Form validation types (for react-hook-form)
export interface RegisterFormData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
