import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const db = await getDb();
    const apiUsageCollection = db.collection('apiusage');
    const apiKeysCollection = db.collection('apikeys');

    // Get date range (default: last 7 days)
    const dateRange = req.nextUrl.searchParams.get('range') || '7d';
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
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get all user's API keys
    const apiKeys = await apiKeysCollection
      .find({
        userId: new ObjectId(user.userId),
        status: 'active',
      })
      .toArray();

    const apiKeyIds = apiKeys.map((key) => key._id);

    if (apiKeyIds.length === 0) {
      return NextResponse.json({ usageByIndustry: [] });
    }

    // Get usage by industry
    const usageByIndustry = await apiUsageCollection
      .aggregate([
        {
          $match: {
            apiKeyId: { $in: apiKeyIds },
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: '$industry',
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
          },
        },
        {
          $sort: { totalRequests: -1 },
        },
      ])
      .toArray();

    const formattedUsage = usageByIndustry.map((item) => ({
      industry: item._id || 'Unknown',
      totalRequests: item.totalRequests,
      successfulRequests: item.successfulRequests,
      failedRequests: item.failedRequests,
      avgResponseTime: Math.round(item.avgResponseTime || 0),
      successRate: item.totalRequests > 0
        ? ((item.successfulRequests / item.totalRequests) * 100).toFixed(2)
        : '100.00',
    }));

    return NextResponse.json(
      { usageByIndustry: formattedUsage },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching usage by industry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage by industry' },
      { status: 500 }
    );
  }
}

