'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Shield, Brain, FileText, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { label: 'Reading document structure...', icon: FileText, color: '#A8B3C7' },
  { label: 'Identifying contract type...', icon: Brain, color: '#3B82F6' },
  { label: 'Extracting legal clauses via PyMuPDF...', icon: Scale, color: '#D4AF37' },
  { label: 'Evaluating risk levels (BART-MNLI)...', icon: AlertTriangle, color: '#F59E0B' },
  { label: 'Scoring risk matrices & rule engines...', icon: Shield, color: '#f97316' },
  { label: 'Building negotiation strategy (Gemini)...', icon: Zap, color: '#7C3AED' },
  { label: 'Compiling intelligence report...', icon: CheckCircle2, color: '#10B981' },
];

export default function Loading() {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIdx((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const progress = ((stageIdx + 1) / STAGES.length) * 100;

  return (
    <div className="min-h-screen bg-[#090B0F] text-[#F8FAFC] flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        {/* Animated scale icon */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-[rgba(212,175,55,0.06)] animate-pulse-slow" />
          <div className="absolute inset-2 rounded-full bg-[rgba(212,175,55,0.08)] animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Scale className="w-9 h-9 text-[#D4AF37] animate-spin-slow" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-wide text-[#F8FAFC]">
            AI Legal Investigation
          </h2>
          <p className="text-xs text-[#667085] font-semibold uppercase tracking-wider font-label">
            Analyzing contract document
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-[#667085] font-semibold uppercase tracking-wider">Progress</span>
            <span className="text-[10px] text-[#D4AF37] font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#11151C] rounded-full overflow-hidden border border-[rgba(255,255,255,0.04)]">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stage timeline */}
        <div className="w-full flex flex-col gap-0">
          {STAGES.map((stage, idx) => {
            const StageIcon = stage.icon;
            const status = idx < stageIdx ? 'complete' : idx === stageIdx ? 'active' : 'pending';

            return (
              <div key={idx} className="flex items-center gap-3 py-2.5 relative">
                {/* Vertical connector */}
                {idx < STAGES.length - 1 && (
                  <div className={`absolute left-[15px] top-10 w-[1px] h-full ${
                    status === 'complete' ? 'bg-[#10B981]' : 'bg-[rgba(255,255,255,0.06)]'
                  }`} />
                )}

                {/* Status icon */}
                <div className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                  status === 'complete'
                    ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]'
                    : status === 'active'
                    ? 'bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                    : 'bg-[#11151C] border border-[rgba(255,255,255,0.06)]'
                }`}>
                  {status === 'complete' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  ) : (
                    <StageIcon className={`w-3.5 h-3.5 ${
                      status === 'active' ? 'text-[#D4AF37] animate-pulse' : 'text-[#667085]'
                    }`} />
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm transition-colors duration-300 ${
                  status === 'complete'
                    ? 'text-[#10B981] font-medium'
                    : status === 'active'
                    ? 'text-[#F8FAFC] font-semibold'
                    : 'text-[#667085]'
                }`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Security indicator */}
        <div className="flex items-center gap-2 text-[10px] text-[#667085]">
          <Shield className="w-3 h-3 text-[#10B981]" />
          <span>Zero data retention · Secure processing</span>
        </div>
      </div>
    </div>
  );
}
