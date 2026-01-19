import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { createPaymentSchema } from '@/lib/validation';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await req.json();
    const validatedData = createPaymentSchema.parse(body);

    const db = await getDb();
    const plansCollection = db.collection('pricingplans');
    const paymentsCollection = db.collection('payments');

    // Get plan details
    const plan = await plansCollection.findOne({
      _id: new ObjectId(validatedData.planId),
      status: 'active',
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    // Generate invoice ID
    const invoiceId = `INV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Generate transaction reference
    const transactionReference = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create payment record
    const payment = {
      userId: new ObjectId(user.userId),
      planId: new ObjectId(validatedData.planId),
      industry: validatedData.industry,
      appName: validatedData.appName,
      url: validatedData.url,
      email: validatedData.email,
      amount: plan.price, // in NGN
      currency: 'NGN',
      transactionReference,
      status: 'pending' as const,
      invoiceId,
      createdAt: new Date(),
    };

    const result = await paymentsCollection.insertOne(payment);

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'payment_initiated',
      resourceType: 'payment',
      resourceId: result.insertedId,
      details: {
        planId: validatedData.planId,
        amount: plan.price,
        industry: validatedData.industry,
      },
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      {
        success: true,
        payment: {
          id: result.insertedId.toString(),
          invoiceId,
          transactionReference,
          amount: plan.price,
          currency: 'NGN',
          plan: {
            id: plan._id.toString(),
            name: plan.name,
          },
          industry: validatedData.industry,
          appName: validatedData.appName,
          // Include payment ID so it can be stored in Paystack metadata
          paymentId: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

