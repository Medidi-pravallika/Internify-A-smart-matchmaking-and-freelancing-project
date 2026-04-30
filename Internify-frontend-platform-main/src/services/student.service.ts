import { api } from './api';
import type { Student, Internship, Freelance, Application, Review } from '../types';

export const studentService = {
  /**
   * GET /api/students/me - Get student profile
   */
  async getProfile(): Promise<Student> {
    const response = await api.get<Student>('/api/students/me');
    return response.data;
  },

  /**
   * PUT /api/students/me - Update student profile (with resume upload)
   * Backend expects: multipart/form-data with 'profile' and 'resume' parts
   */
  async updateProfile(data: Partial<Student>, resumeFile?: File): Promise<Student> {
    const formData = new FormData();
    
    // Add profile data as JSON
    const profileBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('profile', profileBlob);
    
    // Add resume file if provided
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    
    const response = await api.put<Student>('/api/students/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * GET /api/students/internships - Browse active internships
   */
  async getInternships(): Promise<Internship[]> {
    const response = await api.get<Internship[]>('/api/students/internships');
    return response.data;
  },

  /**
   * GET /api/students/freelance - Browse freelance gigs
   */
  async getFreelanceGigs(): Promise<Freelance[]> {
    const response = await api.get<Freelance[]>('/api/students/freelance');
    return response.data;
  },

  /**
   * POST /api/students/internships/{id}/apply - Apply to internship
   */
  async applyToInternship(internshipId: number): Promise<Application> {
    const response = await api.post<Application>(`/api/students/internships/${internshipId}/apply`);
    return response.data;
  },

  /**
   * POST /api/students/freelance/{id}/apply - Apply to freelance gig
   */
  async applyToFreelance(freelanceId: number): Promise<Application> {
    const response = await api.post<Application>(`/api/students/freelance/${freelanceId}/apply`);
    return response.data;
  },

  /**
   * GET /api/students/applications - Get my internship applications
   */
  async getMyApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>('/api/students/applications');
    return response.data;
  },

  /**
   * GET /api/students/freelance/applications - Get my freelance applications
   */
  async getMyFreelanceApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>('/api/students/freelance/applications');
    return response.data;
  },

  /**
   * POST /api/match/student - Get AI recommendations (legacy endpoint)
   */
  async getRecommendations(resumeFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const response = await api.post<string>('/api/match/student', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * POST /api/match/student/recommendations - Get ML recommendations with match scores
   */
  async getRecommendationsWithScores(resumeFile: File): Promise<{
    internships: Array<{
      id: number;
      title: string;
      description: string;
      type: string;
      status: string;
      matchScore: number | null;
    }>;
    freelance: Array<{
      id: number;
      title: string;
      description: string;
      type: string;
      status: string;
      matchScore: number;
    }>;
  }> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    const response = await api.post<any>('/api/match/student/recommendations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * POST /api/reviews - Submit review for recruiter
   */
  async submitReview(reviewedUserId: number, rating: number, comment: string, internshipId?: number): Promise<Review> {
    console.log('>>> Student service - Submitting review for user:', reviewedUserId);
    console.log('>>> Current token:', localStorage.getItem('token') ? 'Token exists' : 'No token');
    const response = await api.post<Review>('/api/reviews', {
      revieweeId: reviewedUserId,
      rating,
      comment,
      internshipId,
    });
    return response.data;
  },
};
