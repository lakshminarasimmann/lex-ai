'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import Card from '@/components/ui/Card';

interface ChatInterfaceProps {
  docId: string;
  clauses: any[];
  docType?: string;
}

export default function ChatInterface({ docId, clauses, docType = 'agreement' }: ChatInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage } = useChat(docId, clauses, docType);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const query = input;
    setInput('');
    await sendMessage(query);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col border-[rgba(255,255,255,0.08)] bg-[#0d0d18]/90 backdrop-blur-xl shadow-glow-primary overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)] bg-black/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse-slow" />
              <div className="flex flex-col text-left">
                <h4 className="font-bold text-white text-sm">Contract Q&A Chat</h4>
                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">Ask questions about terms</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-secondary)] hover:text-white p-1 rounded hover:bg-white/[0.03] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation view */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[var(--text-secondary)] gap-3 mt-12">
                <div className="w-10 h-10 rounded-full bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1 max-w-[250px]">
                  <p className="text-xs font-bold text-slate-200">Ask Anything!</p>
                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                    "Is there a grace period for rent?"<br />
                    "Does this contract assign IP rights?"<br />
                    "What are the termination conditions?"
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))
            )}

            {isLoading && (
              <div className="flex gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-white/[0.01] items-center text-xs text-[var(--text-muted)]">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span>LexAI is analyzing the contract...</span>
              </div>
            )}

            {error && (
              <div className="p-3 text-xs border border-red-500/10 bg-red-950/10 text-red-400 rounded-lg">
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-[rgba(255,255,255,0.06)] bg-black/30 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question about this contract..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-black/40 border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-glow-primary transition-all duration-200 disabled:opacity-30 disabled:hover:bg-indigo-600 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </Card>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-glow-primary transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-red-600 shadow-red-500/20' : 'bg-indigo-600 bg-gradient-to-tr from-indigo-600 to-indigo-500'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
