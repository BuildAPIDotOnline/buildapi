import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { generateApiKey } from '@/lib/api-key-generator';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
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

    const db = await getDb();
    const paymentsCollection = db.collection('payments');
    const apiKeysCollection = db.collection('apikeys');

    // First, check if we've already processed this payment successfully
    // This prevents duplicate processing if verification is called multiple times
    const alreadyProcessed = await paymentsCollection.findOne({
      $or: [
        { 'paystackMetadata.reference': reference },
        { transactionReference: reference },
      ],
      userId: new ObjectId(user.userId),
      status: 'success',
    });

    if (alreadyProcessed) {
      // Payment already successfully processed - return existing payment info
      const existingApiKey = await apiKeysCollection.findOne({
        paymentId: alreadyProcessed._id,
        userId: new ObjectId(user.userId),
      });

      return NextResponse.json({
        status: 'success',
        message: 'Payment already verified',
        data: {
          reference: alreadyProcessed.paystackMetadata?.reference || alreadyProcessed.transactionReference,
          amount: alreadyProcessed.amount,
          currency: alreadyProcessed.currency,
          email: alreadyProcessed.email,
          paid_at: alreadyProcessed.paidAt,
          invoiceId: alreadyProcessed.invoiceId,
          apiKey: existingApiKey ? {
            key: existingApiKey.key,
            prefix: existingApiKey.keyPrefix,
          } : undefined,
        },
      });
    }

    // Verify transaction with Paystack first
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
        { status: 'failed', message: data.message || 'Transaction verification failed' },
        { status: response.status }
      );
    }

    // Get Paystack's reference (may differ from our generated one)
    const paystackReference = data.data?.reference || reference;

    // Check again with Paystack reference in case it differs
    if (paystackReference !== reference) {
      const alreadyProcessedWithPaystackRef = await paymentsCollection.findOne({
        $or: [
          { 'paystackMetadata.reference': paystackReference },
          { transactionReference: paystackReference },
        ],
        userId: new ObjectId(user.userId),
        status: 'success',
      });

      if (alreadyProcessedWithPaystackRef) {
        const existingApiKey = await apiKeysCollection.findOne({
          paymentId: alreadyProcessedWithPaystackRef._id,
          userId: new ObjectId(user.userId),
        });

        return NextResponse.json({
          status: 'success',
          message: 'Payment already verified',
          data: {
            reference: paystackReference,
            amount: alreadyProcessedWithPaystackRef.amount,
            currency: alreadyProcessedWithPaystackRef.currency,
            email: alreadyProcessedWithPaystackRef.email,
            paid_at: alreadyProcessedWithPaystackRef.paidAt,
            invoiceId: alreadyProcessedWithPaystackRef.invoiceId,
            apiKey: existingApiKey ? {
              key: existingApiKey.key,
              prefix: existingApiKey.keyPrefix,
            } : undefined,
          },
        });
      }
    }
    
    // Get payment ID from metadata (most reliable way to find existing payment)
    const metadata = data.data?.metadata || {};
    const paymentIdFromMetadata = metadata.payment_id;

    // Check for existing payment by multiple criteria to prevent duplicates
    // Priority 1: Check by payment ID from metadata (most reliable)
    // Priority 2: Check by Paystack's reference in paystackMetadata
    // Priority 3: Check by our transactionReference
    // Priority 4: Check by Paystack's reference as transactionReference
    let existingPayment = null;

    // First, always try to find by payment ID from metadata (most reliable)
    if (paymentIdFromMetadata && ObjectId.isValid(paymentIdFromMetadata)) {
      existingPayment = await paymentsCollection.findOne({
        _id: new ObjectId(paymentIdFromMetadata),
        userId: new ObjectId(user.userId),
      });
    }

    // If not found by ID, try by Paystack reference (which is what we get from verification)
    if (!existingPayment) {
      existingPayment = await paymentsCollection.findOne({
        $or: [
          { 'paystackMetadata.reference': paystackReference },
          { transactionReference: paystackReference },
          { transactionReference: reference },
        ],
        userId: new ObjectId(user.userId),
      });
    }

    // If still not found and payment is successful, do one more check for any successful payment with this reference
    if (!existingPayment && data.data?.status === 'success') {
      existingPayment = await paymentsCollection.findOne({
        $or: [
          { 'paystackMetadata.reference': paystackReference },
          { transactionReference: paystackReference },
        ],
        userId: new ObjectId(user.userId),
        status: 'success',
      });
    }

    // Check if transaction was successful
    if (data.data && data.data.status === 'success') {
      // Update or create payment record
      let payment;
      if (existingPayment) {
        // If payment already exists and is successful, don't create duplicate
        if (existingPayment.status === 'success') {
          // Payment already processed successfully - return existing payment
          payment = existingPayment;
        } else {
          // Update existing pending payment to success
          await paymentsCollection.updateOne(
            { _id: existingPayment._id },
            {
              $set: {
                status: 'success',
                paidAt: new Date(data.data.paid_at),
                paymentMethod: data.data.channel || 'Unknown',
                paystackMetadata: data.data,
                transactionReference: paystackReference, // Update to Paystack's reference
                updatedAt: new Date(),
              },
            }
          );
          payment = await paymentsCollection.findOne({ _id: existingPayment._id });
        }
      } else {
        // If no existing payment found, this is an error condition
        // We should ALWAYS have a payment record created before verification
        // Only allow creation if payment_id is missing from metadata (edge case)
        if (!paymentIdFromMetadata) {
          console.error('No existing payment found and no payment_id in metadata - creating fallback payment');
          
          const customFields = metadata.custom_fields || [];
          
          const industry = customFields.find((f: any) => f.variable_name === 'industry')?.value || '';
          const appName = customFields.find((f: any) => f.variable_name === 'app_name')?.value || '';
          const url = customFields.find((f: any) => f.variable_name === 'origin_url')?.value || '';
          const planName = customFields.find((f: any) => f.variable_name === 'pricing_plan')?.value || '';

          // Find plan by name
          const plansCollection = db.collection('pricingplans');
          const plan = await plansCollection.findOne({ name: planName });

          if (!plan) {
            return NextResponse.json(
              { status: 'error', message: 'Pricing plan not found' },
              { status: 404 }
            );
          }

          const invoiceId = `INV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

          const paymentData = {
            userId: new ObjectId(user.userId),
            planId: plan._id,
            industry,
            appName,
            url,
            email: data.data.customer?.email || metadata.email || '',
            amount: data.data.amount / 100, // Convert from kobo to NGN (Paystack returns in kobo)
            currency: data.data.currency || 'NGN',
            transactionReference: paystackReference, // Use Paystack's reference
            status: 'success' as const,
            paymentMethod: data.data.channel || 'Unknown',
            paystackMetadata: data.data,
            invoiceId,
            createdAt: new Date(),
            paidAt: new Date(data.data.paid_at),
          };

          const result = await paymentsCollection.insertOne(paymentData);
          payment = await paymentsCollection.findOne({ _id: result.insertedId });
        } else {
          // If we have payment_id but couldn't find payment, something is wrong
          console.error(`Payment ID ${paymentIdFromMetadata} from metadata not found in database for user ${user.userId}`);
          return NextResponse.json(
            { status: 'error', message: 'Payment record not found. Please contact support.' },
            { status: 404 }
          );
        }
      }

      // Create API key for this purchase (only if it doesn't already exist)
      if (payment && payment.status === 'success') {
        // Check if an API key already exists for this payment to prevent duplicates
        // Check by multiple criteria: paymentId, transactionReference (both ours and Paystack's)
        const existingApiKey = await apiKeysCollection.findOne({
          $or: [
            { paymentId: payment._id }, // Most reliable - direct link to payment
            { transactionReference: paystackReference },
            { transactionReference: reference },
            { transactionReference: payment.transactionReference }, // Original reference from payment creation
          ],
          userId: new ObjectId(user.userId),
        });

        if (existingApiKey) {
          // API key already exists, return success with existing key info
          return NextResponse.json({
            status: 'success',
            message: 'Payment verified successfully',
            data: {
              reference: data.data.reference,
              amount: payment.amount,
              currency: payment.currency,
              email: payment.email,
              paid_at: payment.paidAt,
              invoiceId: payment.invoiceId,
              apiKey: {
                key: existingApiKey.key, // Return full unhashed key
                prefix: existingApiKey.keyPrefix,
              },
            },
          });
        }

        // Generate new API key
        const { fullKey, prefix } = generateApiKey('production');
        
        const plansCollection = db.collection('pricingplans');
        const plan = await plansCollection.findOne({ _id: payment.planId });

        const apiKey = {
          userId: new ObjectId(user.userId),
          key: fullKey, // Save full unhashed key
          keyPrefix: prefix,
          name: `${payment.appName} - ${payment.industry}`,
          industry: payment.industry,
          planId: payment.planId,
          url: payment.url, // Save website URL from payment
          paymentId: payment._id, // Link to payment
          transactionReference: paystackReference, // Use Paystack's reference (most reliable)
          status: 'active' as const,
          usage: 0,
          limit: plan?.apiCallLimit === -1 ? 999999999 : plan?.apiCallLimit || 0,
          environment: 'production' as const,
          createdAt: new Date(),
        };

        await apiKeysCollection.insertOne(apiKey);

        // Log audit event
        await logAuditEvent({
          userId: user.userId,
          action: 'payment_successful',
          resourceType: 'payment',
          resourceId: payment._id,
          details: {
            amount: payment.amount,
            planId: payment.planId.toString(),
            industry: payment.industry,
          },
          ipAddress: getClientIP(req),
          userAgent: getUserAgent(req),
        });

        return NextResponse.json({
          status: 'success',
          message: 'Payment verified successfully',
          data: {
            reference: data.data.reference,
            amount: payment.amount,
            currency: payment.currency,
            email: payment.email,
            paid_at: payment.paidAt,
            invoiceId: payment.invoiceId,
            apiKey: {
              key: fullKey,
              prefix: prefix,
            },
          },
        });
      }
    }

    // Update payment status if failed
    if (existingPayment) {
      await paymentsCollection.updateOne(
        { _id: existingPayment._id },
        {
          $set: {
            status: 'failed',
            paystackMetadata: data.data,
            updatedAt: new Date(),
          },
        }
      );
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

