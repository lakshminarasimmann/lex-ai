'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileUp, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';
import { useUpload } from '@/hooks/useUpload';
import FadeIn from '@/components/animations/FadeIn';

export default function Hero() {
  const router = useRouter();
  const { upload, isUploading, progress, error, result } = useUpload();

  const handleUpload = async (file: File) => {
    try {
      const data = await upload(file);
      if (data && data.document && data.document.id) {
        router.push(`/analyze/${data.document.id}`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  useEffect(() => {
    if (result && result.document && result.document.id) {
      router.push(`/analyze/${result.document.id}`);
    }
  }, [result, router]);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
      {/* Dynamic Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none animate-float-delayed" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

      {/* Floating Decorative Elements */}
      <div className="hidden lg:block absolute top-1/4 left-10 p-4 glass-card border border-[rgba(255,255,255,0.06)] animate-bounce-subtle text-indigo-400">
        <Scale className="w-8 h-8" />
      </div>
      <div className="hidden lg:block absolute bottom-1/4 right-12 p-4 glass-card border border-[rgba(255,255,255,0.06)] animate-float text-cyan-400">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <div className="hidden lg:block absolute top-1/3 right-16 p-4 glass-card border border-[rgba(255,255,255,0.06)] animate-float-delayed text-violet-400">
        <Sparkles className="w-6 h-6" />
      </div>

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 relative z-10">
        <FadeIn direction="down" duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-xs font-semibold text-indigo-300 tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Next-Gen legal intelligence is here</span>
          </div>
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.1}>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Understand What You Are{' '}
            <span className="gradient-text animate-pulse-slow">Signing.</span>
          </h1>
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.2}>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Upload any contract or agreement PDF. Get an instant plain-English analysis with risk flags, missing clauses, and a structured negotiation guide.
          </p>
        </FadeIn>

        <FadeIn direction="up" duration={0.6} delay={0.3} className="w-full max-w-lg mt-4">
          <div className="w-full glass-card p-6 border-[rgba(255,255,255,0.08)] bg-[#111122]/30 shadow-glow-primary">
            <FileUpload 
              onUpload={handleUpload} 
              isLoading={isUploading} 
              progress={progress} 
            />
            {error && (
              <div className="mt-4 p-3 rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 text-sm font-medium text-left">
                {error}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Hero metrics */}
        <FadeIn direction="up" duration={0.6} delay={0.4} className="w-full">
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-12 border-t border-[rgba(255,255,255,0.06)] pt-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white tracking-tight">100%</span>
              <span className="text-xs text-[var(--text-muted)] mt-1 uppercase font-semibold">Private & Secure</span>
            </div>
            <div className="flex flex-col items-center border-x border-[rgba(255,255,255,0.06)] px-4">
              <span className="text-2xl font-bold text-white tracking-tight">98%</span>
              <span className="text-xs text-[var(--text-muted)] mt-1 uppercase font-semibold">AI Accuracy</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white tracking-tight">&lt; 30s</span>
              <span className="text-xs text-[var(--text-muted)] mt-1 uppercase font-semibold">Avg. Analysis</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
