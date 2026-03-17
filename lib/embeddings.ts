import { Document } from '@langchain/core/documents';
import { similaritySearchWithScores as pineconeSearchWithScores } from './pinecone';
import { necCodeDocs } from '@/data/nec-codes';
import { wattmonkDocs } from '@/data/wattmonk-docs';
import { DocumentChunk, ContextType } from '@/types';

const pineconeEnabledByEnv = process.env.PINECONE_ENABLED !== 'false';
const pineconeIndex = process.env.PINECONE_INDEX;
const pineconeHost = process.env.PINECONE_HOST;
const pineconeIndexLooksLikeUrl = !!pineconeIndex && /^https?:\/\//i.test(pineconeIndex);
const hasPineconeEnv = !!process.env.PINECONE_API_KEY && (!!pineconeIndex || !!pineconeHost);
let pineconeDisabled = false;
let pineconeWarned = false;
let pineconeStatusLogged = false;
let pineconeDisabledReason = '';

function isPineconeEnabled(): boolean {
  if (!pineconeEnabledByEnv) return false;
  if (pineconeIndexLooksLikeUrl && !pineconeHost && !pineconeWarned) {
    pineconeWarned = true;
    console.warn('PINECONE_INDEX looks like a host URL. Using it as host (set PINECONE_HOST to silence this warning).');
  }
  return hasPineconeEnv && !pineconeDisabled;
}

const fallbackDocuments: DocumentChunk[] = (() => {
  return [
    ...necCodeDocs.map(doc => ({
      id: doc.id,
      content: doc.content,
      context: 'nec' as ContextType,
      metadata: {
        title: doc.title,
        section: doc.section,
        category: doc.category,
      },
    })),
    ...wattmonkDocs.map(doc => ({
      id: doc.id,
      content: doc.content,
      context: 'wattmonk' as ContextType,
      metadata: {
        title: doc.title,
        section: doc.section,
        category: doc.category,
      },
    })),
  ];
})();

export function appendFallbackDocuments(chunks: DocumentChunk[]): void {
  if (chunks.length === 0) return;
  fallbackDocuments.push(...chunks);
}

export function generateSimpleEmbedding(text: string): number[] {
  const vocabulary = [
    'ground', 'grounding', 'bond', 'bonding', 'conductor', 'circuit', 'breaker',
    'panel', 'outlet', 'receptacle', 'wire', 'cable', 'ampacity', 'voltage',
    'current', 'overcurrent', 'protection', 'electrode', 'service', 'feeder',
    'branch', 'motor', 'hazardous', 'location', 'class', 'division', 'arc',
    'fault', 'gfci', 'afci', 'equipment', 'installation', 'code', 'nec',
    'article', 'section', 'compliance', 'standard', 'requirement',
    'solar', 'panel', 'design', 'permit', 'wattmonk', 'ai', 'automation',
    'roof', 'shading', 'production', 'energy', 'installation', 'project',
    'assessment', 'site', 'survey', 'documentation', 'service', 'pricing',
    'api', 'integration', 'support', 'contact', 'company', 'platform',
    'residential', 'commercial', 'battery', 'storage', 'inverter',
    'help', 'what', 'how', 'why', 'when', 'where', 'who', 'can', 'will',
    'explain', 'tell', 'show', 'information', 'about', 'question', 'answer',
  ];

  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 2);
  
  const embedding = new Array(vocabulary.length).fill(0);
  
  words.forEach(word => {
    const index = vocabulary.indexOf(word);
    if (index !== -1) {
      embedding[index] += 1;
    }
  });

  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    return embedding.map(val => val / magnitude);
  }
  return embedding;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function fallbackSearch(
  query: string,
  contextFilter?: ContextType,
  topK: number = 3
): DocumentChunk[] {
  const queryEmbedding = generateSimpleEmbedding(query);

  let candidates = fallbackDocuments;

  if (contextFilter && contextFilter !== 'general') {
    candidates = fallbackDocuments.filter(doc => doc.context === contextFilter);
  }

  const scored = candidates.map(doc => ({
    doc,
    score: cosineSimilarity(queryEmbedding, generateSimpleEmbedding(doc.content)),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map(s => s.doc);
}

export async function findSimilarDocuments(
  query: string,
  contextFilter?: ContextType,
  topK: number = 3
): Promise<{ docs: DocumentChunk[]; scores: number[]; source: 'pinecone' | 'fallback' }> {
  if (!isPineconeEnabled()) {
    if (!pineconeStatusLogged) {
      pineconeDisabledReason = !pineconeEnabledByEnv
        ? 'PINECONE_ENABLED=false'
        : !hasPineconeEnv
          ? 'Missing Pinecone environment variables'
          : pineconeDisabled
            ? 'Disabled due to a previous error'
            : pineconeIndexLooksLikeUrl && !pineconeHost
              ? 'PINECONE_INDEX looks like a URL and PINECONE_HOST is not set'
              : 'Unknown';
      console.warn('Pinecone disabled, using fallback search:', pineconeDisabledReason);
      pineconeStatusLogged = true;
    }
    const results = fallbackSearch(query, contextFilter, topK);
    return {
      docs: results,
      scores: results.map(doc => 0.85), // Fixed fallback score
      source: 'fallback',
    };
  }

  try {
    const filter = contextFilter && contextFilter !== 'general' 
      ? { category: { $eq: contextFilter } } 
      : undefined;

    const docsWithScores = await pineconeSearchWithScores(query, topK, filter);

    return {
      docs: docsWithScores.map(({ doc, score }) => ({
        id: String(doc.metadata.chunkId || doc.metadata.id || Math.random().toString(36).substr(2, 9)),
        content: doc.pageContent,
        context: (doc.metadata.category as ContextType) || 'general',
        metadata: {
          title: String(doc.metadata.title || 'Untitled'),
          section: String(doc.metadata.section || ''),
          category: String(doc.metadata.category || 'general'),
        },
      })),
      scores: docsWithScores.map(({ score }) => score as number),
      source: 'pinecone',
    };
  } catch (error) {
    if (!pineconeDisabled) {
      pineconeDisabled = true;
      console.error('Pinecone search error, falling back to local and disabling Pinecone for this session:', error);
    }
    const results = fallbackSearch(query, contextFilter, topK);
    return {
      docs: results,
      scores: results.map(doc => 0.85), // Fixed fallback score
      source: 'fallback',
    };
  }
}

export const documentChunks = fallbackDocuments;
