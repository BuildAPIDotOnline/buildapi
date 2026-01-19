import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function authenticateRequest(
  req: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const user = verifyToken(token);
    return { user };
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

