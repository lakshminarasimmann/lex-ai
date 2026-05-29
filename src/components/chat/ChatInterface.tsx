'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatMessage from './ChatMessage';
import { sendChatMessage } from '@/lib/api';
import { Message, Clause } from '@/lib/types';
import { CHAT_SUGGESTIONS } from '@/lib/constants';

interface ChatInterfaceProps {
  docId: string;
  clauses: Clause[];
  docType?: string;
}

export default function ChatInterface({ docId, clauses, docType }: ChatInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'I am your AI Legal Copilot. I can explain complex terms, summarize obligations, or identify hidden risks in this agreement. What would you like to know?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(docId, text, messages, clauses, docType);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError('Copilot failed to generate a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center text-[#090B0F]"
            aria-label="Open Legal Copilot"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] bg-[#090B0F] border border-[rgba(212,175,55,0.2)] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#11151C] border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F8FAFC] text-sm">Legal Copilot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[10px] text-[#A8B3C7] font-semibold uppercase tracking-wider font-label">Active Session</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#667085] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.06)] rounded-lg transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 no-scrollbar bg-[url('/grid.svg')] bg-center">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isLoading && (
                <div className="flex gap-4 w-full">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] flex items-center justify-center shrink-0 mt-1 shadow-[0_0_12px_rgba(212,175,55,0.15)]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-[rgba(212,175,55,0.03)] border border-[rgba(212,175,55,0.15)] rounded-2xl rounded-tl-sm p-4 text-[13px] text-[#A8B3C7] flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                    <span>Analyzing contract context...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl flex items-start gap-2 text-xs text-[#EF4444]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (only if few messages) */}
            {messages.length < 3 && !isLoading && (
              <div className="p-4 flex flex-wrap gap-2 border-t border-[rgba(255,255,255,0.04)] bg-[#11151C]">
                <span className="w-full text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1 font-label">Suggested Queries</span>
                {CHAT_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="text-xs text-[#A8B3C7] bg-[#1A202B] hover:bg-[#242B36] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(212,175,55,0.3)] px-3 py-1.5 rounded-full transition-colors text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-[#11151C] border-t border-[rgba(255,255,255,0.06)]">
              <div className="relative flex items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about this contract..."
                  className="w-full bg-[#1A202B] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 pl-4 pr-12 text-sm text-[#F8FAFC] placeholder:text-[#667085] focus:outline-none focus:border-[rgba(212,175,55,0.4)] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] resize-none min-h-[50px] max-h-[120px]"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-2 bg-[#D4AF37] text-[#090B0F] rounded-lg disabled:opacity-50 disabled:bg-[#1A202B] disabled:text-[#667085] transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 text-center">
                <span className="text-[9px] text-[#667085] uppercase tracking-wider font-semibold">
                  Responses are generated by AI and may not be 100% accurate.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
