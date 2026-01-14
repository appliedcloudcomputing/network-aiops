/**
 * Base API client for HTTP requests
 * Framework-agnostic implementation
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

const DEFAULT_CONFIG: RequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
};

class ApiClient {
  private baseUrl: string;
  private defaultConfig: RequestConfig;

  constructor(baseUrl: string = '', config: RequestConfig = {}) {
    this.baseUrl = baseUrl;
    this.defaultConfig = { ...DEFAULT_CONFIG, ...config };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultConfig.headers,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeout = options.timeout || this.defaultConfig.timeout;
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.message || response.statusText,
          code: errorData.code,
        } as ApiError;
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw {
          status: 408,
          message: 'Request timeout',
          code: 'TIMEOUT',
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...config });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config });
  }
}

export const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || '/api'
);

export default ApiClient;
