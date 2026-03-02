import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const db = await getDb();
    const usersCollection = db.collection('users');
    const paymentsCollection = db.collection('payments');
    const apiKeysCollection = db.collection('apikeys');
    const plansCollection = db.collection('pricingplans');

    const [totalUsers, paymentsAgg, activeKeysCount, plansCount] = await Promise.all([
      usersCollection.countDocuments(),
      paymentsCollection.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).toArray(),
      apiKeysCollection.countDocuments({ status: { $ne: 'revoked' } }),
      plansCollection.countDocuments(),
    ]);

    const totalRevenue = paymentsAgg[0]?.total ?? 0;
    const recentPaymentsCount = await paymentsCollection.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    return NextResponse.json(
      {
        totalUsers,
        totalRevenue,
        activeKeysCount,
        plansCount,
        recentPaymentsCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
