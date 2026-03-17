export type ContextType = 'general' | 'nec' | 'wattmonk';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  context?: ContextType;
  sources?: Source[];
  confidence?: number;
  timestamp: Date;
}

export interface Source {
  title: string;
  content: string;
  context: ContextType;
  relevanceScore: number;
  section?: string;
  page?: number;
  chunkId?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentChunk {
  id: string;
  content: string;
  context: ContextType;
  metadata: {
    title: string;
    section?: string;
    page?: number;
    category?: string;
  };
  embedding?: number[];
}

export interface IntentClassification {
  context: ContextType;
  confidence: number;
  reasoning: string;
}

export interface ChatResponse {
  content: string;
  context: ContextType;
  sources: Source[];
  confidence: number;
  suggestions?: string[];
  provider?: string;
  model?: string;
  retrievalSource?: 'pinecone' | 'fallback';
}
