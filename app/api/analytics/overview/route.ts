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

    // Get date range (default: last 24 hours)
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

    // Get all user's API keys
    const apiKeys = await apiKeysCollection
      .find({
        userId: new ObjectId(user.userId),
        status: 'active',
      })
      .toArray();

    const apiKeyIds = apiKeys.map((key) => key._id);

    if (apiKeyIds.length === 0) {
      return NextResponse.json({
        overview: {
          throughput: {
            total: 0,
            value: '0',
            subtext: 'Total API requests in last 24h',
            trend: 'neutral',
          },
          latency: {
            p99: 0,
            value: '0ms',
            subtext: 'Avg. response time',
            trend: 'neutral',
          },
          successRate: {
            rate: 100,
            value: '100%',
            subtext: 'No failures',
            trend: 'neutral',
          },
        },
      });
    }

    // Aggregate usage stats
    const stats = await apiUsageCollection
      .aggregate([
        {
          $match: {
            apiKeyId: { $in: apiKeyIds },
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
            responseTimes: { $push: '$responseTime' },
          },
        },
      ])
      .toArray();

    const result = stats[0] || {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgResponseTime: 0,
      p99ResponseTime: [0],
    };

    const total = result.totalRequests || 0;
    const successful = result.successfulRequests || 0;
    const failed = result.failedRequests || 0;
    const successRate = total > 0 ? (successful / total) * 100 : 100;
    const avgLatency = Math.round(result.avgResponseTime || 0);
    
    // Calculate P99 latency manually
    let p99Latency = 0;
    if (result.responseTimes && result.responseTimes.length > 0) {
      const sorted = result.responseTimes.sort((a: number, b: number) => a - b);
      const p99Index = Math.ceil(sorted.length * 0.99) - 1;
      p99Latency = Math.round(sorted[p99Index] || sorted[sorted.length - 1] || 0);
    }

    // Format throughput value
    const formatThroughput = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
      }
      return num.toString();
    };

    return NextResponse.json({
      overview: {
        throughput: {
          total,
          value: formatThroughput(total),
          subtext: `Total API requests in last ${dateRange}`,
          trend: total > 0 ? 'up' : 'neutral',
        },
        latency: {
          p99: p99Latency,
          avg: avgLatency,
          value: `${p99Latency}ms`,
          subtext: 'P99 response time',
          trend: p99Latency < 50 ? 'down' : 'up',
        },
        successRate: {
          rate: successRate,
          value: `${successRate.toFixed(2)}%`,
          subtext: `${failed} failure${failed !== 1 ? 's' : ''} out of ${total} requests`,
          trend: successRate >= 99 ? 'up' : 'down',
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics overview' },
      { status: 500 }
    );
  }
}

