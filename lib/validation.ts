import { z } from 'zod';

// Auth schemas
export const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  country: z.string().min(1, 'Please select your country'),
  companyName: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  companySize: z.string().min(1, 'Please select company size'),
  industry: z.string().min(1, 'Please select industry'),
  heardAboutUs: z.string().min(1, 'Please tell us how you heard about us'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phoneNumber: z.string().min(10).optional(),
  country: z.string().optional(),
  companyName: z.string().min(2).optional(),
  jobTitle: z.string().min(2).optional(),
  companySize: z.string().optional(),
  industry: z.string().optional(),
});

// API Key schemas
export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required'),
  industry: z.string().min(1, 'Industry is required'),
  planId: z.string().min(1, 'Pricing plan is required'),
  environment: z.enum(['production', 'test']).default('production'),
});

export const updateApiKeySchema = z.object({
  name: z.string().min(1).optional(),
});

// Payment schemas
export const createPaymentSchema = z.object({
  planId: z.string().min(1, 'Pricing plan is required'),
  industry: z.string().min(1, 'Industry is required'),
  appName: z.string().min(1, 'Application name is required'),
  url: z.string().url('Please enter a valid URL'),
  email: z.string().email('Please enter a valid email address'),
});

// Support ticket schemas
export const createSupportTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  affectedVertical: z.string().min(1, 'Affected vertical is required'),
  priority: z.enum(['normal', 'high', 'critical']).default('normal'),
});

export const respondToTicketSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']),
});

