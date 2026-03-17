import { NextRequest, NextResponse } from 'next/server';
import { processDocument, detectCategory } from '@/lib/document-processor';
import { addDocuments } from '@/lib/pinecone';
import { appendFallbackDocuments } from '@/lib/embeddings';
import { DocumentChunk, ContextType } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const detectedCategory = category || detectCategory(buffer.toString('utf-8'));
    
    const documents = await processDocument(buffer, file.name, detectedCategory);

    let storedInPinecone = true;
    let pineconeError: string | null = null;

    try {
      await addDocuments(documents);
    } catch (error) {
      storedInPinecone = false;
      pineconeError = error instanceof Error ? error.message : 'Unknown Pinecone error';
      // Fallback: store in local in-memory corpus if Pinecone fails
      const chunks: DocumentChunk[] = documents.map((doc, index) => ({
        id: String((doc as any).metadata?.id || `${file.name}-${index}`),
        content: doc.pageContent,
        context: (doc as any).metadata?.category as ContextType || 'general',
        metadata: {
          title: String((doc as any).metadata?.title || file.name),
          section: String((doc as any).metadata?.section || ''),
          category: String((doc as any).metadata?.category || 'general'),
        },
      }));
      appendFallbackDocuments(chunks);
      console.warn('Pinecone ingest failed, stored documents locally for this session:', error);
    }

    console.log(`Document processed: ${file.name} (${documents.length} chunks) storedInPinecone=${storedInPinecone}`);

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${documents.length} document chunks`,
      documentCount: documents.length,
      filename: file.name,
      category: detectedCategory,
      storedInPinecone,
      pineconeError,
    });
  } catch (error) {
    console.error('Document processing error:', error);
    
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    if (message.includes('PINECONE_API_KEY')) {
      return NextResponse.json(
        { error: 'Vector database not configured. Please set PINECONE_API_KEY.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to process document: ${message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST a PDF file to process and add to the vector store',
    supportedMethods: ['POST'],
    parameters: {
      file: 'PDF file (required)',
      category: 'Category: nec, wattmonk, or general (optional, auto-detected)',
    },
  });
}
