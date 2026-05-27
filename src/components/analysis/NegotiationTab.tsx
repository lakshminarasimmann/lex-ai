'use client';

import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, XCircle, Table } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AnalysisResults } from '@/lib/types';
import FadeIn from '@/components/animations/FadeIn';

interface NegotiationTabProps {
  results: AnalysisResults;
}

export default function NegotiationTab({ results }: NegotiationTabProps) {
  const { document, analysis, clauses } = results;
  const guide = analysis.negotiationGuide;

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/negotiation-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `LexAI_Negotiation_Playbook_${document.id}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!guide) {
    return (
      <div className="py-12 text-center text-xs text-[var(--text-muted)]">
        No negotiation playbook could be synthesized for this contract type.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
      {/* Executive CTA - PDF Download */}
      <FadeIn direction="up">
        <Card className="p-6 border-indigo-500/20 bg-indigo-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <h4 className="font-bold text-white text-sm">Download Legal Report</h4>
              <p className="text-xs text-[var(--text-muted)]">
                Get a fully structured, printable PDF guide for offline review.
              </p>
            </div>
          </div>

          <Button
            onClick={handleDownloadPDF}
            isLoading={isDownloading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white border-0 py-2.5 px-5 font-bold shadow-glow-primary text-xs tracking-wider"
          >
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </Card>
      </FadeIn>

      {/* Push-Back Clauses */}
      {guide.pushBackClauses && guide.pushBackClauses.length > 0 && (
        <FadeIn direction="up" delay={0.1}>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white text-base tracking-wide">
              Top Push-Back Opportunities
            </h3>
            
            <div className="flex flex-col gap-4">
              {guide.pushBackClauses.map((item, idx) => (
                <Card 
                  key={idx} 
                  className="p-5 border-[rgba(255,255,255,0.06)] bg-white/[0.01] hover:bg-white/[0.02]"
                >
                  <div className="flex flex-col gap-3 text-left">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                      Opportunity {idx + 1}
                    </span>
                    <h4 className="font-bold text-white text-sm leading-snug">
                      {item.clauseSummary}
                    </h4>
                    <div className="p-3 bg-black/40 rounded-lg border border-[rgba(255,255,255,0.04)] font-mono text-xs text-emerald-400 leading-relaxed">
                      <strong>Suggested counter-wording:</strong><br />
                      "{item.suggestedWording}"
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Dos and Don'ts */}
      <FadeIn direction="up" delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dos */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span>Negotiation Do's</span>
            </h4>
            <div className="flex flex-col gap-2.5">
              {guide.dos.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3 bg-emerald-950/5 border border-emerald-500/10 rounded-lg text-xs leading-relaxed text-[var(--text-secondary)]">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Don'ts */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <XCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
              <span>Negotiation Don'ts</span>
            </h4>
            <div className="flex flex-col gap-2.5">
              {guide.donts.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3 bg-red-950/5 border border-red-500/10 rounded-lg text-xs leading-relaxed text-[var(--text-secondary)]">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Market Standards Table */}
      {guide.marketTerms && guide.marketTerms.length > 0 && (
        <FadeIn direction="up" delay={0.3}>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Table className="w-4.5 h-4.5 text-cyan-400" />
              <span>Standard Market Terms</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)] bg-black/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-[rgba(255,255,255,0.06)] font-bold text-slate-300">
                    <th className="p-3">Clause Metric</th>
                    <th className="p-3">Standard Market Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[var(--text-secondary)]">
                  {guide.marketTerms.map((term, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-3 font-semibold text-white">{term.metric}</td>
                      <td className="p-3 leading-relaxed">{term.standard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
