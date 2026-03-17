'use client';

import { ChatContainer } from '@/components/ChatContainer';
import { Zap, Sun, MessageCircle, Github } from 'lucide-react';
import { ModelSelector, AIModelProvider } from '@/components/ModelSelector';
import { useState } from 'react';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<AIModelProvider>('openrouter-hunter-alpha');

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-transparent">
      {/* Header */}
      <header className="relative z-50 border-b border-gray-200/70 bg-white/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-0 sm:px-2 lg:max-w-7xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg">
              <MessageCircle size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">RAG Chatbot</h1>
              <p className="text-xs text-gray-500">Context-aware assistant for NEC and Wattmonk</p>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
            {/* Model Selector */}
            <div className="w-full sm:w-72">
              <ModelSelector 
                onModelChange={setSelectedModel} 
                selectedModel={selectedModel} 
              />
            </div>

            {/* Context Indicators */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1 rounded-full bg-nec-100 px-2 py-1 text-nec-700">
                <Zap size={12} />
                <span>NEC</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-wattmonk-100 px-2 py-1 text-wattmonk-700">
                <Sun size={12} />
                <span>Wattmonk</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                <MessageCircle size={12} />
                <span>General</span>
              </div>
            </div>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-full min-h-0 overflow-hidden">
        <div className="relative z-10 flex h-full w-full min-h-0 max-w-none px-3 sm:px-6 lg:px-10">
          <ChatContainer selectedModel={selectedModel} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/70 bg-white/80 px-4 py-3 text-center text-xs text-gray-500 backdrop-blur">
        <p>
          This chatbot uses AI to answer questions. Responses may not be 100% accurate.
          Always consult official NEC documentation and Wattmonk support for critical decisions.
        </p>
      </footer>
    </div>
  );
}
