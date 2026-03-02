import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { getDb } from '@/lib/mongodb';
import { adminPlanSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const db = await getDb();
    const plans = await db
      .collection('pricingplans')
      .find({})
      .sort({ price: 1 })
      .toArray();

    const formatted = plans.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      features: p.features,
      apiCallLimit: p.apiCallLimit,
      status: p.status,
      popular: p.popular ?? false,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ plans: formatted }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const body = await req.json();
    const validated = adminPlanSchema.parse(body);

    const db = await getDb();
    const result = await db.collection('pricingplans').insertOne({
      name: validated.name,
      description: validated.description,
      price: validated.price,
      features: validated.features,
      apiCallLimit: validated.apiCallLimit,
      status: validated.status,
      popular: validated.popular,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const inserted = await db.collection('pricingplans').findOne({
      _id: result.insertedId,
    });

    return NextResponse.json(
      {
        plan: {
          id: inserted!._id.toString(),
          name: inserted!.name,
          description: inserted!.description,
          price: inserted!.price,
          features: inserted!.features,
          apiCallLimit: inserted!.apiCallLimit,
          status: inserted!.status,
          popular: inserted!.popular,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: (error as unknown as { issues: unknown }).issues },
        { status: 400 }
      );
    }
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}
