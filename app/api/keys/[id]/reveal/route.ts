import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid API key ID' }, { status: 400 });
    }

    const db = await getDb();
    const apiKeysCollection = db.collection('apikeys');

    const apiKey = await apiKeysCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.userId),
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    if (apiKey.status === 'revoked') {
      return NextResponse.json(
        { error: 'Cannot reveal a revoked API key' },
        { status: 400 }
      );
    }

    await logAuditEvent({
      userId: user.userId,
      action: 'api_key_revealed',
      resourceType: 'apikey',
      resourceId: id,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    // Return apiKey.key - the full unhashed key as stored by creation flows
    return NextResponse.json(
      { key: apiKey.key },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error revealing API key:', error);
    return NextResponse.json(
      { error: 'Failed to reveal API key' },
      { status: 500 }
    );
  }
}
