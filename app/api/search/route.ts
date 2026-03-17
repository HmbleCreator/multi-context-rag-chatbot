import { NextRequest, NextResponse } from 'next/server';
import { findSimilarDocuments } from '@/lib/embeddings';
import { classifyIntent } from '@/lib/context-detector';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Classify intent to determine context
    const intent = classifyIntent(query);

    // Search documents
    const { docs: documents, source } = await findSimilarDocuments(query, intent.context, 5);

    return NextResponse.json({
      query,
      context: intent.context,
      confidence: intent.confidence,
      source,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.metadata.title,
        content: doc.content.substring(0, 300) + '...',
        context: doc.context,
        section: doc.metadata.section,
      })),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
