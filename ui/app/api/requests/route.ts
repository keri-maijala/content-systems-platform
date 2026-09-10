import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || '');

async function getSession(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

function loadRequests(clientKey: string) {
  const filePath = path.join(process.cwd(), '..', 'clients', clientKey, 'logs', 'requests.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function saveRequests(clientKey: string, data: any) {
  const filePath = path.join(process.cwd(), '..', 'clients', clientKey, 'logs', 'requests.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function filterForUser(requests: any[], session: any) {
  const role = session.role as string;
  const email = session.sub as string;
  const domains = (session.domains as string[]) || [];

  if (role === 'content_owner') return requests;

  if (role === 'domain_owner') {
    return requests.filter(r =>
      domains.includes(r.domain) ||
      r.watchers?.includes(email) ||
      r.originator === email
    );
  }

  // contributor
  return requests.filter(r =>
    r.originator === email || r.watchers?.includes(email)
  );
}

// GET — list requests
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clientKey = session.clientKey as string;

  try {
    const data = loadRequests(clientKey);
    const filtered = filterForUser(data.requests, session);
    return NextResponse.json({ requests: filtered });
  } catch {
    return NextResponse.json({ error: 'Could not load requests' }, { status: 500 });
  }
}

// PATCH — resolve a request
export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = session.role as string;
  if (!['content_owner', 'domain_owner'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { requestId, status } = await req.json();
  const clientKey = session.clientKey as string;

  try {
    const data = loadRequests(clientKey);
    const request = data.requests.find((r: any) => r.id === requestId);

    if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Domain owners can only resolve requests in their domains
    if (role === 'domain_owner') {
      const domains = (session.domains as string[]) || [];
      if (!domains.includes(request.domain)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    request.status = status;
    request.updatedAt = new Date().toISOString();
    if (status === 'resolved') {
      request.resolvedAt = new Date().toISOString();
    }

    saveRequests(clientKey, data);
    return NextResponse.json({ ok: true, request });
  } catch {
    return NextResponse.json({ error: 'Could not update request' }, { status: 500 });
  }
}
