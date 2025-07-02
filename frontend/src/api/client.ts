import { API_URL, DEFAULT_TIMEOUT, getDefaultHeaders } from './config';

/**
 * Generic API client for making HTTP requests to the backend
 */
class ApiClient {
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_URL}${endpoint}`);
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getDefaultHeaders(),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getDefaultHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getDefaultHeaders(),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Handle API responses and error cases
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.detail || 'An error occurred with the API request',
        errorData
      );
    }

    // For no content responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
  }
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
