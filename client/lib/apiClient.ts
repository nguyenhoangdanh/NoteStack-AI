// ===== TYPES =====
interface RequestConfig extends RequestInit {
  params?: Record<string, any>; // Changed from Record<string, string | number | boolean>
  timeout?: number;
}

interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
  details?: any;
}

interface StreamResponse {
  stream: ReadableStream<Uint8Array>;
  citations: Array<{ title: string; heading: string | null }>;
}

// ===== API CLIENT CLASS =====
export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 30000; // 30 seconds
  private authToken: string | null = null;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:3001/api') {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    console.log(`API Client initialized with base URL: ${this.baseURL}`);
  }

  // ===== AUTH TOKEN MANAGEMENT =====
  setAuthToken(token: string) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getAuthToken(): string | null {
    if (this.authToken) return this.authToken;
    
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('auth_token');
    }
    
    return this.authToken;
  }

  removeAuthToken() {
    this.authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // ===== PRIVATE HELPERS =====
  private buildHeaders(config: RequestConfig = {}, includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers as Record<string, string>,
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${endpoint}`;
    
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle arrays and objects properly
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else if (typeof value === 'object') {
          // For nested objects, stringify them
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const paramString = searchParams.toString();
    return paramString ? `${url}?${paramString}` : url;
  }

  private async executeRequest<T>(
    url: string,
    config: RequestConfig,
    includeAuth: boolean = true
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = config.timeout || this.defaultTimeout;

    // Setup timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        ...config,
        headers: this.buildHeaders(config, includeAuth),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
          error: 'Network Error',
          statusCode: response.status,
        }));
        
        throw new ApiClientError(errorData.message, errorData.statusCode, errorData);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new ApiClientError('Request timeout', 408, { timeout });
      }
      
      // Network or parsing errors
      throw new ApiClientError(
        'Network error or server unavailable',
        0,
        { originalError: error }
      );
    }
  }

  // ===== PUBLIC API METHODS =====

  // GET request
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = this.buildURL(endpoint, params);
    
    return this.executeRequest<T>(url, {
      method: 'GET',
      ...requestConfig,
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = this.buildURL(endpoint, params);
    
    return this.executeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...requestConfig,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = this.buildURL(endpoint, params);
    
    return this.executeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...requestConfig,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = this.buildURL(endpoint, params);
    
    return this.executeRequest<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...requestConfig,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = this.buildURL(endpoint, params);
    
    return this.executeRequest<T>(url, {
      method: 'DELETE',
      ...requestConfig,
    });
  }

  // ===== SPECIALIZED METHODS =====

  // File upload
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers = this.buildHeaders({}, true);
    delete headers['Content-Type']; // Let browser set multipart/form-data

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: 'Upload failed',
          error: 'Upload Error',
          statusCode: response.status,
        }));
        throw new ApiClientError(errorData.message, errorData.statusCode, errorData);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      throw new ApiClientError(
        'Upload failed',
        0,
        { originalError: error }
      );
    }
  }

  // Stream request for chat
  async stream(endpoint: string, data?: any, config: RequestConfig = {}): Promise<StreamResponse> {
    const { params, ...requestConfig } = config;
    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders(config, true);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...requestConfig,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'Stream request failed',
        error: 'Stream Error',
        statusCode: response.status,
      }));
      throw new ApiClientError(errorData.message, errorData.statusCode, errorData);
    }

    // Extract citations from headers
    const citations = JSON.parse(
      response.headers.get('X-Citations') || '[]'
    );

    return {
      stream: response.body!,
      citations,
    };
  }

  // Request without auth
  async publicGet<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = this.buildURL(endpoint, params);
    
    return this.executeRequest<T>(url, {
      method: 'GET',
      ...requestConfig,
    }, false);
  }

  async publicPost<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    const url = this.buildURL(endpoint, params);
    
    return this.executeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...requestConfig,
    }, false);
  }

  // ===== UTILITY METHODS =====

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Set base URL (useful for different environments)
  setBaseURL(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  // Set default timeout
  setTimeout(timeout: number) {
    this.defaultTimeout = timeout;
  }

  // Get Google OAuth URL
  getGoogleAuthUrl(): string {
    return `${this.baseURL}/api/auth/google`;
  }
}

// ===== ERROR CLASS =====
export class ApiClientError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string | string[], statusCode: number, details?: any) {
    const errorMessage = Array.isArray(message) ? message.join(', ') : message;
    super(errorMessage);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.details = details;
  }

  // Helper methods for common error checks
  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  isTimeout(): boolean {
    return this.statusCode === 408;
  }
}

// ===== SINGLETON INSTANCE =====
export const apiClient = new ApiClient();

// ===== DEFAULT EXPORT =====
export default apiClient;
