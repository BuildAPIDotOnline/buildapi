import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { getDb } from '@/lib/mongodb';
import { adminIndustrySchema } from '@/lib/validation';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export async function GET(req: NextRequest) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const db = await getDb();
    const industries = await db
      .collection('industries')
      .find({})
      .sort({ order: 1 })
      .toArray();

    const formatted = industries.map((i) => ({
      id: i._id.toString(),
      name: i.name,
      slug: i.slug,
      description: i.description ?? '',
      active: i.active,
      order: i.order,
      createdAt: i.createdAt,
    }));

    return NextResponse.json({ industries: formatted }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin industries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
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
    const validated = adminIndustrySchema.parse(body);
    const slug = validated.slug ?? slugify(validated.name);

    const db = await getDb();
    const result = await db.collection('industries').insertOne({
      name: validated.name,
      slug,
      description: validated.description ?? '',
      active: validated.active,
      order: validated.order,
      createdAt: new Date(),
    });

    const inserted = await db.collection('industries').findOne({
      _id: result.insertedId,
    });

    return NextResponse.json(
      {
        industry: {
          id: inserted!._id.toString(),
          name: inserted!.name,
          slug: inserted!.slug,
          description: inserted!.description ?? '',
          active: inserted!.active,
          order: inserted!.order,
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
    console.error('Error creating industry:', error);
    return NextResponse.json(
      { error: 'Failed to create industry' },
      { status: 500 }
    );
  }
}
