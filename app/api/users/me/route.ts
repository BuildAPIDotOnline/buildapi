import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { updateProfileSchema } from '@/lib/validation';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const db = await getDb();
    const usersCollection = db.collection('users');

    const userDoc = await usersCollection.findOne({
      _id: new ObjectId(user.userId),
    });

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data without password
    const { password, ...userData } = userDoc;
    return NextResponse.json(
      {
        user: {
          id: userData._id.toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          country: userData.country,
          companyName: userData.companyName,
          jobTitle: userData.jobTitle,
          companySize: userData.companySize,
          industry: userData.industry,
          heardAboutUs: userData.heardAboutUs,
          emailVerified: userData.emailVerified,
          twoFactorEnabled: userData.twoFactorEnabled,
          createdAt: userData.createdAt,
          lastLoginAt: userData.lastLoginAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    const db = await getDb();
    const usersCollection = db.collection('users');

    // Update user
    const updateData: any = {
      updatedAt: new Date(),
    };

    Object.keys(validatedData).forEach((key) => {
      if (validatedData[key as keyof typeof validatedData] !== undefined) {
        updateData[key] = validatedData[key as keyof typeof validatedData];
      }
    });

    await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      { $set: updateData }
    );

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'profile_updated',
      resourceType: 'user',
      resourceId: user.userId,
      details: { fields: Object.keys(validatedData) },
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      { success: true, message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

