'use client';

import React from 'react';
import { MessageSquare, User, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Basic HTML formatter for simple paragraph styling in AI responses
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      // Bold text mapping **bold**
      let formatted = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      formatted = formatted.replace(boldRegex, '<strong class="font-extrabold text-white">$1</strong>');
      
      // Bullets
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletContent = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-[var(--text-secondary)] leading-relaxed mb-1.5" dangerouslySetInnerHTML={{ __html: bulletContent }} />
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 ${
      isUser 
        ? 'bg-indigo-950/20 border-indigo-500/10 text-right flex-row-reverse' 
        : 'bg-white/[0.01] border-[rgba(255,255,255,0.04)] text-left'
    }`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isUser 
          ? 'bg-indigo-600 text-white shadow-glow-primary' 
          : 'bg-cyan-600 text-white shadow-glow-accent'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Message Body */}
      <div className="flex flex-col gap-1.5 flex-1 max-w-[85%]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          {isUser ? 'You' : 'LexAI Assistant'}
        </span>
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {isUser ? (
            <p className="text-slate-200">{message.content}</p>
          ) : (
            <div className="flex flex-col">{renderFormattedContent(message.content)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
