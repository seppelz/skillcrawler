import { apiClient } from '../client';
import { setAuthToken, removeAuthToken } from '../config';

/**
 * Authentication service for user login, registration, and account management
 */
export interface UserRegistrationDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginCredentials {
  username: string; // Using username as API expects it in this format
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
}

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData: UserRegistrationDto): Promise<UserProfile> => {
    // Use direct fetch instead of apiClient for consistency with login method
    console.log('Registration payload:', {...userData, password: '***'});
    
    try {
      // Import API_URL directly from config
      const { API_URL } = await import('../config');
      console.log('Making registration request to backend:', `${API_URL}/register`);
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        // Add credentials to ensure cookies are sent with the request
        credentials: 'include',
      });

      console.log('Registration response status:', response.status);
      
      // Log response headers for debugging
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration error response:', errorText);
        let errorObj: any = {};
        try {
          errorObj = JSON.parse(errorText);
        } catch (e) {
          console.error('Failed to parse error response as JSON');
        }
        throw new Error(errorObj?.detail || 'Registration failed with status: ' + response.status);
      }

      const data = await response.json();
      console.log('Registration successful, received data:', data);
      return data;
    } catch (error) {
      console.error('Error during registration fetch operation:', error);
      throw error;
    }
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Create form data for OAuth2 password flow
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    console.log('Attempting login for:', credentials.username);
    
    try {
      // Import API_URL directly from config
      const { API_URL } = await import('../config');
      console.log('Making login request to:', `${API_URL}/token`);
      
      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        credentials: 'include',
      });

      console.log('Login response status:', response.status);

      // Log response headers for debugging
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Login response headers:', headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error raw response:', errorText);
        
        let errorData: any = {};
        try {
          errorData = JSON.parse(errorText);
          console.error('Login error parsed:', errorData);
        } catch (e) {
          console.error('Failed to parse error response as JSON');
        }
        
        throw new Error(errorData?.detail || `Login failed with status: ${response.status}`);
      }

      const tokenData = await response.json();
      console.log('Login successful, token received');
      setAuthToken(tokenData.access_token);
      return tokenData;
    } catch (error) {
      console.error('Error during login:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error details:', error);
      throw error;
    }
  },

  /**
   * Logout current user
   */
  logout: (): void => {
    removeAuthToken();
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<UserProfile> => {
    return await apiClient.get<UserProfile>('/me');
  },
};
