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

  // Diagnostic: check env key and config path
  const envKey = emailToEnvKey(email);
  const configPath = path.join(process.cwd(), '..', 'clients', clientKey, 'config.json');
  const hash = process.env[envKey];

  const diag = {
    envKey,
    configPath,
    hashExists: !!hash,
    hashPrefix: hash ? hash.substring(0, 10) : null,
    cwd: process.cwd(),
    allAuthKeys: Object.keys(process.env).filter(k => k.startsWith('AUTH')),
  };

  // Try loading config
  let configExists = false;
  let userFound = false;
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const clientConfig = JSON.parse(raw);
    configExists = true;
    userFound = !!clientConfig.users.find((u: any) => u.email === email);
  } catch (e: any) {
    return NextResponse.json({ error: 'Config load failed', detail: e.message, diag }, { status: 500 });
  }

  return NextResponse.json({ diag, configExists, userFound }, { status: 200 });
}
