import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-admin';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { adminIndustrySchema } from '@/lib/validation';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid industry ID' }, { status: 400 });
    }

    const db = await getDb();
    const industry = await db.collection('industries').findOne({
      _id: new ObjectId(id),
    });

    if (!industry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        industry: {
          id: industry._id.toString(),
          name: industry.name,
          slug: industry.slug,
          description: industry.description ?? '',
          active: industry.active,
          order: industry.order,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching industry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industry' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid industry ID' }, { status: 400 });
    }

    const body = await req.json();
    const validated = adminIndustrySchema.parse(body);
    const slug = validated.slug ?? slugify(validated.name);

    const db = await getDb();
    const result = await db.collection('industries').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: validated.name,
          slug,
          description: validated.description ?? '',
          active: validated.active,
          order: validated.order,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Industry updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: (error as unknown as { issues: unknown }).issues },
        { status: 400 }
      );
    }
    console.error('Error updating industry:', error);
    return NextResponse.json(
      { error: 'Failed to update industry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminResult = await requireAdmin(req);
    if (adminResult instanceof NextResponse) {
      return adminResult;
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid industry ID' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('industries').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Industry deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting industry:', error);
    return NextResponse.json(
      { error: 'Failed to delete industry' },
      { status: 500 }
    );
  }
}
