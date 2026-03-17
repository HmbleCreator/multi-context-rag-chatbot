import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const pineconeKey = process.env.PINECONE_API_KEY;

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      gemini: geminiKey ? 'configured' : 'not_configured',
      openrouter: openrouterKey ? 'configured' : 'not_configured',
      nvidia: nvidiaKey ? 'configured' : 'not_configured',
      pinecone: pineconeKey ? 'configured' : 'not_configured',
    },
    version: '1.0.0',
  });
}
