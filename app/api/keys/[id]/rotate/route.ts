import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { generateApiKey } from '@/lib/api-key-generator';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId } from 'mongodb';

export async function PUT(
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

    // Find API key and verify ownership
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
        { error: 'Cannot rotate a revoked API key' },
        { status: 400 }
      );
    }

    // Generate new API key
    const { fullKey, prefix } = generateApiKey(apiKey.environment);

    // Update API key
    await apiKeysCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          key: fullKey, // Save full unhashed key
          keyPrefix: prefix,
          lastRotatedAt: new Date(),
        },
      }
    );

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'api_key_rotated',
      resourceType: 'apikey',
      resourceId: id,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    // Return new full key (only time user will see it)
    return NextResponse.json(
      {
        success: true,
        message: 'API key rotated successfully',
        key: fullKey,
        prefix: prefix,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error rotating API key:', error);
    return NextResponse.json(
      { error: 'Failed to rotate API key' },
      { status: 500 }
    );
  }
}

