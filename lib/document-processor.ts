import pdf from 'pdf-parse';

interface Document {
  pageContent: string;
  metadata: Record<string, unknown>;
}

export interface ProcessedDocument {
  id: string;
  title: string;
  content: string;
  metadata: {
    title: string;
    source: string;
    category: string;
    page?: number;
  };
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

function splitText(text: string, chunkSize: number, chunkOverlap: number): string[] {
  const chunks: string[] = [];
  const separators = ['\n\n', '\n', '. ', ' ', ''];
  
  for (const separator of separators) {
    const parts = text.split(separator);
    let currentChunk = '';
    
    for (const part of parts) {
      if ((currentChunk + part).length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = part;
      } else {
        currentChunk += (currentChunk ? separator : '') + part;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    if (chunks.length > 1) break;
  }
  
  if (chunks.length === 0) {
    chunks.push(text);
  }
  
  return chunks;
}

export function chunkText(
  text: string,
  options: {
    chunkSize?: number;
    chunkOverlap?: number;
    separators?: string[];
  } = {}
): string[] {
  const {
    chunkSize = 1000,
    chunkOverlap = 200,
  } = options;

  return splitText(text, chunkSize, chunkOverlap);
}

export function createDocumentsFromChunks(
  chunks: string[],
  metadata: {
    title: string;
    source: string;
    category: string;
  }
): Document[] {
  return chunks.map((chunk, index) => {
    const docId = `${metadata.source}-${index}`;
    const enrichedChunk = metadata.title ? `${metadata.title}\n\n${chunk}` : chunk;
    
    return {
      pageContent: enrichedChunk,
      metadata: {
        ...metadata,
        chunkIndex: index,
        totalChunks: chunks.length,
        id: docId,
      },
    };
  });
}

export async function processDocument(
  buffer: Buffer,
  filename: string,
  category: string = 'general'
): Promise<Document[]> {
  const text = await extractTextFromPDF(buffer);
  
  const title = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
  
  const chunks = chunkText(text);
  
  const documents = createDocumentsFromChunks(chunks, {
    title,
    source: filename,
    category,
  });
  
  return documents;
}

export function detectCategory(text: string): string {
  const necKeywords = ['nec', 'electrical code', 'grounding', 'conductor', 'circuit', 'breaker', 'voltage', 'ampacity'];
  const solarKeywords = ['solar', 'photovoltaic', 'pv', 'panel', 'inverter', 'wattmonk', 'permit', 'design'];
  
  const lower = text.toLowerCase();
  
  let necCount = 0;
  let solarCount = 0;
  
  necKeywords.forEach(k => { if (lower.includes(k)) necCount++; });
  solarKeywords.forEach(k => { if (lower.includes(k)) solarCount++; });
  
  if (necCount > solarCount && necCount > 2) return 'nec';
  if (solarCount > necCount && solarCount > 2) return 'wattmonk';
  return 'general';
}
