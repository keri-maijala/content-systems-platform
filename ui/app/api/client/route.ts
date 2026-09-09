import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(process.cwd(), '..');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientKey = searchParams.get('client') || 'demo';

  const configPath = path.join(REPO_ROOT, 'clients', clientKey, 'config.json');

  if (!fs.existsSync(configPath)) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  return NextResponse.json({
    clientKey,
    clientName: config.client?.name || clientKey,
    domains: (config.domains || []).map((d: { name: string }) => d.name),
  });
}
