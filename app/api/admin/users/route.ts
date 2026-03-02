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
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const accountStatus = searchParams.get('accountStatus') || 'pending_approval';

    const filter: Record<string, unknown> = {};
    if (['pending_approval', 'approved', 'pending_verification'].includes(accountStatus)) {
      filter.accountStatus = accountStatus;
    } else if (accountStatus === 'all') {
      // No filter - return all users
    } else {
      filter.accountStatus = 'pending_approval';
    }

    const usersCollection = db.collection('users');
    const totalCount = await usersCollection.countDocuments(filter);
    const users = await usersCollection
      .find(filter, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const formatted = users.map((u: Record<string, unknown>) => ({
      id: (u._id as { toString: () => string }).toString(),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      companyName: u.companyName,
      jobTitle: u.jobTitle,
      country: u.country,
      accountStatus: u.accountStatus || 'approved',
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        users: formatted,
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
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
