// Common type definitions for the InternConnect application

export interface User {
  id: string;
  sub?: string;
  email: string;
  name: string;
  role: 'student' | 'recruiter';
  username?: string;
}

export interface Session {
  user: User;
  expires: string;
}

export interface Opportunity {
  _id: string;
  title: string;
  company?: string;
  location: string;
  duration: string;
  stipend: string;
  deadline: string;
  recruiterUsername: string;
  recruiterId?: string;
  description?: string;
  type: string;
  workType: string;
  skills: string[];
  domain?: string;
  paid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  _id: string;
  opportunityId: string;
  studentId: string;
  studentUsername?: string;
  studentName?: string;
  studentEmail?: string;
  status: 'New' | 'Shortlisted' | 'Selected' | 'Rejected' | 'pending' | 'accepted' | 'rejected';
  appliedAt?: string;
  createdAt: string;
  message?: string;
  opportunity?: Opportunity;
  coverLetter?: string;
  resume?: string;
  recruiterId?: string;
}

export interface StudentProfile {
  _id: string;
  userId: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  course?: string;
  year?: string;
  department?: string;
  academicYear?: string;
  cgpa?: string;
  gpa?: string;
  skills: string[];
  interests: string[];
  bio?: string;
  resume?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  social?: {
    linkedin?: string;
    github?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface NextAuthParams {
  params: Promise<{ [key: string]: string | string[] }>;
}

export interface ApiRouteParams {
  params: Promise<{ [key: string]: string }>;
}
