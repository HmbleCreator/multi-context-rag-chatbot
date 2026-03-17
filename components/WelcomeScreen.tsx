'use client';

import { Zap, Sun, MessageCircle, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onExampleClick?: (example: string) => void;
}

const examples = {
  nec: [
    'What are the grounding requirements for a service panel?',
    'Explain GFCI protection requirements',
    'What is the minimum cover for underground cables?',
    'Tell me about arc fault circuit interrupters',
  ],
  wattmonk: [
    'What services does Wattmonk offer?',
    'How much does Wattmonk cost?',
    'What is the AI Design Platform?',
    'How do I contact Wattmonk support?',
  ],
  general: [
    'What can you help me with?',
    'How does this chatbot work?',
    'Tell me about yourself',
  ],
};

export function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          RAG Chatbot
        </h1>
        <p className="max-w-md text-gray-600">
          Ask me about electrical codes (NEC), Wattmonk services, or just have a conversation.
          I automatically detect the context of your questions.
        </p>
      </div>

      {/* Context Cards */}
      <div className="grid w-full max-w-3xl gap-4 px-4 sm:grid-cols-3">
        {/* NEC Card */}
        <div className="rounded-xl border border-nec-200 bg-nec-50 p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-nec-500 text-white">
            <Zap size={20} />
          </div>
          <h3 className="mb-2 font-semibold text-nec-900">NEC Codes</h3>
          <p className="mb-3 text-sm text-nec-700">
            National Electrical Code guidelines and standards
          </p>
          <ul className="space-y-1 text-left text-xs text-nec-600">
            {examples.nec.slice(0, 2).map((ex, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="mt-0.5">-</span>
                <button
                  onClick={() => onExampleClick?.(ex)}
                  className="text-left hover:underline"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Wattmonk Card */}
        <div className="rounded-xl border border-wattmonk-200 bg-wattmonk-50 p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-wattmonk-500 text-white">
            <Sun size={20} />
          </div>
          <h3 className="mb-2 font-semibold text-wattmonk-900">Wattmonk</h3>
          <p className="mb-3 text-sm text-wattmonk-700">
            Company documentation and services
          </p>
          <ul className="space-y-1 text-left text-xs text-wattmonk-600">
            {examples.wattmonk.slice(0, 2).map((ex, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="mt-0.5">-</span>
                <button
                  onClick={() => onExampleClick?.(ex)}
                  className="text-left hover:underline"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* General Card */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500 text-white">
            <MessageCircle size={20} />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">General</h3>
          <p className="mb-3 text-sm text-gray-600">
            General conversation and questions
          </p>
          <ul className="space-y-1 text-left text-xs text-gray-600">
            {examples.general.map((ex, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="mt-0.5">-</span>
                <button
                  onClick={() => onExampleClick?.(ex)}
                  className="text-left hover:underline"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Start */}
      <div className="flex flex-wrap justify-center gap-2">
        <span className="text-sm text-gray-500">Try asking:</span>
        {[
          ...examples.nec.slice(0, 1),
          ...examples.wattmonk.slice(0, 1),
          ...examples.general.slice(0, 1),
        ].map((example, i) => (
          <button
            key={i}
            onClick={() => onExampleClick?.(example)}
            className="group inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700 transition-colors hover:bg-primary-100"
          >
            {example}
            <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}

