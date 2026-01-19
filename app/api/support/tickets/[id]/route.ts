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

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    const db = await getDb();
    const ticketsCollection = db.collection('supporttickets');

    // Find ticket and verify ownership
    const ticket = await ticketsCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.userId),
    });

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Format ticket with responses
    const formattedTicket = {
      id: ticket._id.toString(),
      subject: ticket.subject,
      description: ticket.description,
      affectedVertical: ticket.affectedVertical,
      priority: ticket.priority,
      status: ticket.status,
      responses: ticket.responses || [],
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolvedAt: ticket.resolvedAt,
    };

    return NextResponse.json({ ticket: formattedTicket }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

