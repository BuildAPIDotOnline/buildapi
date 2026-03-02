import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { adminRevokeKeySchema } from '@/lib/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid API key ID' }, { status: 400 });
    }

    let reason: string | undefined;
    try {
      const body = await req.json();
      const parsed = adminRevokeKeySchema.parse(body);
      reason = parsed.reason;
    } catch {
      // optional body
    }

    const db = await getDb();
    const apiKeysCollection = db.collection('apikeys');

    const key = await apiKeysCollection.findOne({ _id: new ObjectId(id) });
    if (!key) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await apiKeysCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'revoked',
          revokedAt: new Date(),
          ...(reason ? { revokeReason: reason } : {}),
        },
      }
    );

    return NextResponse.json(
      { success: true, message: 'API key revoked successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error revoking API key:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}
