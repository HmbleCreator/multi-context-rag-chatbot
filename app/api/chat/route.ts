import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, streamResponse } from '@/lib/gemini';
import { Message } from '@/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { message, history, model } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if streaming is requested
    const accept = req.headers.get('accept');
    const isStreaming = accept?.includes('text/event-stream');

    if (isStreaming) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const sendChunk = (chunk: string) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          };

          try {
            const result = await streamResponse(
              message,
              (history || []) as Message[],
              sendChunk,
              model as string | undefined
            );

            // Send final result with metadata
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  context: result.context,
                  sources: result.sources,
                  confidence: result.confidence,
                  suggestions: result.suggestions || [],
                  provider: result.provider,
                  model: result.model,
                })}\n\n`
              )
            );
          } catch (error) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: 'Stream processing failed' })}\n\n`
              )
            );
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const result = await generateResponse(
      message,
      (history || []) as Message[],
      model as string | undefined
    );

    return NextResponse.json({
      content: result.content,
      context: result.context,
      sources: result.sources,
      confidence: result.confidence,
      suggestions: result.suggestions || [],
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
