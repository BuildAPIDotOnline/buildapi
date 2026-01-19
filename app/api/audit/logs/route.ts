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
    const auditLogsCollection = db.collection('auditlogs');

    // Get pagination params
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Get user's audit logs, sorted by date
    const logs = await auditLogsCollection
      .find({ userId: new ObjectId(user.userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await auditLogsCollection.countDocuments({
      userId: new ObjectId(user.userId),
    });

    // Format logs
    const formattedLogs = logs.map((log) => ({
      id: log._id.toString(),
      action: log.action,
      resourceType: log.resourceType,
      resourceId: log.resourceId?.toString() || null,
      details: log.details || {},
      ipAddress: log.ipAddress || null,
      userAgent: log.userAgent || null,
      createdAt: log.createdAt,
    }));

    return NextResponse.json(
      {
        logs: formattedLogs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

