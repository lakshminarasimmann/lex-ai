'use client';

import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, XCircle, Table, Brain } from 'lucide-react';
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
      a.download = `LexAI_Negotiation_Strategy_${document.id}.pdf`;
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
      <div className="py-12 text-center text-sm text-[#667085]">
        No negotiation playbook could be synthesized for this contract type.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-3 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
      {/* Executive CTA - PDF Download */}
      <FadeIn direction="up">
        <Card 
          className="p-5 border-l-4 border-l-[#D4AF37] bg-[#11151C] flex flex-col sm:flex-row items-center justify-between gap-4"
          padding="none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[#D4AF37]">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1.5 text-left">
              <h4 className="font-bold text-[#F8FAFC] text-sm leading-none">Download Strategy Brief</h4>
              <p className="text-xs text-[#A8B3C7]">
                Get a fully structured, printable PDF guide for offline review.
              </p>
            </div>
          </div>

          <Button
            onClick={handleDownloadPDF}
            isLoading={isDownloading}
            variant="gold"
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </Card>
      </FadeIn>

      {/* Push-Back Clauses */}
      {guide.pushBackClauses && guide.pushBackClauses.length > 0 && (
        <FadeIn direction="up" delay={0.1}>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[#F8FAFC] text-sm tracking-wide">
              Top Push-Back Opportunities
            </h3>
            
            <div className="flex flex-col gap-3">
              {guide.pushBackClauses.map((item, idx) => (
                <Card 
                  key={idx} 
                  className="p-5 border-[rgba(255,255,255,0.06)] bg-[#11151C]"
                  padding="none"
                >
                  <div className="flex flex-col gap-3.5 text-left">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.15em] font-label">
                      Opportunity {idx + 1}
                    </span>
                    <h4 className="font-bold text-[#F8FAFC] text-[15px] leading-snug">
                      {item.clauseSummary}
                    </h4>
                    <div className="p-3.5 bg-[rgba(16,185,129,0.03)] rounded-lg border border-[rgba(16,185,129,0.1)] font-mono text-[13px] text-[#A8B3C7] leading-relaxed border-l-2 border-l-[#10B981]/40">
                      <strong className="text-[#10B981] font-sans">Suggested counter-wording:</strong><br />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dos */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#10B981] shrink-0" />
              <span>Negotiation Do's</span>
            </h4>
            <div className="flex flex-col gap-2">
              {guide.dos.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3.5 bg-[rgba(16,185,129,0.04)] border border-[rgba(16,185,129,0.1)] rounded-xl text-sm leading-relaxed text-[#A8B3C7]">
                  <span className="text-[#10B981] font-bold shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Don'ts */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
              <XCircle className="w-4.5 h-4.5 text-[#EF4444] shrink-0" />
              <span>Negotiation Don'ts</span>
            </h4>
            <div className="flex flex-col gap-2">
              {guide.donts.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3.5 bg-[rgba(239,68,68,0.04)] border border-[rgba(239,68,68,0.1)] rounded-xl text-sm leading-relaxed text-[#A8B3C7]">
                  <span className="text-[#EF4444] font-bold shrink-0 mt-0.5">•</span>
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
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
              <Table className="w-4.5 h-4.5 text-[#3B82F6]" />
              <span>Standard Market Terms</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#11151C]">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1A202B] border-b border-[rgba(255,255,255,0.08)] font-bold text-[#F8FAFC]">
                    <th className="p-3.5 pl-5">Clause Metric</th>
                    <th className="p-3.5 pr-5">Standard Market Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#A8B3C7]">
                  {guide.marketTerms.map((term, idx) => (
                    <tr key={idx} className="hover:bg-[#1A202B] transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-[#F8FAFC] align-top">{term.metric}</td>
                      <td className="p-3.5 pr-5 leading-relaxed">{term.standard}</td>
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
