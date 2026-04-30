export interface User {
  id: number;
  email: string;
  role: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  name?: string;
  orgName?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  skills?: string;
  resume?: string;
  createdAt: string;
  matchScore?: number;
  // Application specific fields
  applicationId?: number;
  applicationStatus?: string;
  internshipId?: number;
  internshipTitle?: string;
}

export interface Recruiter {
  id: number;
  orgName: string;
  orgType: string;
  email: string;
  createdAt: string;
}

export interface Internship {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  jdPath?: string;
  postedBy?: any;
  postedDate?: string;
  status: string;
  // Optional fields that might not exist in backend
  duration?: string;
  skills?: string;
  location?: string;
  stipend?: number;
  recruiterId?: number;
  recruiterOrgName?: string;
  createdAt?: string;
}

export interface Freelance {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  postedBy?: any;
  postedDate?: string;
  status: string;
  // Optional fields that might not exist in backend
  budget?: number;
  duration?: string;
  skills?: string;
  recruiterId?: number;
  recruiterOrgName?: string;
  createdAt?: string;
}

export interface Application {
  id: number;
  studentId: number;
  studentName?: string;
  internshipId?: number;
  freelanceId?: number;
  status: 'APPLIED' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  title?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewer: {
    id: number;
    email?: string;
    name?: string; // For Student entities
    organizationName?: string; // For Recruiter entities
  };
  reviewee: {
    id: number;
    email?: string;
    name?: string; // For Student entities
    organizationName?: string; // For Recruiter entities
  };
  internship?: {
    id: number;
    title: string;
  };
  reviewDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
}

// Request DTOs for authentication APIs
export interface StudentRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RecruiterRegisterRequest {
  organizationName: string;
  organizationType: string;
  email: string;
  password: string;
}

export interface AdminRegisterRequest {
  email: string;
  password: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
