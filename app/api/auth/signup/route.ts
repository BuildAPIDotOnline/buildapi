import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import { signupSchema } from '@/lib/validation';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { sendOtpEmail } from '@/lib/email';
import { ObjectId } from 'mongodb';
import { randomInt } from 'crypto';

const OTP_EXPIRY_MINUTES = 10;

function generateOtp(): string {
  return randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    const db = await getDb();
    const usersCollection = db.collection('users');
    const otpCollection = db.collection('email_verification_otps');

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

    const email = validatedData.email.toLowerCase();

    // Generate OTP and send email first (before creating user) so we don't leave orphan accounts if email fails
    const otp = generateOtp();
    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      const isSmtpNotConfigured =
        emailError instanceof Error &&
        emailError.message?.includes('SMTP not configured');
      if (isSmtpNotConfigured && process.env.NODE_ENV === 'development') {
        console.warn(
          '[DEV] SMTP not configured. OTP for',
          email,
          'is:',
          otp,
          '- use this to verify in /verify-email'
        );
      } else {
        console.error('Failed to send verification email:', emailError);
        return NextResponse.json(
          {
            error:
              'Email service is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local to send verification emails.',
          },
          { status: 503 }
        );
      }
    }

    // Create user with pending_verification
    const user = {
      email,
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
      accountStatus: 'pending_verification' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);
    const userId = result.insertedId;

    // Store OTP for verification
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await otpCollection.insertOne({
      email: user.email,
      otp,
      userId,
      expiresAt,
      createdAt: new Date(),
    });

    // Log audit event
    await logAuditEvent({
      userId,
      action: 'user_created',
      resourceType: 'user',
      resourceId: userId,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    // Return success without token - user must verify email first
    return NextResponse.json(
      {
        success: true,
        email: user.email,
      },
      { status: 201 }
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

