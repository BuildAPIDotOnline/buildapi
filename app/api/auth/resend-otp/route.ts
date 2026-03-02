import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { sendOtpEmail } from '@/lib/email';
import { ObjectId } from 'mongodb';
import { randomInt } from 'crypto';
import { z } from 'zod';

const resendOtpSchema = z.object({
  email: z.string().email(),
});

const OTP_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

function generateOtp(): string {
  return randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = resendOtpSchema.parse(body);

    const db = await getDb();
    const usersCollection = db.collection('users');
    const otpCollection = db.collection('email_verification_otps');

    const emailLower = email.toLowerCase();

    // Verify user exists and is pending_verification
    const user = await usersCollection.findOne({
      email: emailLower,
      accountStatus: 'pending_verification',
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No pending verification found for this email' },
        { status: 400 }
      );
    }

    // Rate limit: check last OTP creation time
    const existingOtp = await otpCollection.findOne({ email: emailLower });
    if (existingOtp) {
      const elapsed = Date.now() - existingOtp.createdAt.getTime();
      if (elapsed < RESEND_COOLDOWN_MS) {
        const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return NextResponse.json(
          {
            error: `Please wait ${waitSeconds} seconds before requesting a new code`,
          },
          { status: 429 }
        );
      }
    }

    // Generate new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const now = new Date();
    await otpCollection.updateOne(
      { email: emailLower },
      {
        $set: {
          otp,
          userId: user._id,
          expiresAt,
          createdAt: now,
        },
      },
      { upsert: true }
    );

    await sendOtpEmail(emailLower, otp);

    return NextResponse.json(
      { success: true, message: 'Verification code sent' },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
