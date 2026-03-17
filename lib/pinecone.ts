import { Pinecone, Index } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';

const apiKey = process.env.PINECONE_API_KEY;
const rawIndexValue = process.env.PINECONE_INDEX || 'rag-chatbot';
const indexName = rawIndexValue;
const indexHost =
  process.env.PINECONE_HOST || (rawIndexValue.startsWith('http') ? rawIndexValue : undefined);
const namespace = process.env.PINECONE_NAMESPACE || 'default';
const recordTextField = process.env.PINECONE_TEXT_FIELD || 'text';
const queryTextField = process.env.PINECONE_QUERY_FIELD || 'text';

let pineconeClient: Pinecone | null = null;
let pineconeIndex: Index | null = null;
let resolvedHost: string | null = null;

export async function getPineconeClient(): Promise<Pinecone> {
  if (!apiKey) {
    throw new Error('PINECONE_API_KEY not configured');
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey,
    });
  }

  return pineconeClient;
}

export async function getPineconeIndex(): Promise<Index> {
  if (pineconeIndex) {
    return pineconeIndex;
  }

  const client = await getPineconeClient();
  let host = indexHost || resolvedHost;

  if (!host && indexName && !indexName.startsWith('http')) {
    try {
      const description = await client.describeIndex(indexName);
      host = description.host;
      resolvedHost = host ?? null;
    } catch (error) {
      console.warn('Unable to resolve Pinecone index host. Set PINECONE_HOST.', error);
    }
  }

  pineconeIndex = host
    ? client.index({ host })
    : client.index({ name: indexName });

  return pineconeIndex;
}

function normalizeMetadataValue(value: unknown): string | number | boolean | Array<string | number | boolean> | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (Array.isArray(value)) {
    const filtered = value.filter(
      (item) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
    ) as Array<string | number | boolean>;
    return filtered.length ? filtered : undefined;
  }
  return String(value);
}

export async function addDocuments(docs: Document[]): Promise<void> {
  const index = await getPineconeIndex();

  const records = docs.map((doc, idx) => {
    const metadata = (doc.metadata || {}) as Record<string, unknown>;
    const idValue = metadata.chunkId ?? metadata.id ?? `${Date.now()}-${idx}`;
    const record: Record<string, unknown> = {
      id: String(idValue),
      [recordTextField]: doc.pageContent,
    };

    Object.entries(metadata).forEach(([key, value]) => {
      if (key === 'id' || key === 'chunkId') return;
      const normalized = normalizeMetadataValue(value);
      if (normalized !== undefined) {
        record[key] = normalized;
      }
    });

    return record;
  });

  await index.upsertRecords({
    records,
    namespace,
  });
}

export async function similaritySearch(
  query: string,
  k: number = 3,
  filter?: Record<string, unknown>
): Promise<Document[]> {
  const results = await similaritySearchWithScores(query, k, filter);
  return results.map(({ doc }) => doc);
}

export async function similaritySearchWithScores(
  query: string,
  k: number = 3,
  filter?: Record<string, unknown>
): Promise<Array<{ doc: Document; score: number }>> {
  const index = await getPineconeIndex();
  const response = await index.searchRecords({
    query: {
      topK: k,
      inputs: { [queryTextField]: query },
      filter,
    },
    fields: [
      recordTextField,
      'title',
      'section',
      'category',
      'source',
      'chunkIndex',
      'totalChunks',
    ],
    namespace,
  });

  const hits = response?.result?.hits ?? [];
  return hits.map((hit) => {
    const fields = (hit.fields || {}) as Record<string, unknown>;
    const pageContent = fields[recordTextField] ?? '';
    return {
      doc: new Document({
        pageContent: typeof pageContent === 'string' ? pageContent : String(pageContent),
        metadata: {
          ...fields,
          id: hit._id,
        },
      }),
      score: hit._score ?? 0,
    };
  });
}

export async function deleteAllDocuments(): Promise<void> {
  const index = await getPineconeIndex();
  await index.deleteAll({ namespace });
}

export async function checkIndexExists(): Promise<boolean> {
  try {
    if (indexHost && indexName.startsWith('http')) {
      return true;
    }
    const client = await getPineconeClient();
    const indexes = await client.listIndexes();
    return indexes.some(idx => idx.name === indexName);
  } catch {
    return false;
  }
}
