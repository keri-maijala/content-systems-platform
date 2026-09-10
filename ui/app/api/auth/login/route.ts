import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || '');

function emailToEnvKey(email: string): string {
  return 'AUTH_USER_' + email.replace('@', '_AT_').replace(/\./g, '_DOT_');
}

export async function POST(req: NextRequest) {
  const { email, password, clientKey } = await req.json();

  if (!email || !password || !clientKey) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  // Load client config from filesystem
  let clientConfig: any;
  try {
    const configPath = path.join(process.cwd(), '..', 'clients', clientKey, 'config.json');
    const raw = fs.readFileSync(configPath, 'utf-8');
    clientConfig = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Unknown client' }, { status: 400 });
  }

  // Find user
  const user = clientConfig.users.find((u: any) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Check password hash from env
  const envKey = emailToEnvKey(email);
  const hash = process.env[envKey];
  if (!hash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Issue JWT
  const token = await new SignJWT({
    sub: user.email,
    name: user.name,
    role: user.role,
    domains: user.domains,
    clientKey,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(JWT_SECRET);

  const response = NextResponse.json({ ok: true, name: user.name, role: user.role });
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  return response;
}
