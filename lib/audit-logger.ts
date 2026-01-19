import { ObjectId } from 'mongodb';
import { getDb } from './mongodb';

export interface AuditLogData {
  userId: ObjectId | string;
  action: string;
  resourceType: string;
  resourceId?: ObjectId | string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(data: AuditLogData): Promise<void> {
  try {
    const db = await getDb();
    await db.collection('auditlogs').insertOne({
      userId: new ObjectId(data.userId),
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId ? new ObjectId(data.resourceId) : null,
      details: data.details || {},
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      createdAt: new Date(),
    });
  } catch (error) {
    // Don't throw errors from audit logging - log to console instead
    console.error('Failed to log audit event:', error);
  }
}

export function getClientIP(req: Request): string | undefined {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || undefined;
}

export function getUserAgent(req: Request): string | undefined {
  return req.headers.get('user-agent') || undefined;
}

