'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Languages } from 'lucide-react';
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
      case 'critical': return 'text-red-400 border-red-500/20 bg-red-950/20';
      case 'high': return 'text-orange-400 border-orange-500/20 bg-orange-950/20';
      case 'medium': return 'text-amber-400 border-amber-500/20 bg-amber-950/20';
      default: return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
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
      className={`p-5 flex flex-col gap-4 border-[rgba(255,255,255,0.06)] bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-200 border-l-4 ${
        clause.riskLevel === 'critical' ? 'border-l-red-500' :
        clause.riskLevel === 'high' ? 'border-l-orange-500' :
        clause.riskLevel === 'medium' ? 'border-l-amber-500' : 'border-l-emerald-500'
      }`}
    >
      {/* Risk Card Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
            Clause {clause.index} &bull; {clause.category || 'General Terms'}
          </span>
          <Badge variant={getRiskBadgeVariant(clause.riskLevel || 'low')} className="w-fit">
            {clause.riskLevel?.toUpperCase()} RISK
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Page Jumper */}
          {clause.pageNumber && (
            <button
              onClick={() => onSelect && onSelect(clause.pageNumber!)}
              className="text-[10px] font-bold text-indigo-400 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/20 px-2 py-1 rounded transition-colors"
            >
              Page {clause.pageNumber}
            </button>
          )}

          {/* Collapsible toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[var(--text-secondary)] hover:text-white p-1 rounded hover:bg-white/[0.04] transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Snippet display */}
      <div className="flex flex-col gap-2">
        <div className="p-3 bg-black/40 rounded-lg text-xs leading-relaxed text-[var(--text-secondary)] border border-[rgba(255,255,255,0.03)] font-mono max-h-24 overflow-y-auto">
          "{clause.text}"
        </div>
      </div>

      {/* Explanations (collapsible) */}
      {isExpanded && (
        <div className="flex flex-col gap-4 border-t border-[rgba(255,255,255,0.06)] pt-4 animate-fadeIn">
          {/* Risk Amplification reason */}
          {clause.riskReason && (
            <div className={`p-3 rounded-lg border text-xs font-semibold leading-relaxed ${getRiskColorClass(clause.riskLevel || 'low')}`}>
              <strong>Risk Flag:</strong> {clause.riskReason}
            </div>
          )}

          {/* Plain English Translation & Translation Toolbar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <span>Plain-English Analysis</span>
              </h4>
              
              {/* Language Toolbar */}
              <div className="flex items-center gap-1.5 bg-black/40 rounded-md border border-[rgba(255,255,255,0.05)] p-0.5">
                <button 
                  onClick={() => handleTranslate('en')} 
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => handleTranslate('hi')} 
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${lang === 'hi' ? 'bg-indigo-600 text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                  HI
                </button>
                <button 
                  onClick={() => handleTranslate('ta')} 
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${lang === 'ta' ? 'bg-indigo-600 text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                  TA
                </button>
                <button 
                  onClick={() => handleTranslate('te')} 
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${lang === 'te' ? 'bg-indigo-600 text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
                >
                  TE
                </button>
              </div>
            </div>

            <div className="p-3 bg-white/[0.01] rounded-lg border border-[rgba(255,255,255,0.03)] text-sm text-[var(--text-secondary)] leading-relaxed">
              {isTranslating ? (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
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
            <div className="flex flex-col gap-2 bg-emerald-950/10 border border-emerald-500/10 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Suggested Counter-Clause
                </span>
                <button
                  onClick={() => handleCopy(clause.counterClause!, 'counter')}
                  className="text-xs font-bold text-[var(--text-secondary)] hover:text-white flex items-center gap-1 bg-black/30 px-2 py-1 rounded border border-[rgba(255,255,255,0.05)] transition-colors"
                >
                  {copiedText === 'counter' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs leading-relaxed font-mono text-[var(--text-secondary)] mt-1 select-all">
                "{clause.counterClause}"
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
