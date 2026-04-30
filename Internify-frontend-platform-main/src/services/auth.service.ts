import { api, apiService } from './api';
import type { AuthResponse, StudentRegisterRequest, RecruiterRegisterRequest, AdminRegisterRequest } from '../types';

export const authService = {
  /**
   * Login user with email and password
   * POST /api/auth/login
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<any>('/api/auth/login', { email, password });
    const { token, userType, userId } = response.data;

    console.log('>>> Login response:', response.data);

    // Store authentication data
    apiService.setToken(token);
    localStorage.setItem('role', userType); // Backend returns 'userType' not 'role'
    localStorage.setItem('email', email);
    localStorage.setItem('userId', userId);
    
    // Store user data object (this was missing!)
    const userData = {
      id: userId,
      email: email,
      role: userType
    };
    localStorage.setItem('user', JSON.stringify(userData));

    console.log('>>> Stored in localStorage:');
    console.log('- token:', !!token);
    console.log('- role:', userType);
    console.log('- email:', email);
    console.log('- userId:', userId);
    console.log('- user:', JSON.stringify(userData));

    // Return normalized response
    return {
      token,
      role: userType,
      email
    };
  },

  /**
   * Register a new student
   * POST /api/auth/register/student
   */
  async registerStudent(name: string, email: string, password: string): Promise<string> {
    const response = await api.post<string>('/api/auth/register/student', {
      name,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register a new recruiter
   * POST /api/auth/register/recruiter
   */
  async registerRecruiter(
    organizationName: string,
    organizationType: string,
    email: string,
    password: string
  ): Promise<string> {
    const response = await api.post<string>('/api/auth/register/recruiter', {
      organizationName,
      organizationType,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register a new admin (for internal use)
   * POST /api/auth/register/admin
   */
  async registerAdmin(email: string, password: string): Promise<string> {
    const response = await api.post<string>('/api/auth/register/admin', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Logout user and clear authentication data
   */
  logout() {
    apiService.clearAuth();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  },

  /**
   * Get current user role
   */
  getRole(): string | null {
    return apiService.getRole();
  },
};
