import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  companyName: string;
  jobTitle: string;
  companySize: string;
  industry: string;
  heardAboutUs: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface PricingPlan {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number; // in NGN
  features: string[];
  apiCallLimit: number;
  status: 'active' | 'inactive';
  popular?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Industry {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  order: number;
  createdAt: Date;
}

export interface ApiKey {
  _id?: ObjectId;
  userId: ObjectId;
  key: string; // full unhashed API key
  keyPrefix: string; // for display: ak_live_7721...x922
  name: string;
  industry: string;
  planId: ObjectId;
  url?: string; // website URL associated with this API key
  paymentId?: ObjectId; // link to payment that created this key
  transactionReference?: string; // transaction reference from payment
  status: 'active' | 'revoked' | 'warning';
  usage: number;
  limit: number;
  environment: 'production' | 'test';
  lastRotatedAt?: Date;
  createdAt: Date;
  revokedAt?: Date;
}

export interface Payment {
  _id?: ObjectId;
  userId: ObjectId;
  planId: ObjectId;
  industry: string;
  appName: string;
  url: string;
  email: string;
  amount: number; // in NGN
  currency: string;
  transactionReference: string; // Paystack reference
  status: 'pending' | 'success' | 'failed';
  paymentMethod?: string;
  paystackMetadata?: Record<string, any>;
  invoiceId: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface SupportTicket {
  _id?: ObjectId;
  userId: ObjectId;
  subject: string;
  description: string;
  affectedVertical: string; // industry
  priority: 'normal' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  responses?: Array<{
    message: string;
    userId: ObjectId;
    isAdmin: boolean;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface AuditLog {
  _id?: ObjectId;
  userId: ObjectId;
  action: string;
  resourceType: string;
  resourceId?: ObjectId;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface ApiUsage {
  _id?: ObjectId;
  apiKeyId: ObjectId;
  userId: ObjectId;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number; // ms
  timestamp: Date;
  industry: string;
}

