'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';

const STAGES = [
  'Reading contract file...',
  'Extracting structural clauses via PyMuPDF...',
  'Running zero-shot legal classification (BART-Large-MNLI)...',
  'Executing CUAD category extraction filters...',
  'Scoring contract risk matrices and rule engines...',
  'Compiling executive summary and pushback playbook via Claude API...',
  'Finalizing legal document intelligence report...'
];

export default function Loading() {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#06060c] text-white flex flex-col pt-16">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-[rgba(255,255,255,0.04)] bg-[#06060c]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center">
              <span className="font-bold text-white text-base">L</span>
            </div>
            <span className="font-bold text-white tracking-wider text-lg">LexAI</span>
          </div>
          <Skeleton className="w-24 h-8 rounded-lg" />
        </div>
      </header>

      {/* Centered Stage Loading Progress Widget */}
      <div className="max-w-xl mx-auto w-full px-6 py-8 mt-4 flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <div className="flex flex-col gap-1.5">
          <h2 className="font-extrabold text-white text-lg tracking-wide animate-pulse">
            Analyzing Contract Document
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed max-w-sm">
            {STAGES[stageIdx]}
          </p>
        </div>
        <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500 rounded-full"
            style={{ width: `${((stageIdx + 1) / STAGES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Split Shimmer Viewport */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full px-6 pb-12 mt-4">
        {/* Left Side: Mock Document */}
        <div className="flex flex-col gap-4 h-full min-h-[500px]">
          <Card className="flex-1 p-6 border-[rgba(255,255,255,0.06)] bg-white/[0.01] flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.04)] pb-4">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-20 h-6" />
            </div>
            <div className="flex-1 flex flex-col gap-3 justify-center items-center">
              <Skeleton className="w-[85%] h-4" />
              <Skeleton className="w-[90%] h-4" />
              <Skeleton className="w-[75%] h-4" />
              <Skeleton className="w-[80%] h-4" />
              <Skeleton className="w-[60%] h-4" />
            </div>
          </Card>
        </div>

        {/* Right Side: Mock Report */}
        <div className="flex flex-col gap-4 h-full min-h-[500px]">
          <Card className="flex-1 p-6 border-[rgba(255,255,255,0.06)] bg-white/[0.01] flex flex-col gap-6">
            <div className="flex gap-4 border-b border-[rgba(255,255,255,0.04)] pb-4">
              <Skeleton className="w-16 h-8" />
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-16 h-8" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="w-full h-24 rounded-xl" />
              <Skeleton className="w-[90%] h-16 rounded-xl" />
              <Skeleton className="w-full h-32 rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
