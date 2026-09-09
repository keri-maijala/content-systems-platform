import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    anthropicKeyExists: !!process.env.ANTHROPIC_API_KEY,
    jwtSecretExists: !!process.env.AUTH_JWT_SECRET,
    testVarExists: !!process.env.TEST_VAR,
    allAuthKeys: Object.keys(process.env).filter(k => k.startsWith('AUTH')),
  });
}
