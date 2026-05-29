'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, Copy, Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import { MissingClause } from '@/lib/types';
import StaggerChildren from '@/components/animations/StaggerChildren';
import FadeIn from '@/components/animations/FadeIn';

interface MissingClausesTabProps {
  missing: MissingClause[] | null;
}

export default function MissingClausesTab({ missing }: MissingClausesTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5 py-3 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="font-bold text-[#F8FAFC] text-sm tracking-wide">
          Missing Clauses Analysis
        </h3>
        <p className="text-sm text-[#A8B3C7] leading-relaxed">
          The following standard protections are absent from this contract. We recommend inserting these template clauses during negotiations.
        </p>
      </div>

      {missing && missing.length > 0 ? (
        <StaggerChildren>
          <div className="flex flex-col gap-4">
            {missing.map((clause, idx) => {
              const isExpanded = expandedId === clause.id;
              return (
                <FadeIn key={clause.id} direction="up" delay={idx * 0.05}>
                  <Card 
                    className="p-5 border-[rgba(255,255,255,0.06)] bg-[#11151C] hover:bg-[#1A202B] border-l-[3px] border-l-[#F59E0B] flex flex-col gap-3.5 transition-colors"
                    padding="none"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center text-[#F59E0B] shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <h4 className="font-bold text-[#F8FAFC] text-sm">{clause.name}</h4>
                          <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-[0.15em] font-label">
                            MISSING CLAUSE
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleExpand(clause.id)}
                        className="text-[#667085] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors border border-transparent hover:border-[rgba(255,255,255,0.08)]"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-sm text-[#A8B3C7] leading-relaxed bg-[#090B0F] p-3.5 rounded-lg border border-[rgba(255,255,255,0.04)] flex gap-2.5 items-start">
                      <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#F8FAFC]">Why it matters:</strong> {clause.whyMatters}
                      </div>
                    </div>

                    {isExpanded && clause.templateClause && (
                      <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.06)] pt-4 mt-1 animate-slide-up">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.15em] font-label">
                            Recommended Addition
                          </span>
                          <button
                            onClick={() => handleCopy(clause.id, clause.templateClause)}
                            className="text-[10px] font-bold text-[#667085] hover:text-[#F8FAFC] flex items-center gap-1.5 bg-[#090B0F] px-2.5 py-1.5 rounded-md border border-[rgba(255,255,255,0.08)] transition-colors uppercase tracking-wider"
                          >
                            {copiedId === clause.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#10B981]" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Template
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[13px] font-mono leading-relaxed text-[#A8B3C7] bg-[rgba(212,175,55,0.03)] p-4 rounded-xl border border-[rgba(212,175,55,0.1)] select-all border-l-2 border-l-[#D4AF37]/40">
                          "{clause.templateClause}"
                        </p>
                      </div>
                    )}
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </StaggerChildren>
      ) : (
        <FadeIn direction="none" className="py-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-[#10B981]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="font-bold text-[#F8FAFC] text-base">Perfect Safeguards!</h3>
            <p className="text-sm text-[#A8B3C7] leading-relaxed">
              All standard legal protections were successfully identified in this contract. No major missing clauses found.
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
