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
    const paymentsCollection = db.collection('payments');
    const plansCollection = db.collection('pricingplans');

    // Get pagination and filter parameters from query string
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const statusFilter = searchParams.get('status'); // 'success', 'pending', 'failed', or null for all
    const industryFilter = searchParams.get('industry'); // Industry filter

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    const validSkip = (validPage - 1) * validLimit;

    // Build filter object
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const filter: any = { 
      userId: new ObjectId(user.userId),
    };

    // Apply status filter
    if (statusFilter && ['success', 'pending', 'failed'].includes(statusFilter)) {
      if (statusFilter === 'pending') {
        // For pending, only show recent ones (less than 1 hour old)
        filter.status = 'pending';
        filter.createdAt = { $gte: oneHourAgo };
      } else {
        filter.status = statusFilter;
      }
    } else {
      // No status filter - show all except old pending payments
      filter.$or = [
        { status: { $ne: 'pending' } },
        { status: 'pending', createdAt: { $gte: oneHourAgo } }
      ];
    }

    // Apply industry filter
    if (industryFilter && industryFilter.trim() !== '') {
      filter.industry = industryFilter;
    }

    // Get total count for pagination metadata
    const totalCount = await paymentsCollection.countDocuments(filter);

    // Get paginated payments
    const payments = await paymentsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(validSkip)
      .limit(validLimit)
      .toArray();

    // Get plan details for each payment
    const formattedPayments = await Promise.all(
      payments.map(async (payment) => {
        const plan = await plansCollection.findOne({ _id: payment.planId });
        
        return {
          id: payment._id.toString(),
          invoiceId: payment.invoiceId,
          date: new Date(payment.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          amount: `₦${payment.amount.toFixed(2)}`,
          status: payment.status,
          industry: payment.industry,
          appName: payment.appName,
          url: payment.url,
          plan: plan?.name || 'Unknown',
          transactionReference: payment.transactionReference,
          paymentMethod: payment.paymentMethod || 'Paystack',
          email: payment.email,
        };
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / validLimit);
    const hasNextPage = validPage < totalPages;
    const hasPrevPage = validPage > 1;

    return NextResponse.json({ 
      payments: formattedPayments,
      pagination: {
        page: validPage,
        limit: validLimit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}

