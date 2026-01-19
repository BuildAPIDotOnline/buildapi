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
      return NextResponse.json({ usage: [] });
    }

    // Get usage by date/hour
    const usageByTime = await apiUsageCollection
      .aggregate([
        {
          $match: {
            apiKeyId: { $in: apiKeyIds },
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' },
              hour: { $hour: '$timestamp' },
            },
            count: { $sum: 1 },
            avgResponseTime: { $avg: '$responseTime' },
            successful: {
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
            failed: {
              $sum: {
                $cond: [{ $gte: ['$statusCode', 400] }, 1, 0],
              },
            },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
            '_id.day': 1,
            '_id.hour': 1,
          },
        },
      ])
      .toArray();

    const formattedUsage = usageByTime.map((item) => ({
      timestamp: new Date(
        item._id.year,
        item._id.month - 1,
        item._id.day,
        item._id.hour
      ).toISOString(),
      requests: item.count,
      successful: item.successful,
      failed: item.failed,
      avgResponseTime: Math.round(item.avgResponseTime || 0),
    }));

    return NextResponse.json({ usage: formattedUsage }, { status: 200 });
  } catch (error) {
    console.error('Error fetching usage analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage analytics' },
      { status: 500 }
    );
  }
}

