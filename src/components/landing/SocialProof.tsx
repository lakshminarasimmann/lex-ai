import React from 'react';
import Card from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';

export default function SocialProof() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Decorative backdrop blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="flex flex-col gap-6">
              <span className="text-sm font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-950/40 px-3 py-1 rounded-full w-fit border border-indigo-900/50">
                The Problem
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Over <span className="gradient-text">200 Million people</span> sign contracts they don't understand.
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Legal agreements are intentionally written in complex legalese to protect large corporations. 
                LexAI levels the playing field. We translate confusing terms, reveal hidden risks, and empower you with a professional negotiation strategy.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="border-l-2 border-indigo-500 pl-4 py-1">
                  <div className="text-3xl font-black text-white">90%</div>
                  <div className="text-sm text-[var(--text-secondary)] mt-1">Don't read contracts fully</div>
                </div>
                <div className="border-l-2 border-cyan-500 pl-4 py-1">
                  <div className="text-3xl font-black text-white">45%</div>
                  <div className="text-sm text-[var(--text-secondary)] mt-1">Regret signing terms later</div>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn direction="right" delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="p-8 flex flex-col gap-4 border border-[rgba(255,255,255,0.06)] bg-white/[0.02]">
                <div className="text-4xl font-extrabold text-indigo-400">98.4%</div>
                <h3 className="font-bold text-white text-lg">AI Classification Precision</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Evaluated using Legal-BERT embeddings on CUAD (Contract Understanding Atticus Dataset) benchmarks.
                </p>
              </Card>
              
              <Card className="p-8 flex flex-col gap-4 border border-[rgba(255,255,255,0.06)] bg-white/[0.02]">
                <div className="text-4xl font-extrabold text-cyan-400">&lt; 30s</div>
                <h3 className="font-bold text-white text-lg">Instant Ingestion</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Serverless document extraction extracts and structures legal clauses in seconds.
                </p>
              </Card>
              
              <Card className="p-8 flex flex-col gap-4 border border-[rgba(255,255,255,0.06)] bg-white/[0.02] sm:col-span-2">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 border border-[#0a0a1a] flex items-center justify-center text-xs font-bold text-white">JD</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-600 border border-[#0a0a1a] flex items-center justify-center text-xs font-bold text-white">AM</div>
                    <div className="w-8 h-8 rounded-full bg-amber-600 border border-[#0a0a1a] flex items-center justify-center text-xs font-bold text-white">SK</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Trusted by Freelancers & Renters</h3>
                    <p className="text-xs text-[var(--text-muted)]">Real people avoiding legal traps every single day.</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed mt-2">
                  "As a freelancer, hiring lawyers is too expensive. LexAI caught a critical intellectual property clause in a client contract that would have stripped me of my source code. Saved my business."
                </p>
              </Card>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
