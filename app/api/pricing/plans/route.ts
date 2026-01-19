import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const plansCollection = db.collection('pricingplans');

    // Get all active pricing plans, sorted by price
    const plans = await plansCollection
      .find({ status: 'active' })
      .sort({ price: 1 })
      .toArray();

    // Remove MongoDB _id and convert to string
    const formattedPlans = plans.map((plan) => ({
      id: plan._id.toString(),
      name: plan.name,
      description: plan.description,
      price: plan.price,
      features: plan.features,
      apiCallLimit: plan.apiCallLimit,
      popular: plan.popular || false,
    }));

    return NextResponse.json({ plans: formattedPlans }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing plans' },
      { status: 500 }
    );
  }
}

