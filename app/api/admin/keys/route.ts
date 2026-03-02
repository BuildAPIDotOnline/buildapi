import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const db = await getDb();
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const search = searchParams.get('search')?.trim(); // email or key prefix

    const apiKeysCollection = db.collection('apikeys');
    const usersCollection = db.collection('users');
    const plansCollection = db.collection('pricingplans');

    let filter: Record<string, unknown> = {};

    if (search) {
      const userMatches = await usersCollection
        .find({ email: { $regex: search, $options: 'i' } })
        .project({ _id: 1 })
        .toArray();
      const userIds = userMatches.map((u) => u._id);
      filter = {
        $or: [
          { keyPrefix: { $regex: search, $options: 'i' } },
          ...(userIds.length ? [{ userId: { $in: userIds } }] : []),
        ],
      };
    }

    const totalCount = await apiKeysCollection.countDocuments(filter);
    const keys = await apiKeysCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const formatted = await Promise.all(
      keys.map(async (k) => {
        const [user, plan] = await Promise.all([
          usersCollection.findOne({ _id: k.userId }, { projection: { email: 1 } }),
          plansCollection.findOne({ _id: k.planId }, { projection: { name: 1 } }),
        ]);
        return {
          id: k._id.toString(),
          keyPrefix: k.keyPrefix,
          name: k.name,
          industry: k.industry,
          planName: (plan as { name: string } | null)?.name ?? 'Unknown',
          status: k.status,
          createdAt: k.createdAt,
          created: new Date(k.createdAt).toISOString().split('T')[0],
          userEmail: (user as { email: string } | null)?.email ?? '—',
        };
      })
    );

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        keys: formatted,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching admin keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keys' },
      { status: 500 }
    );
  }
}
