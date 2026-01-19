import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { signupSchema } from '@/lib/validation';
import { generateToken } from '@/lib/auth';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    const db = await getDb();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: validatedData.email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = {
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phoneNumber: validatedData.phoneNumber,
      country: validatedData.country,
      companyName: validatedData.companyName,
      jobTitle: validatedData.jobTitle,
      companySize: validatedData.companySize,
      industry: validatedData.industry,
      heardAboutUs: validatedData.heardAboutUs,
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);
    const userId = result.insertedId;

    // Generate JWT token
    const token = generateToken(userId, user.email);

    // Log audit event
    await logAuditEvent({
      userId,
      action: 'user_created',
      resourceType: 'user',
      resourceId: userId,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    // Return user data (without password) and token
    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: userId.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
        },
      },
      {
        status: 201,
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

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

