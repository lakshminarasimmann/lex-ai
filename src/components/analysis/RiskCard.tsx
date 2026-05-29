'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Languages, Brain, GitPullRequest } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Clause } from '@/lib/types';
import { translateText } from '@/lib/api';

interface RiskCardProps {
  clause: Clause;
  onSelect?: (pageNumber: number) => void;
}

export default function RiskCard({ clause, onSelect }: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedText, setCopiedText] = useState<'counter' | 'original' | null>(null);
  
  // Translation state
  const [lang, setLang] = useState<'en' | 'hi' | 'ta' | 'te'>('en');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const getRiskColorClass = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-[#EF4444] border-[#EF4444]/20 bg-[#EF4444]/10';
      case 'high': return 'text-[#f97316] border-[#f97316]/20 bg-[#f97316]/10';
      case 'medium': return 'text-[#F59E0B] border-[#F59E0B]/20 bg-[#F59E0B]/10';
      default: return 'text-[#10B981] border-[#10B981]/20 bg-[#10B981]/10';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'danger';
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'success';
    }
  };

  const handleCopy = (text: string, type: 'counter' | 'original') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleTranslate = async (targetLang: 'hi' | 'ta' | 'te' | 'en') => {
    setLang(targetLang);
    if (targetLang === 'en') {
      setTranslatedText(null);
      return;
    }
    
    setIsTranslating(true);
    try {
      const explanation = clause.explanation || '';
      const response = await translateText(explanation, targetLang);
      setTranslatedText(response.translatedText);
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card 
      className={`p-5 flex flex-col gap-4 border-[rgba(255,255,255,0.06)] bg-[#11151C] hover:bg-[#1A202B] transition-colors duration-200 border-l-[3px] ${
        clause.riskLevel === 'critical' ? 'border-l-[#EF4444]' :
        clause.riskLevel === 'high' ? 'border-l-[#f97316]' :
        clause.riskLevel === 'medium' ? 'border-l-[#F59E0B]' : 'border-l-[#10B981]'
      }`}
      padding="none"
    >
      {/* Risk Card Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085] font-label">
            Clause {clause.index} &bull; {clause.category || 'General Terms'}
          </span>
          <Badge variant={getRiskBadgeVariant(clause.riskLevel || 'low')} className="w-fit" glow>
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
              clause.riskLevel === 'critical' ? 'bg-[#EF4444] animate-pulse' :
              clause.riskLevel === 'high' ? 'bg-[#f97316]' :
              clause.riskLevel === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
            }`} />
            {clause.riskLevel?.toUpperCase()} RISK
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Page Jumper */}
          {clause.pageNumber && (
            <button
              onClick={() => onSelect && onSelect(clause.pageNumber!)}
              className="text-[10px] font-bold text-[#D4AF37] bg-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.2)] px-2.5 py-1 rounded-md transition-colors font-label uppercase tracking-wider"
            >
              Page {clause.pageNumber}
            </button>
          )}

          {/* Collapsible toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#667085] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors border border-transparent hover:border-[rgba(255,255,255,0.08)]"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Snippet display */}
      <div className="flex flex-col gap-2">
        <div className="p-3.5 bg-[#090B0F] rounded-lg text-xs leading-relaxed text-[#A8B3C7] border border-[rgba(255,255,255,0.04)] font-mono max-h-24 overflow-y-auto">
          "{clause.text}"
        </div>
      </div>

      {/* Explanations (collapsible) */}
      {isExpanded && (
        <div className="flex flex-col gap-5 border-t border-[rgba(255,255,255,0.06)] pt-5 animate-slide-up">
          {/* Risk Amplification reason */}
          {clause.riskReason && (
            <div className={`p-3.5 rounded-lg border text-xs font-medium leading-relaxed ${getRiskColorClass(clause.riskLevel || 'low')}`}>
              <strong>Risk Flag:</strong> {clause.riskReason}
            </div>
          )}

          {/* Plain English Translation & Translation Toolbar */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5 font-label">
                <Brain className="w-3.5 h-3.5" />
                <span>AI Interpretation</span>
              </h4>
              
              {/* Language Toolbar */}
              <div className="flex items-center gap-1 bg-[#090B0F] rounded-md border border-[rgba(255,255,255,0.08)] p-0.5">
                {(['en', 'hi', 'ta', 'te'] as const).map((l) => (
                  <button 
                    key={l}
                    onClick={() => handleTranslate(l)} 
                    className={`text-[9px] font-bold px-2 py-1 rounded transition-all uppercase tracking-wide ${
                      lang === l 
                        ? 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37]' 
                        : 'text-[#667085] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.04)] text-sm text-[#A8B3C7] leading-relaxed">
              {isTranslating ? (
                <div className="flex items-center gap-2 text-xs text-[#667085]">
                  <Languages className="w-3.5 h-3.5 animate-spin" />
                  <span>Translating legal analysis...</span>
                </div>
              ) : (
                translatedText || clause.explanation || 'No analysis explanation provided.'
              )}
            </div>
          </div>

          {/* Suggestion Counter Clause */}
          {clause.counterClause && (
            <div className="flex flex-col gap-3 bg-[rgba(16,185,129,0.03)] border border-[rgba(16,185,129,0.1)] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-[0.15em] font-label">
                    Negotiation Recommendation
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(clause.counterClause!, 'counter')}
                  className="text-[10px] font-bold text-[#667085] hover:text-[#F8FAFC] flex items-center gap-1.5 bg-[#090B0F] px-2.5 py-1.5 rounded-md border border-[rgba(255,255,255,0.08)] transition-colors uppercase tracking-wider"
                >
                  {copiedText === 'counter' ? (
                    <>
                      <Check className="w-3 h-3 text-[#10B981]" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Text
                    </>
                  )}
                </button>
              </div>
              <p className="text-[13px] leading-relaxed font-mono text-[#A8B3C7] mt-1 select-all border-l-2 border-[#10B981]/30 pl-3">
                "{clause.counterClause}"
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
