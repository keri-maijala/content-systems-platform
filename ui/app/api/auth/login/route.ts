import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Temporary debug — remove after diagnosis
  const hasJwtSecret = !!process.env.AUTH_JWT_SECRET;
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const jwtLength = process.env.AUTH_JWT_SECRET?.length || 0;

  return NextResponse.json({
    hasJwtSecret,
    hasAnthropicKey,
    jwtLength,
    nodeEnv: process.env.NODE_ENV,
  });
}
