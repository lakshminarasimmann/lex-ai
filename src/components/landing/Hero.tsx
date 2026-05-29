'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Scale, Lock, Brain } from 'lucide-react';
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
    <section className="relative min-h-[92vh] flex items-center py-20 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(212,175,55,0.03)] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[rgba(59,130,246,0.02)] blur-[120px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="hidden lg:flex absolute top-1/4 left-12 p-3 bg-[#1A202B] border border-[rgba(255,255,255,0.06)] rounded-xl animate-bounce-subtle text-[#D4AF37]">
        <Scale className="w-6 h-6" />
      </div>
      <div className="hidden lg:flex absolute bottom-1/3 right-14 p-3 bg-[#1A202B] border border-[rgba(255,255,255,0.06)] rounded-xl animate-float text-[#10B981]">
        <Shield className="w-6 h-6" />
      </div>
      <div className="hidden lg:flex absolute top-1/3 right-20 p-3 bg-[#1A202B] border border-[rgba(255,255,255,0.06)] rounded-xl animate-float-delayed text-[#3B82F6]">
        <Brain className="w-5 h-5" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Column — Text + Upload */}
        <div className="flex flex-col gap-8">
          <FadeIn direction="down" duration={0.5}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)] text-[11px] font-bold text-[#D4AF37] tracking-wider uppercase w-fit">
              <Brain className="w-3.5 h-3.5" />
              <span>AI-Powered Legal Intelligence</span>
            </div>
          </FadeIn>

          <FadeIn direction="up" duration={0.5} delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.08] text-[#F8FAFC]">
              Contract Intelligence{' '}
              <span className="gradient-text">in Seconds.</span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" duration={0.5} delay={0.15}>
            <p className="text-lg text-[#A8B3C7] max-w-lg leading-relaxed">
              Analyze contracts. Detect hidden risks. Generate negotiation strategies.{' '}
              <span className="text-[#F8FAFC] font-medium">Without storing a single document.</span>
            </p>
          </FadeIn>

          <FadeIn direction="up" duration={0.5} delay={0.2} className="max-w-lg">
            <div className="bg-[#11151C] border border-[rgba(255,255,255,0.06)] rounded-xl p-5">
              <FileUpload 
                onUpload={handleUpload} 
                isLoading={isUploading} 
                progress={progress} 
              />
              {error && (
                <div className="mt-4 p-3 rounded-lg border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.06)] text-[#EF4444] text-sm font-medium text-left">
                  {error}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Security indicators */}
          <FadeIn direction="up" duration={0.5} delay={0.25}>
            <div className="flex flex-wrap items-center gap-4">
              {[
                { icon: Shield, label: 'Zero Data Retention' },
                { icon: Lock, label: 'Browser-Owned Reports' },
                { icon: Scale, label: 'Stateless Processing' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#667085] uppercase tracking-wider">
                  <item.icon className="w-3 h-3 text-[#10B981]" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Right Column — Dashboard Preview */}
        <FadeIn direction="right" duration={0.6} delay={0.3}>
          <div className="hidden lg:block relative">
            {/* Floating dashboard preview card */}
            <div className="relative bg-[#11151C] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)] animate-float">
              {/* Mini dashboard header */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                </div>
                <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-label">Legal Command Center</span>
              </div>

              {/* Mock KPI row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Risk Score', value: '72', color: '#F59E0B' },
                  { label: 'Clauses', value: '14', color: '#3B82F6' },
                  { label: 'Issues', value: '3', color: '#EF4444' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-[#1A202B] border border-[rgba(255,255,255,0.06)] rounded-lg p-3 text-center">
                    <div className="text-xl font-black font-display" style={{ color: kpi.color }}>{kpi.value}</div>
                    <div className="text-[9px] text-[#667085] font-semibold uppercase tracking-wider mt-1">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Mock clause cards */}
              <div className="flex flex-col gap-2">
                {[
                  { risk: 'Critical', color: '#EF4444', w: '85%' },
                  { risk: 'High', color: '#f97316', w: '70%' },
                  { risk: 'Medium', color: '#F59E0B', w: '55%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#1A202B] border border-[rgba(255,255,255,0.04)] rounded-lg p-3">
                    <div className="w-1.5 h-8 rounded-full" style={{ background: item.color }} />
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-[rgba(255,255,255,0.06)]" style={{ width: item.w }} />
                      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.03)] mt-2 w-[40%]" />
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: item.color }}>{item.risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-4 -left-4 bg-[#1A202B] border border-[rgba(212,175,55,0.15)] rounded-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-float-delayed">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[rgba(212,175,55,0.1)] flex items-center justify-center">
                  <Scale className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F8FAFC]">AI Analysis</div>
                  <div className="text-[9px] text-[#10B981] font-semibold">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Bottom metrics */}
      <div className="absolute bottom-0 left-0 w-full border-t border-[rgba(255,255,255,0.04)]">
        <FadeIn direction="up" duration={0.5} delay={0.4}>
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
            {[
              { value: '100%', label: 'Private & Secure' },
              { value: '98%', label: 'AI Accuracy' },
              { value: '< 30s', label: 'Avg. Analysis' },
            ].map((metric, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xl font-black text-[#F8FAFC] tracking-tight font-display">{metric.value}</span>
                <span className="text-[10px] text-[#667085] mt-1 uppercase font-semibold tracking-wider">{metric.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
