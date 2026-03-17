'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { generateId } from '@/lib/utils';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { SearchPanel } from './SearchPanel';
import { UploadPanel } from './UploadPanel';
import { Loader2 } from 'lucide-react';
import { AIModelProvider } from './ModelSelector';

interface ChatContainerProps {
  selectedModel: AIModelProvider;
}

export function ChatContainer({ selectedModel }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [providerStatus, setProviderStatus] = useState<{ provider?: string; model?: string; retrieval?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    setSuggestions([]);
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-10), // Keep last 10 messages for context
          model: selectedModel, // Pass selected model
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
        context: data.context,
        sources: data.sources,
        confidence: data.confidence,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestions(data.suggestions || []);
      setProviderStatus({ provider: data.provider, model: data.model, retrieval: data.retrievalSource });
    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    handleSend(example);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="grid h-full min-h-0 w-full grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
          <div className="rounded-3xl border border-gray-200/80 bg-white/80 shadow-sm">
            <SearchPanel onAsk={handleSend} />
          </div>
          <UploadPanel />
          <div className="rounded-3xl border border-gray-200/80 bg-white/70 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Quick intents</h2>
            <p className="mt-1 text-xs text-gray-500">
              The assistant auto-detects NEC and Wattmonk queries.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {['NEC grounding', 'Wattmonk pricing', 'Permitting workflow'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-700 transition-colors hover:bg-gray-100"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white/85 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/70 bg-white/80 px-4 py-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Provider</span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700">
                {providerStatus.provider || '--'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-600">
              <span className="text-gray-400">Model</span>
              <span className="font-medium text-gray-700">
                {providerStatus.model || '--'}
              </span>
              <span className="text-gray-400">RAG</span>
              <span className="font-medium text-gray-700">
                {providerStatus.retrieval || '--'}
              </span>
            </div>
          </div>
          {/* Messages Area */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {!hasMessages ? (
              <WelcomeScreen onExampleClick={handleExampleClick} />
            ) : (
              <div className="space-y-3 px-4 py-6 sm:px-6 lg:px-8">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="animate-spin text-primary-500" size={24} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200/80 bg-white/90 p-4">
            {suggestions.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500">Suggested:</span>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(suggestion)}
                    className="rounded-full bg-primary-50 px-3 py-1 text-primary-700 transition-colors hover:bg-primary-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <ChatInput
              onSend={handleSend}
              isLoading={isLoading}
              placeholder="Ask about NEC codes, Wattmonk, or anything else..."
            />
          </div>
        </section>
      </div>
    </div>
  );
}
