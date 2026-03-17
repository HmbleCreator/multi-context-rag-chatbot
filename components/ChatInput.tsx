'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={cn(
            'max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none',
            'placeholder:text-gray-400',
            isLoading && 'opacity-50'
          )}
          style={{ height: 'auto' }}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all',
            message.trim() && !isLoading
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-gray-100 text-gray-400'
          )}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
