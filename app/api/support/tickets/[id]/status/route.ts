import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { updateTicketStatusSchema } from '@/lib/validation';
import { logAuditEvent, getClientIP, getUserAgent } from '@/lib/audit-logger';
import { ObjectId } from 'mongodb';

export async function PUT(
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
    const validatedData = updateTicketStatusSchema.parse(body);

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

    // Update status
    const updateData: any = {
      status: validatedData.status,
      updatedAt: new Date(),
    };

    if (validatedData.status === 'resolved' || validatedData.status === 'closed') {
      updateData.resolvedAt = new Date();
    }

    await ticketsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Log audit event
    await logAuditEvent({
      userId: user.userId,
      action: 'support_ticket_status_updated',
      resourceType: 'supportticket',
      resourceId: id,
      details: { status: validatedData.status },
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    });

    return NextResponse.json(
      { success: true, message: 'Ticket status updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating ticket status:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket status' },
      { status: 500 }
    );
  }
}

