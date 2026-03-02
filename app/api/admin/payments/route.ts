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
    const status = searchParams.get('status'); // success | pending | failed
    const from = searchParams.get('from'); // ISO date
    const to = searchParams.get('to'); // ISO date
    const email = searchParams.get('email'); // filter by user email

    const filter: Record<string, unknown> = {};

    if (status && ['success', 'pending', 'failed'].includes(status)) {
      filter.status = status;
    }
    const dateCond: { $gte?: Date; $lte?: Date } = {};
    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate.getTime())) dateCond.$gte = fromDate;
    }
    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate.getTime())) dateCond.$lte = toDate;
    }
    if (Object.keys(dateCond).length) {
      filter.createdAt = dateCond;
    }
    if (email && email.trim()) {
      const user = await db.collection('users').findOne({
        email: email.toLowerCase().trim(),
      });
      if (user) {
        filter.userId = user._id;
      } else {
        filter.userId = new ObjectId('000000000000000000000000');
      }
    }

    const paymentsCollection = db.collection('payments');
    const plansCollection = db.collection('pricingplans');
    const usersCollection = db.collection('users');

    const totalCount = await paymentsCollection.countDocuments(filter);
    const payments = await paymentsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const formatted = await Promise.all(
      payments.map(async (p) => {
        const [plan, user] = await Promise.all([
          plansCollection.findOne({ _id: p.planId }),
          usersCollection.findOne({ _id: p.userId }, { projection: { email: 1 } }),
        ]);
        return {
          id: p._id.toString(),
          email: p.email || (user as { email: string } | null)?.email || '—',
          amount: p.amount,
          amountFormatted: `₦${Number(p.amount).toFixed(2)}`,
          plan: (plan as { name: string } | null)?.name ?? 'Unknown',
          industry: p.industry,
          status: p.status,
          date: new Date(p.createdAt).toISOString().split('T')[0],
          createdAt: p.createdAt,
          transactionReference: p.transactionReference,
          appName: p.appName,
          invoiceId: p.invoiceId,
        };
      })
    );

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        payments: formatted,
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
    console.error('Error fetching admin payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
