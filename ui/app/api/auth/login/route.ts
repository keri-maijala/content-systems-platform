import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(process.cwd(), '..');
const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || '');
const SESSION_DURATION = '12h';

// Rate limiting — simple in-memory store (per-instance, resets on redeployment)
// Sufficient for this platform's scale; revisit if moving to edge runtime
const attempts: Record<string, { count: number; firstAttempt: number }> = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function emailToEnvKey(email: string): string {
  return 'AUTH_USER_' + email.replace(/@/g, '_AT_').replace(/\./g, '_DOT_');
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts[ip];
  if (!record) return false;
  if (now - record.firstAttempt > WINDOW_MS) {
    delete attempts[ip];
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string): void {
  const now = Date.now();
  const record = attempts[ip];
  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attempts[ip] = { count: 1, firstAttempt: now };
  } else {
    record.count++;
  }
}

function clearAttempts(ip: string): void {
  delete attempts[ip];
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  if (!process.env.AUTH_JWT_SECRET) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const { email, password, clientKey } = await req.json();

  if (!email || !password || !clientKey) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Load client config to verify user exists
  const configPath = path.join(REPO_ROOT, 'clients', clientKey, 'config.json');
  if (!fs.existsSync(configPath)) {
    recordAttempt(ip);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const user = config.users?.find((u: { email: string }) => u.email === email);

  if (!user) {
    recordAttempt(ip);
    // Deliberate delay — prevents email enumeration
    await new Promise(r => setTimeout(r, 500));
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Look up hashed password from env vars
  const envKey = emailToEnvKey(email);
  const storedHash = process.env[envKey];

  if (!storedHash) {
    recordAttempt(ip);
    await new Promise(r => setTimeout(r, 500));
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, storedHash);

  if (!valid) {
    recordAttempt(ip);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  clearAttempts(ip);

  // Issue JWT
  const token = await new SignJWT({
    sub: user.email,
    name: user.name,
    role: user.role,
    domains: user.domains,
    clientKey,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(JWT_SECRET);

  const response = NextResponse.json({ ok: true });

  response.cookies.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 12, // 12 hours in seconds
    path: '/',
  });

  return response;
}
