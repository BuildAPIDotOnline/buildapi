import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const industriesCollection = db.collection('industries');

    // Get all active industries, sorted by order
    const industries = await industriesCollection
      .find({ active: true })
      .sort({ order: 1 })
      .toArray();

    // Format industries
    const formattedIndustries = industries.map((industry) => ({
      id: industry._id.toString(),
      name: industry.name,
      slug: industry.slug,
      description: industry.description || '',
    }));

    return NextResponse.json(
      { industries: formattedIndustries },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}

