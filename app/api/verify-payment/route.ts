import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { status: 'failed', message: 'Transaction reference is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!secretKey) {
      console.error('PAYSTACK_SECRET_KEY is not configured');
      return NextResponse.json(
        { status: 'error', message: 'Payment verification service is not configured' },
        { status: 500 }
      );
    }

    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { status: 'failed', message: data.message || 'Transaction verification failed', data: data },
        { status: response.status }
      );
    }

    // Check if transaction was successful
    if (data.data && data.data.status === 'success') {
      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
        data: {
          reference: data.data.reference,
          amount: data.data.amount,
          currency: data.data.currency,
          email: data.data.customer?.email,
          paid_at: data.data.paid_at,
          metadata: data.data.metadata,
        },
      });
    }

    // Transaction exists but not successful
    return NextResponse.json({
      status: 'failed',
      message: data.data?.gateway_response || 'Transaction was not successful',
      data: data.data,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { status: 'error', message: 'An error occurred while verifying payment' },
      { status: 500 }
    );
  }
}

