'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, Copy, Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
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
    <div className="flex flex-col gap-5 py-4 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
          <span>Missing Clauses Analysis</span>
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
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
                    className="p-5 border-[rgba(255,255,255,0.06)] bg-white/[0.01] hover:bg-white/[0.02] border-l-4 border-l-orange-500 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h4 className="font-bold text-white text-sm">{clause.name}</h4>
                          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                            MISSING CLAUSE
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleExpand(clause.id)}
                        className="text-[var(--text-secondary)] hover:text-white p-1 rounded hover:bg-white/[0.04]"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="text-xs text-[var(--text-secondary)] leading-relaxed bg-black/25 p-3 rounded-lg border border-[rgba(255,255,255,0.02)]">
                      <strong>Why it matters:</strong> {clause.whyMatters}
                    </div>

                    {isExpanded && clause.templateClause && (
                      <div className="flex flex-col gap-2 border-t border-[rgba(255,255,255,0.05)] pt-3 animate-fadeIn">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                            <Info className="w-3 h-3" /> Recommended Addition
                          </span>
                          <button
                            onClick={() => handleCopy(clause.id, clause.templateClause)}
                            className="text-[10px] font-bold text-[var(--text-secondary)] hover:text-white flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-[rgba(255,255,255,0.05)] transition-colors"
                          >
                            {copiedId === clause.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy boilerplate
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-mono leading-relaxed text-[var(--text-secondary)] bg-indigo-950/10 p-3 rounded-lg border border-indigo-500/10 select-all">
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
          <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="font-bold text-white text-base">Perfect Safeguards!</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              All standard legal protections were successfully identified in this contract. No major missing clauses found.
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
