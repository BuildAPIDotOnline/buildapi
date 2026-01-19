import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const plansCollection = db.collection('pricingplans');

    const plan = await plansCollection.findOne({
      _id: new ObjectId(id),
      status: 'active',
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    const formattedPlan = {
      id: plan._id.toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features,
      apiCallLimit: plan.apiCallLimit,
      popular: plan.popular || false,
    };

    return NextResponse.json({ plan: formattedPlan }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing plan' },
      { status: 500 }
    );
  }
}

