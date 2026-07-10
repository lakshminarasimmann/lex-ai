'use client';

import React, { useState, useEffect } from 'react';
import { File, AlertTriangle, FileCheck, Scale, Play, Square } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const summaryText = analysis.summary || 'A legal summary of this agreement could not be generated.';
      const utterance = new SpeechSynthesisUtterance(summaryText);
      
      // Try to pick a natural sounding English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-') && (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Natural')));
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.rate = 0.95; // Slightly slower for legal text
      utterance.pitch = 1.0;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Calculate risk counts
  const riskCounts = {
    critical: clauses.filter((c) => c.riskLevel === 'critical').length,
    high: clauses.filter((c) => c.riskLevel === 'high').length,
    medium: clauses.filter((c) => c.riskLevel === 'medium').length,
    low: clauses.filter((c) => c.riskLevel === 'low').length,
  };

  const getRiskStatusVariant = (score: number): 'success' | 'warning' | 'danger' => {
    if (score <= 25) return 'success';
    if (score <= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="flex flex-col gap-5 py-3 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
      {/* Gauge and Overall Assessment */}
      <FadeIn direction="up">
        <Card className="p-5 border-[rgba(255,255,255,0.06)] bg-[#11151C] flex flex-col items-center" padding="none">
          <div className="flex justify-between items-center w-full px-5 pt-5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider font-label">Analysis Overview</span>
            <Badge variant={getRiskStatusVariant(analysis.overallScore || 0)} glow>
              {getDocTypeLabel(document.docType)}
            </Badge>
          </div>
          
          <GaugeChart score={analysis.overallScore || 0} />
          
          <div className="grid grid-cols-3 gap-2 w-full px-5 pb-5 text-center border-t border-[rgba(255,255,255,0.06)] pt-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#667085] font-semibold uppercase font-label">Pages</span>
              <span className="text-lg font-bold text-[#F8FAFC] flex items-center gap-1.5 font-display">
                <File className="w-4 h-4 text-[#3B82F6]" />
                {document.pageCount}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-[rgba(255,255,255,0.06)]">
              <span className="text-[10px] text-[#667085] font-semibold uppercase font-label">Clauses</span>
              <span className="text-lg font-bold text-[#F8FAFC] flex items-center gap-1.5 font-display">
                <FileCheck className="w-4 h-4 text-[#10B981]" />
                {document.clauseCount}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-[#667085] font-semibold uppercase font-label">Risks Found</span>
              <span className="text-lg font-bold text-[#F8FAFC] flex items-center gap-1.5 font-display">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                {riskCounts.high + riskCounts.critical}
              </span>
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Executive Summary */}
      <FadeIn direction="up" delay={0.06}>
        <Card className="p-5 border-[rgba(255,255,255,0.06)] bg-[#11151C] flex flex-col gap-3" padding="none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-bold text-[#F8FAFC] text-sm tracking-wide">Executive Summary</h3>
            </div>
            <button 
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                isPlaying 
                  ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] text-[#EF4444] hover:bg-[rgba(239,68,68,0.15)]'
                  : 'bg-[rgba(212,175,55,0.1)] border-[rgba(212,175,55,0.3)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.15)]'
              }`}
            >
              {isPlaying ? (
                <><Square className="w-3 h-3 fill-current" /> Stop Briefing</>
              ) : (
                <><Play className="w-3 h-3 fill-current" /> Listen to Brief</>
              )}
            </button>
          </div>
          <p className="text-sm text-[#A8B3C7] leading-relaxed">
            {analysis.summary || 'A legal summary of this agreement could not be generated. Please review individual risk flags.'}
          </p>
        </Card>
      </FadeIn>

      {/* Top 3 Things to Know */}
      {analysis.topThingsToKnow && analysis.topThingsToKnow.length > 0 && (
        <FadeIn direction="up" delay={0.12}>
          <Card className="p-5 border-[rgba(255,255,255,0.06)] bg-[#11151C] flex flex-col gap-4" padding="none">
            <h3 className="font-bold text-[#F8FAFC] text-sm tracking-wide">
              Top 3 Things to Know Before Signing
            </h3>
            
            <div className="flex flex-col gap-3">
              {analysis.topThingsToKnow.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-[rgba(255,255,255,0.04)] pb-3 last:border-0 last:pb-0">
                  <div className="w-6 h-6 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-[10px] font-black text-[#D4AF37] mt-0.5 shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-[#A8B3C7] leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      )}

      {/* Risk Distribution Breakdown */}
      <FadeIn direction="up" delay={0.18}>
        <Card className="p-5 border-[rgba(255,255,255,0.06)] bg-[#11151C] flex flex-col gap-4" padding="none">
          <h3 className="font-bold text-[#F8FAFC] text-sm tracking-wide">
            Risk Profile Distribution
          </h3>
          
          <div className="flex flex-col gap-3">
            {/* Critical */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#EF4444]">
                  <span className="risk-dot risk-dot--critical" />
                  Critical Risks
                </span>
                <span className="text-[#A8B3C7]">{riskCounts.critical} clauses</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1A202B] overflow-hidden">
                <div 
                  className="h-full bg-[#EF4444] transition-all duration-700 rounded-full" 
                  style={{ width: `${clauses.length ? (riskCounts.critical / clauses.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* High */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#f97316]">
                  <span className="risk-dot risk-dot--high" />
                  High Risks
                </span>
                <span className="text-[#A8B3C7]">{riskCounts.high} clauses</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1A202B] overflow-hidden">
                <div 
                  className="h-full bg-[#f97316] transition-all duration-700 rounded-full" 
                  style={{ width: `${clauses.length ? (riskCounts.high / clauses.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#F59E0B]">
                  <span className="risk-dot risk-dot--medium" />
                  Medium Risks
                </span>
                <span className="text-[#A8B3C7]">{riskCounts.medium} clauses</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1A202B] overflow-hidden">
                <div 
                  className="h-full bg-[#F59E0B] transition-all duration-700 rounded-full" 
                  style={{ width: `${clauses.length ? (riskCounts.medium / clauses.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Low */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#10B981]">
                  <span className="risk-dot risk-dot--low" />
                  Low Risks
                </span>
                <span className="text-[#A8B3C7]">{riskCounts.low} clauses</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1A202B] overflow-hidden">
                <div 
                  className="h-full bg-[#10B981] transition-all duration-700 rounded-full" 
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
