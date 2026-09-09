import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || '');

export async function GET(req: NextRequest) {
  const token = req.cookies.get('session')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({
      email: payload.sub,
      name: payload.name,
      role: payload.role,
      domains: payload.domains,
      clientKey: payload.clientKey,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
