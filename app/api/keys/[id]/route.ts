import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { updateApiKeySchema } from '@/lib/validation';
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
    const body = await req.json();
    const validatedData = updateApiKeySchema.parse(body);

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

    // Update API key
    const updateData: any = {};
    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }

    await apiKeysCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'api_key_updated',
      resourceType: 'apikey',
      resourceId: id,
      details: updateData,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      { success: true, message: 'API key updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Revoke API key (soft delete)
    await apiKeysCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'revoked',
          revokedAt: new Date(),
        },
      }
    );

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'api_key_revoked',
      resourceType: 'apikey',
      resourceId: id,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

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

