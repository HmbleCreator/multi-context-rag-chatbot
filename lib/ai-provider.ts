import { Message } from '@/types';
import { detectLanguage } from './i18n';

function getFriendlyErrorMessage(error: unknown, provider?: AIProvider): string {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (normalized.includes('429') || normalized.includes('quota') || normalized.includes('rate limit')) {
    return 'The AI provider is rate-limited or quota is exceeded. Please wait a bit or switch providers.';
  }

  if (normalized.includes('401') || normalized.includes('403') || normalized.includes('unauthorized')) {
    return 'The AI provider rejected the request. Please check your API key.';
  }

  if (provider === 'nvidia' && normalized.includes('404')) {
    return 'NVIDIA model not found. Please verify the NVIDIA model ID configured for your key.';
  }

  return "I couldn't reach the AI provider. Please check your API configuration or try another provider.";
}

function generateFallbackResponse(error?: unknown, provider?: AIProvider): string {
  return getFriendlyErrorMessage(error, provider);
}

export type AIProvider = 'gemini' | 'openrouter' | 'nvidia';

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

// Abstract AI provider interface
export abstract class BaseAIProvider {
  abstract generateResponse(
    prompt: string,
    history: Message[]
  ): Promise<AIResponse>;

  abstract generateResponseStream(
    prompt: string,
    history: Message[],
    onChunk: (chunk: string) => void
  ): Promise<AIResponse>;
}

// Gemini provider (wraps existing implementation)
export class GeminiProvider extends BaseAIProvider {
  private apiKey: string | null;
  private modelName: string;

  constructor(apiKey: string | null, modelName: string = 'gemini-2.0-flash') {
    super();
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async generateResponse(
    prompt: string,
    history: Message[]
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      return { content: generateFallbackResponse(prompt) };
    }

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: this.modelName });

      const chatHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(prompt);
      const text = result.response.text();
      
      return {
        content: text || '',
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return { content: generateFallbackResponse(error, 'gemini') };
    }
  }

  async generateResponseStream(
    prompt: string,
    history: Message[],
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      const fallback = generateFallbackResponse(prompt);
      onChunk(fallback);
      return { content: fallback };
    }

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: this.modelName });

      const chatHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessageStream(prompt);
      let fullText = '';
      
      const stream = (result as { stream?: AsyncIterable<{ text: () => string }> }).stream;
      const iterable = stream ?? (result as unknown as AsyncIterable<{ text: () => string }>);

      for await (const chunk of iterable) {
        const text = chunk.text();
        fullText += text;
        onChunk(text);
      }
      
      return { content: fullText };
    } catch (error) {
      console.error('Gemini streaming error:', error);
      const fallback = generateFallbackResponse(error, 'gemini');
      onChunk(fallback);
      return { content: fallback };
    }
  }
}

// OpenRouter provider
export class OpenRouterProvider extends BaseAIProvider {
  private apiKey: string | null;
  private modelName: string;

  constructor(apiKey: string | null, modelName: string = 'anthropic/claude-3.5-sonnet') {
    super();
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async generateResponse(
    prompt: string,
    history: Message[]
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        content: generateFallbackResponse(prompt), // Simplified
      };
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            ...history.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`OpenRouter API error: ${response.status} ${errorText}`.trim());
      }

      const data = await response.json();
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage
      };
    } catch (error) {
      console.error('OpenRouter API error:', error);
      return {
        content: generateFallbackResponse(error, 'openrouter'),
      };
    }
  }

  async generateResponseStream(
    prompt: string,
    history: Message[],
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      const fallback = generateFallbackResponse(prompt); // Simplified
      onChunk(fallback);
      return { content: fallback };
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            ...history.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`OpenRouter API error: ${response.status} ${errorText}`.trim());
      }

      const encoder = new TextEncoder();
      let fullText = '';

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No readable stream');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6);
              if (dataStr === '[DONE]') {
                break;
              }

              try {
                const data = JSON.parse(dataStr);
                const content = data.choices[0]?.delta?.content || '';
                if (content) {
                  fullText += content;
                  onChunk(content);
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return { content: fullText };
    } catch (error) {
      console.error('OpenRouter streaming error:', error);
      const fallback = generateFallbackResponse(error, 'openrouter');
      onChunk(fallback);
      return { content: fallback };
    }
  }
}

// NVIDIA provider
export class NVIDIAProvider extends BaseAIProvider {
  private apiKey: string | null;
  private modelName: string;

  constructor(apiKey: string | null, modelName: string = 'stepfun-ai/step-3.5-flash') {
    super();
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async generateResponse(
    prompt: string,
    history: Message[]
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        content: generateFallbackResponse(prompt), // Simplified
      };
    }

    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            ...history.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 1,
          top_p: 0.9,
          max_tokens: 16384,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`NVIDIA API error: ${response.status} ${errorText}`.trim());
      }

      const data = await response.json();
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage
      };
    } catch (error) {
      console.error('NVIDIA API error:', error);
      return {
        content: generateFallbackResponse(error, 'nvidia'),
      };
    }
  }

  async generateResponseStream(
    prompt: string,
    history: Message[],
    onChunk: (chunk: string) => void
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      const fallback = generateFallbackResponse(prompt); // Simplified
      onChunk(fallback);
      return { content: fallback };
    }

    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            ...history.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 1,
          top_p: 0.9,
          max_tokens: 16384,
          stream: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`NVIDIA API error: ${response.status} ${errorText}`.trim());
      }

      let fullText = '';
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No readable stream');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          
          // Handle NVIDIA's streaming format
          try {
            const data = JSON.parse(chunk);
            
            // Handle reasoning content
            const reasoning = data.choices[0]?.delta?.reasoning_content;
            if (reasoning) {
              // For now, we'll just log reasoning or could send it separately
              console.log('Reasoning:', reasoning);
            }
            
            // Handle regular content
            const content = data.choices[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(content);
            }
          } catch (e) {
            // Ignore parsing errors for non-JSON chunks
          }
        }
      } finally {
        reader.releaseLock();
      }

      return { content: fullText };
    } catch (error) {
      console.error('NVIDIA streaming error:', error);
      const fallback = generateFallbackResponse(error, 'nvidia');
      onChunk(fallback);
      return { content: fallback };
    }
  }
}

// Factory to create the appropriate provider
export function createAIProvider(
  provider: AIProvider = 'gemini',
  apiKey: string | null = null,
  modelName: string | null = null
): BaseAIProvider {
  switch (provider) {
    case 'openrouter':
      return new OpenRouterProvider(apiKey, modelName || 'deepseek/deepseek-chat-v3-0324:free');
    case 'nvidia':
      return new NVIDIAProvider(apiKey, modelName || 'deepseek/deepseek-r1-0528');
    case 'gemini':
    default:
      return new GeminiProvider(apiKey, modelName || 'gemini-2.0-flash');
  }
}
