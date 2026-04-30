import { api } from './api';
import type { User, Internship, Review } from '../types';

export const adminService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/api/admin/users');
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/api/admin/users/${id}`);
  },

  async getPendingInternships(): Promise<Internship[]> {
    const response = await api.get<Internship[]>('/api/admin/internships/pending');
    return response.data;
  },

  async deleteInternship(id: number): Promise<void> {
    await api.delete(`/api/admin/internships/${id}`);
  },

  async getUserReviews(userId: number): Promise<Review[]> {
    const response = await api.get<Review[]>(`/api/reviews/user/${userId}`);
    return response.data;
  },

  async deleteReview(id: number): Promise<void> {
    await api.delete(`/api/reviews/${id}`);
  },

  async getAnalytics(): Promise<{
    totalUsers: number;
    totalInternships: number;
    totalApplications: number;
    successRate: number;
  }> {
    const response = await api.get('/api/admin/analytics');
    return response.data;
  },

  // Review Management Functions
  async getAllReviews(): Promise<Review[]> {
    const response = await api.get<Review[]>('/api/admin/reviews');
    return response.data;
  },

  async approveReview(id: number): Promise<void> {
    await api.put(`/api/admin/reviews/${id}/approve`);
  },

  async rejectReview(id: number): Promise<void> {
    await api.put(`/api/admin/reviews/${id}/reject`);
  },

  async deleteReviewAdmin(id: number): Promise<void> {
    await api.delete(`/api/admin/reviews/${id}`);
  },
};
