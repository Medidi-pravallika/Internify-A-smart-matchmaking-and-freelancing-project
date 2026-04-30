import { api } from './api';
import type { Recruiter, Internship, Freelance, Application, Student, Review } from '../types';

export const recruiterService = {
  async getProfile(): Promise<Recruiter> {
    const response = await api.get<Recruiter>('/api/recruiters/me');
    return response.data;
  },

  async updateProfile(data: Partial<Recruiter>): Promise<Recruiter> {
    const response = await api.put<Recruiter>('/api/recruiters/me', data);
    return response.data;
  },

  async createInternship(internshipData: any, jdFile?: File): Promise<Internship> {
    console.log('>>> Creating internship with proper multipart data');
    
    // Debug: Check current authentication state
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    console.log('🔍 Pre-request authentication check:');
    console.log('- Token exists:', !!token);
    console.log('- User data:', user);
    console.log('- Stored role:', role);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const tokenRoles = payload.roles || payload.authorities || payload.role || [];
        console.log('- Token roles/authorities:', tokenRoles);
        console.log('- Token subject:', payload.sub);
        
        // Check if token has proper RECRUITER role
        const hasRecruiterRole = Array.isArray(tokenRoles) ? 
          tokenRoles.includes('ROLE_RECRUITER') || tokenRoles.includes('RECRUITER') :
          tokenRoles === 'ROLE_RECRUITER' || tokenRoles === 'RECRUITER';
        console.log('- Has RECRUITER role in token:', hasRecruiterRole);
        
      } catch (e) {
        console.error('- Error decoding token:', e);
      }
    }
    
    try {
      const formData = new FormData();
      const internshipBlob = new Blob([JSON.stringify(internshipData)], { type: 'application/json' });
      formData.append('internship', internshipBlob);
      
      if (jdFile) {
        formData.append('jd', jdFile);
      }
      
      console.log('>>> Posting to /api/recruiters/internships');
      const response = await api.post<Internship>('/api/recruiters/internships', formData);
      console.log('✅ SUCCESS!');
      return response.data;
      
    } catch (error) {
      console.error('>>> Failed to create internship:', error);
      
      if ((error as any).response?.status === 401) {
        console.error('🚫 401 AUTHORIZATION FAILED');
        console.error('🚫 This means your JWT token does not contain ROLE_RECRUITER authority');
        console.error('🚫 Check token payload above - roles/authorities should include ROLE_RECRUITER');
        
        throw new Error(`🚫 ROLE MISMATCH ERROR

Your account shows role='${role}' in localStorage but JWT token doesn't have ROLE_RECRUITER authority.

IMMEDIATE FIXES:
1. Logout and login again to refresh your token
2. Check if your account was properly assigned RECRUITER role in backend
3. Backend might expect 'ROLE_RECRUITER' but your token has '${role}'

Current stored role: ${role}
User data: ${user || 'null'}`);
      }
      
      throw error;
    }
  },

  // Debug function to test authentication
  async testAuthentication(): Promise<void> {
    console.log('>>> Testing authentication across different endpoints...');
    
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('>>> Local role:', role);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('>>> Token roles:', payload.roles || payload.authorities || payload.role);
      } catch (e) {
        console.error('>>> Token decode error:', e);
      }
    }

    // Test 1: Basic recruiter profile (should work if role is correct)
    try {
      console.log('>>> Test 1: GET /api/recruiters/me');
      const profile = await api.get('/api/recruiters/me');
      console.log('✅ Profile endpoint works:', profile.status);
    } catch (error) {
      console.error('❌ Profile endpoint failed:', error);
    }

    // Test 2: Get internships (should work if role is correct)  
    try {
      console.log('>>> Test 2: GET /api/recruiters/internships');
      const internships = await api.get('/api/recruiters/internships');
      console.log('✅ Get internships works:', internships.status);
    } catch (error) {
      console.error('❌ Get internships failed:', error);
    }

    // Test 3: Simple JSON POST to see if it's multipart issue
    try {
      console.log('>>> Test 3: Testing JSON POST to internships endpoint');
      const simpleData = {
        title: 'Test Internship',
        description: 'Test Description', 
        requirements: 'Test Requirements'
      };
      const jsonResponse = await api.post('/api/recruiters/internships', simpleData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ JSON POST works:', jsonResponse.status);
    } catch (error) {
      console.error('❌ JSON POST failed:', error);
      const errorResponse = (error as any).response;
      if (errorResponse?.status === 401) {
        console.error('>>> JSON POST also gets 401 - this is a role/auth issue, not multipart');
      } else if (errorResponse?.status === 400) {
        console.error('>>> JSON POST gets 400 - backend expects multipart, auth is working');
      } else {
        console.error('>>> JSON POST gets different error:', errorResponse?.status);
      }
    }

    // Test 4: Check what the backend actually expects
    try {
      console.log('>>> Test 4: Testing different endpoint patterns');
      const testData = {
        title: 'Test Internship Alt',
        description: 'Test Description Alt', 
        requirements: 'Test Requirements Alt'
      };
      // Maybe the endpoint is different?
      const altResponse = await api.post('/api/recruiters/internship', testData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ Alternative endpoint works:', altResponse.status);
    } catch (error) {
      console.error('❌ Alternative endpoint failed:', error);
    }
  },

  // Temporary test function - try creating internship with pure JSON
  async createInternshipJSON(internshipData: any): Promise<Internship> {
    console.log('>>> Testing internship creation with pure JSON');
    console.log('>>> Data:', internshipData);
    
    try {
      const response = await api.post<Internship>('/api/recruiters/internships', internshipData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ JSON internship creation works!');
      return response.data;
    } catch (error) {
      console.error('❌ JSON internship creation failed:', error);
      throw error;
    }
  },

  async createFreelance(freelanceData: any): Promise<Freelance> {
    console.log('>>> Recruiter service - Creating freelance:', freelanceData);

    const response = await api.post<Freelance>('/api/recruiters/freelance', freelanceData);
    return response.data;
  },

  async getInternships(): Promise<Internship[]> {
    const response = await api.get<Internship[]>('/api/recruiters/internships');
    return response.data;
  },

  async getFreelance(): Promise<Freelance[]> {
    const response = await api.get<Freelance[]>('/api/recruiters/freelance');
    return response.data;
  },

  /**
   * PUT /api/recruiters/internships/{id}/status - Update internship status
   */
  async updateInternshipStatus(internshipId: number, status: string): Promise<Internship> {
    const response = await api.put<Internship>(`/api/recruiters/internships/${internshipId}/status?status=${status}`);
    return response.data;
  },

  /**
   * PUT /api/recruiters/freelance/{id}/status - Update freelance status
   */
  async updateFreelanceStatus(freelanceId: number, status: string): Promise<Freelance> {
    const response = await api.put<Freelance>(`/api/recruiters/freelance/${freelanceId}/status?status=${status}`);
    return response.data;
  },

  /**
   * DELETE /api/recruiters/internships/{id} - Delete internship
   */
  async deleteInternship(internshipId: number): Promise<void> {
    console.log('>>> Deleting internship with ID:', internshipId);
    
    // First test if the token is still valid by checking profile
    try {
      console.log('>>> Testing token validity before delete...');
      await api.get('/api/recruiters/me');
      console.log('✅ Token is valid for profile access');
    } catch (profileError) {
      console.error('❌ Token invalid for profile access:', profileError);
      if ((profileError as any).response?.status === 401) {
        throw new Error('Your session has expired. Please logout and login again.');
      }
    }
    
    try {
      console.log('>>> Proceeding with internship deletion...');
      await api.delete(`/api/recruiters/internships/${internshipId}`);
      console.log('✅ Internship deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete internship:', error);
      console.error('❌ Error details:', {
        status: (error as any).response?.status,
        data: (error as any).response?.data,
        statusText: (error as any).response?.statusText
      });
      
      if ((error as any).response?.status === 401) {
        console.error('🚫 401 Unauthorized - Token/role issue when deleting internship');
        throw new Error('Authentication failed. Please login again as a RECRUITER.');
      }
      throw error;
    }
  },

  /**
   * DELETE /api/recruiters/freelance/{id} - Delete freelance gig
   */
  async deleteFreelance(freelanceId: number): Promise<void> {
    await api.delete(`/api/recruiters/freelance/${freelanceId}`);
  },

  /**
   * GET /api/recruiters/internships/{id}/applications - Get internship applicants
   */
  async getInternshipApplications(internshipId: number): Promise<Application[]> {
    const response = await api.get<Application[]>(`/api/recruiters/internships/${internshipId}/applications`);
    return response.data;
  },

  /**
   * GET /api/recruiters/freelance/{id}/applications - Get freelance applicants
   */
  async getFreelanceApplications(freelanceId: number): Promise<Application[]> {
    const response = await api.get<Application[]>(`/api/recruiters/freelance/${freelanceId}/applications`);
    return response.data;
  },

  /**
   * PUT /api/recruiters/applications/{id}/status - Update application status
   */
  async updateApplicationStatus(applicationId: number, status: string): Promise<Application> {
    const response = await api.put<Application>(`/api/recruiters/applications/${applicationId}/status?status=${status}`);
    return response.data;
  },

  /**
   * PUT /api/recruiters/freelance/applications/{id}/status - Update freelance application status
   */
  async updateFreelanceApplicationStatus(applicationId: number, status: string): Promise<Application> {
    const response = await api.put<Application>(`/api/recruiters/freelance/applications/${applicationId}/status?status=${status}`);
    return response.data;
  },

  async getMatchedStudents(file: File): Promise<Student[]> {
    const formData = new FormData();
    formData.append('jd', file);
    const response = await api.post<Student[]>('/api/match/recruiter', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async submitReview(reviewedUserId: number, rating: number, comment: string): Promise<Review> {
    console.log('>>> Recruiter service - Submitting review for user:', reviewedUserId);
    console.log('>>> Current token:', localStorage.getItem('token') ? 'Token exists' : 'No token');
    const response = await api.post<Review>('/api/reviews', {
      revieweeId: reviewedUserId,
      rating,
      comment,
    });
    return response.data;
  },
};
