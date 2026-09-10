import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || '');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO = 'keri-maijala/content-systems-platform';

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

async function loadRequestsFromGitHub(clientKey: string) {
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/clients/${clientKey}/logs/requests.json`;
  const res = await fetch(apiUrl, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const file = await res.json();
  const content = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));
  return { data: content, sha: file.sha };
}

async function saveRequestsToGitHub(clientKey: string, data: any, sha: string) {
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/clients/${clientKey}/logs/requests.json`;
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Update request status', content, sha }),
  });
  if (!res.ok) throw new Error(`GitHub write ${res.status}`);
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
  return requests.filter(r =>
    r.originator === email || r.watchers?.includes(email)
  );
}

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clientKey = session.clientKey as string;

  try {
    const { data } = await loadRequestsFromGitHub(clientKey);
    const filtered = filterForUser(data.requests, session);
    return NextResponse.json({ requests: filtered });
  } catch {
    return NextResponse.json({ error: 'Could not load requests' }, { status: 500 });
  }
}

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
    const { data, sha } = await loadRequestsFromGitHub(clientKey);
    const request = data.requests.find((r: any) => r.id === requestId);

    if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (role === 'domain_owner') {
      const domains = (session.domains as string[]) || [];
      if (!domains.includes(request.domain)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    request.status = status;
    request.updatedAt = new Date().toISOString();
    if (status === 'resolved') request.resolvedAt = new Date().toISOString();

    await saveRequestsToGitHub(clientKey, data, sha);
    return NextResponse.json({ ok: true, request });
  } catch (e: any) {
    return NextResponse.json({ error: 'Could not update request' }, { status: 500 });
  }
}
