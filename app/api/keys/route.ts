import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { createApiKeySchema } from '@/lib/validation';
import { generateApiKey } from '@/lib/api-key-generator';
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
    const apiKeysCollection = db.collection('apikeys');

    // Get all user's API keys (excluding revoked ones by default, or all if query param is set)
    const includeRevoked = req.nextUrl.searchParams.get('includeRevoked') === 'true';
    const query: any = { userId: new ObjectId(user.userId) };
    if (!includeRevoked) {
      query.status = { $ne: 'revoked' };
    }

    const apiKeys = await apiKeysCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Format API keys (return prefix, not full key)
    const formattedKeys = apiKeys.map((key) => ({
      id: key._id.toString(),
      name: key.name,
      vertical: key.industry,
      key: key.keyPrefix, // Only return prefix for display
      status: key.status,
      usage: key.usage || 0,
      limit: key.limit,
      created: new Date(key.createdAt).toISOString().split('T')[0],
      environment: key.environment,
    }));

    return NextResponse.json({ keys: formattedKeys }, { status: 200 });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await req.json();
    const validatedData = createApiKeySchema.parse(body);

    const db = await getDb();
    const apiKeysCollection = db.collection('apikeys');
    const plansCollection = db.collection('pricingplans');

    // Get plan to determine limit
    const plan = await plansCollection.findOne({
      _id: new ObjectId(validatedData.planId),
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    // Generate API key
    const { fullKey, prefix } = generateApiKey(
      validatedData.environment || 'production'
    );

    // Create API key document
    const apiKey = {
      userId: new ObjectId(user.userId),
      key: fullKey, // Save full unhashed key
      keyPrefix: prefix,
      name: validatedData.name,
      industry: validatedData.industry,
      planId: new ObjectId(validatedData.planId),
      status: 'active' as const,
      usage: 0,
      limit: plan.apiCallLimit === -1 ? 999999999 : plan.apiCallLimit,
      environment: validatedData.environment || 'production',
      createdAt: new Date(),
    };

    const result = await apiKeysCollection.insertOne(apiKey);

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'api_key_created',
      resourceType: 'apikey',
      resourceId: result.insertedId,
      details: {
        name: validatedData.name,
        industry: validatedData.industry,
        environment: validatedData.environment || 'production',
      },
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    // Return full key only on creation (this is the only time user will see it)
    return NextResponse.json(
      {
        success: true,
        key: {
          id: result.insertedId.toString(),
          name: apiKey.name,
          key: fullKey, // Return full key only once
          prefix: prefix,
          status: apiKey.status,
          industry: apiKey.industry,
          limit: apiKey.limit,
          environment: apiKey.environment,
        },
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

    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

