import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
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
    const apiUsageCollection = db.collection('apiusage');

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

    // Get usage stats
    const dateRange = req.nextUrl.searchParams.get('range') || '24h';
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const usageStats = await apiUsageCollection
      .aggregate([
        {
          $match: {
            apiKeyId: new ObjectId(id),
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: 1 },
            successfulRequests: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$statusCode', 200] },
                      { $lt: ['$statusCode', 300] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            failedRequests: {
              $sum: {
                $cond: [{ $gte: ['$statusCode', 400] }, 1, 0],
              },
            },
            avgResponseTime: { $avg: '$responseTime' },
            minResponseTime: { $min: '$responseTime' },
            maxResponseTime: { $max: '$responseTime' },
          },
        },
      ])
      .toArray();

    const stats = usageStats[0] || {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
    };

    return NextResponse.json(
      {
        usage: {
          total: stats.totalRequests,
          successful: stats.successfulRequests,
          failed: stats.failedRequests,
          avgResponseTime: Math.round(stats.avgResponseTime || 0),
          minResponseTime: stats.minResponseTime || 0,
          maxResponseTime: stats.maxResponseTime || 0,
          limit: apiKey.limit,
          currentUsage: apiKey.usage || 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching API key usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key usage' },
      { status: 500 }
    );
  }
}

