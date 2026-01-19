import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { respondToTicketSchema } from '@/lib/validation';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId, UpdateFilter } from 'mongodb';

export async function POST(
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
    const body = await req.json();
    const validatedData = respondToTicketSchema.parse(body);

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

    if (ticket.status === 'closed' || ticket.status === 'resolved') {
      return NextResponse.json(
        { error: 'Cannot respond to a closed or resolved ticket' },
        { status: 400 }
      );
    }

    // Add response
    const response = {
      message: validatedData.message,
      userId: new ObjectId(user.userId),
      isAdmin: false, // User responses are not admin responses
      createdAt: new Date(),
    };

    await ticketsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { responses: response },
        $set: {
          status: 'in-progress',
          updatedAt: new Date(),
        },
      } as unknown as UpdateFilter<any>
    );

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'support_ticket_responded',
      resourceType: 'supportticket',
      resourceId: id,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      { success: true, message: 'Response added successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error responding to ticket:', error);
    return NextResponse.json(
      { error: 'Failed to add response' },
      { status: 500 }
    );
  }
}

