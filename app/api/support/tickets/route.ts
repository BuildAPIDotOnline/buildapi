import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { createSupportTicketSchema } from '@/lib/validation';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const db = await getDb();
    const ticketsCollection = db.collection('supporttickets');

    // Get all user's tickets, sorted by date
    const tickets = await ticketsCollection
      .find({ userId: new ObjectId(user.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    // Format tickets
    const formattedTickets = tickets.map((ticket) => ({
      id: ticket._id.toString(),
      subject: ticket.subject,
      affectedVertical: ticket.affectedVertical,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolvedAt: ticket.resolvedAt,
      responseCount: ticket.responses?.length || 0,
    }));

    return NextResponse.json({ tickets: formattedTickets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await req.json();
    const validatedData = createSupportTicketSchema.parse(body);

    const db = await getDb();
    const ticketsCollection = db.collection('supporttickets');

    // Create support ticket
    const ticket = {
      userId: new ObjectId(user.userId),
      subject: validatedData.subject,
      description: validatedData.description,
      affectedVertical: validatedData.affectedVertical,
      priority: validatedData.priority || 'normal',
      status: 'open' as const,
      responses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ticketsCollection.insertOne(ticket);

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'support_ticket_created',
      resourceType: 'supportticket',
      resourceId: result.insertedId,
      details: {
        subject: validatedData.subject,
        priority: validatedData.priority || 'normal',
        affectedVertical: validatedData.affectedVertical,
      },
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      {
        success: true,
        ticket: {
          id: result.insertedId.toString(),
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          createdAt: ticket.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    );
  }
}

