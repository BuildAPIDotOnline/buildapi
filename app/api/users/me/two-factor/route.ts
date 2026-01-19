import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

const toggleTwoFactorSchema = z.object({
  enabled: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await req.json();
    const validatedData = toggleTwoFactorSchema.parse(body);

    const db = await getDb();
    const usersCollection = db.collection('users');

    // Update 2FA status
    await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          twoFactorEnabled: validatedData.enabled,
          updatedAt: new Date(),
        },
      }
    );

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: validatedData.enabled ? '2fa_enabled' : '2fa_disabled',
      resourceType: 'user',
      resourceId: user.userId,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      {
        success: true,
        message: `Two-factor authentication ${validatedData.enabled ? 'enabled' : 'disabled'}`,
        twoFactorEnabled: validatedData.enabled,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error toggling 2FA:', error);
    return NextResponse.json(
      { error: 'Failed to update two-factor authentication' },
      { status: 500 }
    );
  }
}

