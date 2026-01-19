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

    // More lenient ID validation - try to handle edge cases
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ error: 'Invalid payment ID: ID is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      console.error('Invalid payment ID format:', id);
      return NextResponse.json({ 
        error: 'Invalid payment ID format', 
        details: 'The payment ID must be a valid MongoDB ObjectId' 
      }, { status: 400 });
    }

    const db = await getDb();
    const paymentsCollection = db.collection('payments');
    const plansCollection = db.collection('pricingplans');

    // Find payment and verify ownership
    const payment = await paymentsCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.userId),
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Get plan details
    const plan = await plansCollection.findOne({ _id: payment.planId });

    const formattedPayment = {
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
      paidAt: payment.paidAt ? new Date(payment.paidAt).toISOString() : null,
    };

    return NextResponse.json({ payment: formattedPayment }, { status: 200 });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
}

