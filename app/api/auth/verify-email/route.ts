import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';
import { sendUnderReviewEmail } from '@/lib/email';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const verifyEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = verifyEmailSchema.parse(body);

    const db = await getDb();
    const usersCollection = db.collection('users');
    const otpCollection = db.collection('email_verification_otps');

    const emailLower = email.toLowerCase();

    // Find and validate OTP
    const otpDoc = await otpCollection.findOne({
      email: emailLower,
      otp,
    });

    if (!otpDoc) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    if (new Date() > otpDoc.expiresAt) {
      await otpCollection.deleteOne({ _id: otpDoc._id });
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Update user
    const result = await usersCollection.findOneAndUpdate(
      { _id: otpDoc.userId, email: emailLower },
      {
        $set: {
          emailVerified: true,
          accountStatus: 'pending_approval',
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete used OTP
    await otpCollection.deleteOne({ _id: otpDoc._id });

    // Send under review email
    await sendUnderReviewEmail(result.email, result.firstName);

    // Generate JWT and return
    const token = generateToken(result._id, result.email);

    return NextResponse.json(
      {
        success: true,
        token,
        redirectTo: '/dashboard',
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=604800`,
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
