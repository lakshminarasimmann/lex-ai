'use client';

import { useState } from 'react';
import { sendChatMessage } from '@/lib/api';
import { ChatMessage } from '@/lib/types';

export function useChat(docId: string, clauses: any[], docType = 'agreement') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage(docId, content, messages, clauses, docType);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply, // Matches backend 'reply' parameter
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err?.message || 'Failed to get answer from AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
