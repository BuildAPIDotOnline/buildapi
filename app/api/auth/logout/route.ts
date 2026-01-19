import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Clear the token cookie
  return NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    {
      status: 200,
      headers: {
        'Set-Cookie': 'token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0',
      },
    }
  );
}

