'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, Scale, Lock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AnalysisPanel from '@/components/analysis/AnalysisPanel';
import { AnalysisResults } from '@/lib/types';
import FadeIn from '@/components/animations/FadeIn';

interface SharePageProps {
  params: {
    shareId: string;
  };
}

// ---------------------------------------------------------------------------
// Browser-native state decompression (Zero Database)
// ---------------------------------------------------------------------------
async function decodeShareLink(base64: string): Promise<AnalysisResults> {
  const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const stream = new Blob([bytes]).stream();
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
  
  const response = new Response(decompressedStream);
  const text = await response.text();
  return JSON.parse(text);
}

export default function SharePage({ params }: SharePageProps) {
  const router = useRouter();
  const { shareId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decode = async () => {
      try {
        const data = await decodeShareLink(shareId);
        setResults(data);
      } catch (err) {
        console.error('Failed to decode share link', err);
        setError('This shared analysis link is invalid or corrupted.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (shareId) decode();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090B0F] flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-[rgba(212,175,55,0.1)] animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-[#F8FAFC]">Decrypting Report...</h2>
          <p className="text-xs text-[#A8B3C7]">Rebuilding analysis from stateless URL payload.</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-[#090B0F] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="p-4 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2 max-w-sm">
          <h2 className="font-black text-[#F8FAFC] text-xl">Report Unavailable</h2>
          <p className="text-sm text-[#A8B3C7] leading-relaxed">
            {error}
          </p>
        </div>
        <Button onClick={() => router.push('/')} variant="gold" className="mt-2">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B0F] text-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-[rgba(255,255,255,0.06)] bg-[#090B0F]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Scale className="w-4 h-4 text-[#090B0F]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#F8FAFC] tracking-wide text-sm font-display">LexAI Shared Report</span>
              <span className="text-[10px] text-[#A8B3C7] truncate max-w-[200px] sm:max-w-[400px]">
                {results.document.fileName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] rounded-full text-[9px] font-bold text-[#10B981] uppercase tracking-wider font-label">
              <Shield className="w-3 h-3" /> Read Only
            </div>
            <Button size="sm" variant="outline" onClick={() => router.push('/')} className="text-xs font-semibold">
              Scan Your Own Contract
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-8">
        <FadeIn direction="up">
          <div className="flex flex-col gap-6">
            <Card className="p-5 border-l-4 border-l-[#3B82F6] bg-[#11151C] flex flex-col sm:flex-row items-center justify-between gap-4" padding="none">
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-lg bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center text-[#3B82F6] shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-[#F8FAFC] text-sm">Security Notice: Stateless Presentation Mode</h4>
                  <p className="text-xs text-[#A8B3C7] leading-relaxed">
                    You are viewing a shared intelligence report. The original document was processed in the sender's browser and <strong>never stored on any server</strong>. This analysis data is entirely contained within the URL you just clicked.
                  </p>
                </div>
              </div>
            </Card>

            <div className="h-[700px] max-h-[80vh]">
              <AnalysisPanel results={results} />
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
