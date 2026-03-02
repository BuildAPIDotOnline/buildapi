import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { JWTPayload } from '@/lib/auth';

export interface AdminUserDoc {
  _id: ObjectId;
  email: string;
  isAdmin?: boolean;
  [key: string]: unknown;
}

export async function requireAdmin(
  req: NextRequest
): Promise<
  | { user: JWTPayload; userDoc: AdminUserDoc }
  | NextResponse
> {
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
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  if (!userDoc.isAdmin) {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  return {
    user,
    userDoc: userDoc as AdminUserDoc,
  };
}
