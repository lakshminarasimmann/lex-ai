'use client';

import React from 'react';
import { File, AlertTriangle, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';
import GaugeChart from '@/components/ui/GaugeChart';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { AnalysisResults } from '@/lib/types';
import { getDocTypeLabel } from '@/lib/utils';
import FadeIn from '@/components/animations/FadeIn';

interface SummaryTabProps {
  results: AnalysisResults;
}

export default function SummaryTab({ results }: SummaryTabProps) {
  const { document, clauses, analysis } = results;

  // Calculate risk counts
  const riskCounts = {
    critical: clauses.filter((c) => c.riskLevel === 'critical').length,
    high: clauses.filter((c) => c.riskLevel === 'high').length,
    medium: clauses.filter((c) => c.riskLevel === 'medium').length,
    low: clauses.filter((c) => c.riskLevel === 'low').length,
  };

  const getRiskStatusVariant = (score: number) => {
    if (score <= 25) return 'success';
    if (score <= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="flex flex-col gap-6 py-4 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
      {/* Gauge and Overall Assessment */}
      <FadeIn direction="up">
        <Card className="p-6 border-[rgba(255,255,255,0.06)] bg-white/[0.01] flex flex-col items-center">
          <div className="flex justify-between items-center w-full border-b border-[rgba(255,255,255,0.06)] pb-4 mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Analysis Overview</span>
            <Badge variant={getRiskStatusVariant(analysis.overallScore || 0)}>
              {getDocTypeLabel(document.docType)}
            </Badge>
          </div>
          
          <GaugeChart score={analysis.overallScore || 0} />
          
          <div className="grid grid-cols-3 gap-2 w-full mt-6 text-center border-t border-[rgba(255,255,255,0.06)] pt-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-[var(--text-muted)] font-medium uppercase">Pages</span>
              <span className="text-lg font-bold text-white flex items-center gap-1.5">
                <File className="w-4 h-4 text-indigo-400" />
                {document.pageCount}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-[rgba(255,255,255,0.06)]">
              <span className="text-xs text-[var(--text-muted)] font-medium uppercase">Clauses</span>
              <span className="text-lg font-bold text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                {document.clauseCount}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-[var(--text-muted)] font-medium uppercase">Risks Found</span>
              <span className="text-lg font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                {riskCounts.high + riskCounts.critical}
              </span>
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Executive Summary */}
      <FadeIn direction="up" delay={0.1}>
        <Card className="p-6 border-[rgba(255,255,255,0.06)] bg-white/[0.01] flex flex-col gap-3">
          <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
            <span>Executive Summary</span>
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {analysis.summary || 'A legal summary of this agreement could not be generated. Please review individual risk flags.'}
          </p>
        </Card>
      </FadeIn>

      {/* Top 3 Things to Know */}
      {analysis.topThingsToKnow && analysis.topThingsToKnow.length > 0 && (
        <FadeIn direction="up" delay={0.2}>
          <Card className="p-6 border-[rgba(255,255,255,0.06)] bg-white/[0.01] flex flex-col gap-4">
            <h3 className="font-bold text-white text-base tracking-wide">
              Top 3 Things to Know Before Signing
            </h3>
            
            <div className="flex flex-col gap-4">
              {analysis.topThingsToKnow.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start border-b border-[rgba(255,255,255,0.04)] pb-3 last:border-0 last:pb-0">
                  <div className="w-6 h-6 rounded-full bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center text-xs font-black text-indigo-400 mt-0.5 shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      )}

      {/* Risk Distribution Breakdown */}
      <FadeIn direction="up" delay={0.3}>
        <Card className="p-6 border-[rgba(255,255,255,0.06)] bg-white/[0.01] flex flex-col gap-4">
          <h3 className="font-bold text-white text-base tracking-wide">
            Risk Profile Distribution
          </h3>
          
          <div className="flex flex-col gap-3">
            {/* Critical */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" /> Critical Risks
                </span>
                <span>{riskCounts.critical} clauses</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-500" 
                  style={{ width: `${clauses.length ? (riskCounts.critical / clauses.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* High */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 text-orange-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Risks
                </span>
                <span>{riskCounts.high} clauses</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-500" 
                  style={{ width: `${clauses.length ? (riskCounts.high / clauses.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> Medium Risks
                </span>
                <span>{riskCounts.medium} clauses</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
                  style={{ width: `${clauses.length ? (riskCounts.medium / clauses.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Low */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Low Risks
                </span>
                <span>{riskCounts.low} clauses</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${clauses.length ? (riskCounts.low / clauses.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
