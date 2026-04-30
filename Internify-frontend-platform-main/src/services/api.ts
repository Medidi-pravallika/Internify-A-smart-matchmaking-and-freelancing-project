
import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Helper function to decode JWT token and check expiration
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    console.log('🕒 Token expiry:', new Date(payload.exp * 1000).toLocaleString());
    console.log('🕒 Current time:', new Date(currentTime * 1000).toLocaleString());
    return payload.exp < currentTime;
  } catch (error) {
    console.error('❌ Error decoding token:', error);
    return true;
  }
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          // TEMPORARILY DISABLE automatic expiration check to debug 401 errors
          // Let's see if the issue is token format or backend validation
          /*
          if (isTokenExpired(token)) {
            console.warn('⚠️ Token is expired! Please login again.');
            localStorage.removeItem('token');
            localStorage.removeUser('user');
            window.location.href = '/login';
            return Promise.reject(new Error('Token expired'));
          }
          */
          
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Adding token to request:', config.url);
          console.log('🔐 Token value:', token.substring(0, 20) + '...');
          console.log('🔐 Full Authorization header:', `Bearer ${token.substring(0, 30)}...`);
          
          // Debug: Check token expiration and payload details
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            const isExpired = payload.exp < currentTime;
            console.log('🕒 Token debug - Expires:', new Date(payload.exp * 1000).toLocaleString());
            console.log('🕒 Token debug - Current:', new Date().toLocaleString());
            console.log('🕒 Token debug - Is expired:', isExpired);
            console.log('🕒 Token payload details:', {
              sub: payload.sub,
              roles: payload.roles || payload.authorities || payload.role,
              iat: payload.iat,
              exp: payload.exp,
              iss: payload.iss
            });
            
            // Check if role format is correct for Spring Security
            const userRoles = payload.roles || payload.authorities || [];
            const hasRecruiterRole = userRoles.includes('ROLE_RECRUITER') || userRoles.includes('RECRUITER');
            console.log('🔍 Role check in token - Has RECRUITER role:', hasRecruiterRole);
            console.log('🔍 Role check in token - All roles:', userRoles);
          } catch (error) {
            console.error('❌ Token debug error:', error);
          }
        } else {
          console.warn('⚠️ No token found for request:', config.url);
        }
        
        // For multipart/form-data requests, remove the default application/json Content-Type
        // and let the browser set the proper multipart boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
          console.log('📁 Multipart request detected - removing Content-Type header');
          console.log('📁 Headers after modification:', config.headers);
        }
        
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', response.config.url, response.status);
        return response;
      },
      (error: AxiosError<ApiError>) => {
        console.error('❌ API Error:', error.config?.url, error.response?.status, error.response?.data);
        console.error('❌ Request headers were:', error.config?.headers);
        console.error('❌ Request method:', error.config?.method);
        console.error('❌ Request data type:', error.config?.data instanceof FormData ? 'FormData' : typeof error.config?.data);
        
        // Handle 401 errors - but don't automatically redirect for now
        if (error.response?.status === 401) {
          console.warn('🚫 Unauthorized - Debug mode: not auto-redirecting');
          const token = localStorage.getItem('token');
          if (token) {
            console.warn('🚫 Token exists but server rejects it');
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              const isExpired = payload.exp < currentTime;
              console.warn('🚫 Token expiration check:', isExpired ? 'EXPIRED' : 'VALID');
              console.warn('🚫 Token payload:', payload);
            } catch (e) {
              console.warn('🚫 Cannot decode token:', e);
            }
          } else {
            console.warn('🚫 No token found for 401 request');
          }
          
          // Log the full error details for debugging
          console.error('🚫 401 Error Details:');
          console.error('- URL:', error.config?.url);
          console.error('- Method:', error.config?.method);
          console.error('- Request Headers:', error.config?.headers);
          console.error('- Request Data Type:', error.config?.data?.constructor?.name);
          console.error('- Response Status:', error.response?.status);
          console.error('- Response Headers:', error.response?.headers);
          console.error('- Response Data:', error.response?.data);
          console.error('- Response Status Text:', error.response?.statusText);
        }
        return Promise.reject(error);
      }
    );
  }

  getApi() {
    return this.api;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      console.warn('⚠️ Token expired during authentication check');
      this.clearAuth();
      return false;
    }
    
    return true;
  }

  // Method to check token status for debugging
  checkTokenStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    console.log('🔍 Token Status Check:');
    console.log('- Token exists:', !!token);
    console.log('- User data:', user);
    console.log('- Role:', role);
    
    if (token) {
      console.log('- Token expired:', isTokenExpired(token));
      console.log('- Token preview:', token.substring(0, 30) + '...');
    }
    
    return {
      hasToken: !!token,
      isExpired: token ? isTokenExpired(token) : true,
      user,
      role
    };
  }

  getRole() {
    return localStorage.getItem('role');
  }
}

export const apiService = new ApiService();
export const api = apiService.getApi();

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Check if it's a network error
    if (!error.response) {
      return 'Network error: Unable to connect to server. Please check if the backend is running.';
    }
    
    // Check for specific error messages from backend
    const message = error.response?.data?.message || 
                   error.response?.data?.error ||
                   error.response?.data ||
                   error.message;
    
    // Handle specific status codes
    if (error.response?.status === 401) {
      return 'Unauthorized: Please login again';
    }
    if (error.response?.status === 403) {
      return 'Forbidden: You don\'t have permission to access this resource';
    }
    if (error.response?.status === 404) {
      return 'Not found: The requested resource doesn\'t exist';
    }
    if (error.response?.status === 500) {
      return 'Server error: Please try again later';
    }
    
    return typeof message === 'string' ? message : 'An error occurred';
  }
  return 'An unexpected error occurred';
};
