import { Message, ContextType, Source } from '@/types';
import type { ChatResponse } from '@/types';
import { findSimilarDocuments } from './embeddings';
import { classifyIntent, getSystemPrompt } from './context-detector';
import { generateQuerySuggestions } from './query-utils';
import { detectLanguage, getTranslation } from './i18n';
import { createAIProvider, AIProvider } from './ai-provider';

const geminiApiKey = process.env.GEMINI_API_KEY;
const openrouterApiKey = process.env.OPENROUTER_API_KEY;
const nvidiaApiKey = process.env.NVIDIA_API_KEY;

const DEFAULT_MODELS: Record<AIProvider, string> = {
  gemini: 'gemini-2.0-flash',
  openrouter: 'deepseek/deepseek-chat-v3-0324:free',
  nvidia: 'deepseek/deepseek-r1-0528',
};

const MODEL_ALIASES: Record<string, { provider: AIProvider; model?: string }> = {
  // Gemini
  'gemini-2.0-flash': { provider: 'gemini', model: 'gemini-2.0-flash' },
  'gemini-2.0-pro': { provider: 'gemini', model: 'gemini-2.0-pro' },

  // OpenRouter (aliases from UI)
  'deepseek-chat-v3-free': {
    provider: 'openrouter',
    model: process.env.OPENROUTER_MODEL_DEEPSEEK_V3 || DEFAULT_MODELS.openrouter,
  },
  'deepseek-r1-free': {
    provider: 'openrouter',
    model: process.env.OPENROUTER_MODEL_DEEPSEEK_R1 || DEFAULT_MODELS.openrouter,
  },
  'llama-3.2-3b-free': {
    provider: 'openrouter',
    model: process.env.OPENROUTER_MODEL_LLAMA_3_2_3B,
  },
  'mixtral-8x7b-free': {
    provider: 'openrouter',
    model: process.env.OPENROUTER_MODEL_MIXTRAL_8X7B,
  },
  'qwen3-235b-free': {
    provider: 'openrouter',
    model: process.env.OPENROUTER_MODEL_QWEN3_235B,
  },

  // NVIDIA (aliases from UI)
  'nvidia-deepseek-r1': {
    provider: 'nvidia',
    model: process.env.NVIDIA_MODEL_DEEPSEEK_R1 || DEFAULT_MODELS.nvidia,
  },
  'nvidia-qwen3': {
    provider: 'nvidia',
    model: process.env.NVIDIA_MODEL_QWEN3,
  },
};

function getDefaultProvider(): AIProvider {
  const envProvider = (process.env.AI_PROVIDER || '').toLowerCase();
  if (envProvider === 'gemini' || envProvider === 'openrouter' || envProvider === 'nvidia') {
    return envProvider as AIProvider;
  }
  return 'gemini';
}

function getOpenRouterFallbackModel(): string {
  return process.env.OPENROUTER_MODEL_DEEPSEEK_V3 || DEFAULT_MODELS.openrouter;
}

// Determine provider from model name or use default
function getProviderFromModel(model: string | undefined): AIProvider {
  if (!model) return getDefaultProvider();

  const alias = MODEL_ALIASES[model];
  if (alias) return alias.provider;

  if (model.startsWith('gemini-')) return 'gemini';
  if (model.startsWith('deepseek-') || model.startsWith('llama-') || model.startsWith('mixtral-') || model.startsWith('qwen')) return 'openrouter';
  if (model.startsWith('nvidia-')) return 'nvidia';

  return getDefaultProvider();
}

// Determine model name for the provider
function getModelNameForProvider(model: string | undefined, provider: AIProvider): string {
  if (model) {
    const alias = MODEL_ALIASES[model];
    if (alias && alias.provider === provider) {
      return alias.model || DEFAULT_MODELS[provider];
    }

    // If the UI sent a provider-prefixed alias we don't recognize, use default for that provider
    if (model.startsWith('nvidia-') || model.startsWith('deepseek-') || model.startsWith('llama-') || model.startsWith('mixtral-') || model.startsWith('qwen')) {
      return DEFAULT_MODELS[provider];
    }

    return model;
  }

  return DEFAULT_MODELS[provider];
}

export async function generateResponse(
  userMessage: string,
  history: Message[],
  model?: string
): Promise<ChatResponse> {
  // Step 1: Classify the intent
  const intent = classifyIntent(userMessage);
  console.log('Intent classification:', intent);

  // Step 2: Retrieve relevant documents
  const { docs: relevantDocs, scores, source } = await findSimilarDocuments(userMessage, intent.context, 3);
  const sources: Source[] = relevantDocs.map((doc, index) => ({
    title: doc.metadata.title,
    content: doc.content.substring(0, 500) + (doc.content.length > 500 ? '...' : ''),
    context: doc.context,
    relevanceScore: scores[index] || 0.85,
    section: doc.metadata.section,
    chunkId: doc.id
  }));
   
  // Calculate answer confidence based on source relevance and intent confidence
  const avgRelevance = scores.reduce((sum, score) => sum + score, 0) / scores.length || 0;
  const answerConfidence = Math.min(0.95, (intent.confidence * 0.3) + (avgRelevance * 0.7));

  // Step 3: Build the prompt
  const systemPrompt = getSystemPrompt(intent.context);

  let contextPrompt = '';
  if (relevantDocs.length > 0) {
    const header = intent.context === 'general' ? 'User-provided context:' : 'Relevant context:';
    contextPrompt = `\n\n${header}\n` + relevantDocs
      .map((doc, i) => `[${i + 1}] ${doc.metadata.title}:\n${doc.content}`)
      .join('\n\n');
  }

  // Determine provider and model
  const provider = getProviderFromModel(model);
  const modelName = getModelNameForProvider(model, provider);
  let finalProvider: AIProvider = provider;
  let finalModel = modelName;
  
  const hasApiKey = provider === 'gemini' ? !!geminiApiKey : provider === 'openrouter' ? !!openrouterApiKey : !!nvidiaApiKey;
  console.log('Provider:', provider, 'Model:', modelName, 'API Key available:', hasApiKey);
    
  // Create provider instance for this request
  const providerInstance = createAIProvider(
    provider,
    provider === 'gemini' ? geminiApiKey :
      provider === 'openrouter' ? openrouterApiKey :
      provider === 'nvidia' ? nvidiaApiKey :
      null,
    modelName
  );

  // Step 4: Generate response using selected AI provider
  try {
    console.log('Calling AI provider...');
    const aiResponse = await providerInstance.generateResponse(
      systemPrompt + contextPrompt,
      [
        ...history.slice(-4).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ]
    );
    const shouldFallback = (content: string) => {
      const normalized = content.toLowerCase();
      return normalized.includes('rate-limited') ||
        normalized.includes('quota') ||
        normalized.includes('provider') && normalized.includes('try another') ||
        normalized.includes('model not found') ||
        normalized.includes('check your api');
    };

    if (provider !== 'openrouter' && openrouterApiKey && shouldFallback(aiResponse.content)) {
      console.warn(`Provider ${provider} failed, retrying with OpenRouter...`);
      const fallbackModel = getOpenRouterFallbackModel();
      const fallbackProvider = createAIProvider('openrouter', openrouterApiKey, fallbackModel);
      const fallbackResponse = await fallbackProvider.generateResponse(
        systemPrompt + contextPrompt,
        [
          ...history.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: userMessage
          }
        ]
      );
      finalProvider = 'openrouter';
      finalModel = fallbackModel;
      console.log('AI Response received (OpenRouter fallback):', fallbackResponse.content.substring(0, 100));
      return {
        content: fallbackResponse.content,
        context: intent.context,
        sources,
        confidence: answerConfidence,
        suggestions: generateQuerySuggestions(userMessage, intent.context, sources),
        provider: finalProvider,
        model: finalModel,
        retrievalSource: source
      };
    }

    console.log('AI Response received:', aiResponse.content.substring(0, 100));

    return {
      content: aiResponse.content,
      context: intent.context,
      sources,
      confidence: answerConfidence,
      suggestions: generateQuerySuggestions(userMessage, intent.context, sources),
      provider: finalProvider,
      model: finalModel,
      retrievalSource: source
    };
  } catch (error) {
    console.error(`${provider} API error:`, error);
    return {
      content: generateFallbackResponse(userMessage, intent.context, relevantDocs),
      context: intent.context,
      sources,
      confidence: intent.confidence,
      retrievalSource: source
    };
  }
}

export async function streamResponse(
  userMessage: string,
  history: Message[],
  onChunk: (chunk: string) => void,
  model?: string
): Promise<ChatResponse> {
  const intent = classifyIntent(userMessage);
  const lang = detectLanguage(userMessage);
  const { docs: relevantDocs, scores, source } = await findSimilarDocuments(userMessage, intent.context, 3);
  const sources: Source[] = relevantDocs.map((doc, index) => ({
    title: doc.metadata.title,
    content: doc.content.substring(0, 500) + (doc.content.length > 500 ? '...' : ''),
    context: doc.context,
    relevanceScore: scores[index] || 0.85,
    section: doc.metadata.section,
    chunkId: doc.id
  }));
   
  // Calculate answer confidence based on source relevance and intent confidence
  const avgRelevance = scores.reduce((sum, score) => sum + score, 0) / scores.length || 0;
  const answerConfidence = Math.min(0.95, (intent.confidence * 0.3) + (avgRelevance * 0.7));

  // Determine provider and model
  const provider = getProviderFromModel(model);
  const modelName = getModelNameForProvider(model, provider);
  let finalProvider: AIProvider = provider;
  let finalModel = modelName;
   
  // Create provider instance for this request
  const providerInstance = createAIProvider(
    provider,
    provider === 'gemini' ? geminiApiKey :
      provider === 'openrouter' ? openrouterApiKey :
      provider === 'nvidia' ? nvidiaApiKey :
      null,
    modelName
  );

  try {
    await providerInstance.generateResponseStream(
      getSystemPrompt(intent.context),
      [
        ...history.slice(-4).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ],
      onChunk
    );

    return {
      content: '', // Content is streamed via onChunk
      context: intent.context,
      sources,
      confidence: answerConfidence,
      suggestions: generateQuerySuggestions(userMessage, intent.context, sources),
      provider: finalProvider,
      model: finalModel,
      retrievalSource: source
    };
  } catch (error) {
    console.error(`${provider} streaming error:`, error);
    const fallback = generateFallbackResponse(userMessage, intent.context, relevantDocs);
    onChunk(fallback);
    return {
      content: fallback,
      context: intent.context,
      sources,
      confidence: intent.confidence,
      provider: finalProvider,
      model: finalModel,
      retrievalSource: source
    };
  }
}

function generateFallbackResponse(
  query: string,
  context: ContextType,
  docs: { metadata: { title: string }; content: string }[]
): string {
  const lang = detectLanguage(query);
   
  if (context === 'general') {
    return getTranslation('fallbackGeneral', lang);
  }

  // For domain-specific queries, return relevant document content
  if (docs.length > 0) {
    const doc = docs[0];
    const baseText = `Based on the available information:\n\n**${doc.metadata.title}**\n\n${doc.content.substring(0, 800)}${doc.content.length > 800 ? '...' : ''}\n\n_Note: This is a simplified response. For more detailed answers, please ensure your API key is configured._`;
    // For now, return in English as translating large documents is complex
    return baseText;
  }

  const topic = context === 'nec' ? 'electrical codes' : 'Wattmonk services';
  return getTranslation('fallbackNoInfo', lang, { topic });
}
