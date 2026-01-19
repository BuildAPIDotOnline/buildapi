import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/password';
import { loginSchema } from '@/lib/validation';
import { generateToken } from '@/lib/auth';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const db = await getDb();
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({
      email: validatedData.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    // Log audit event
    await logAuditEvent({
      userId: user._id,
      action: 'user_login',
      resourceType: 'user',
      resourceId: user._id,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    // Return user data (without password) and token
    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
        },
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=604800`, // 7 days
        },
      }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

