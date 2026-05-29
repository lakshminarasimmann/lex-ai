'use client';

import React, { useState, useMemo } from 'react';
import { ShieldCheck, Filter } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import RiskCard from './RiskCard';
import { Clause } from '@/lib/types';
import StaggerChildren from '@/components/animations/StaggerChildren';
import FadeIn from '@/components/animations/FadeIn';

interface RiskFlagsTabProps {
  clauses: Clause[];
  onSelectClause?: (pageNumber: number) => void;
}

export default function RiskFlagsTab({ clauses, onSelectClause }: RiskFlagsTabProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [search, setSearch] = useState('');

  // Count per category
  const counts = useMemo(() => {
    return {
      all: clauses.length,
      critical: clauses.filter((c) => c.riskLevel === 'critical').length,
      high: clauses.filter((c) => c.riskLevel === 'high').length,
      medium: clauses.filter((c) => c.riskLevel === 'medium').length,
      low: clauses.filter((c) => c.riskLevel === 'low').length,
    };
  }, [clauses]);

  // Filter clauses
  const filteredClauses = useMemo(() => {
    return clauses
      .filter((c) => {
        if (filter === 'all') return true;
        return c.riskLevel?.toLowerCase() === filter;
      })
      .filter((c) => {
        if (!search.trim()) return true;
        const text = c.text?.toLowerCase() || '';
        const cat = c.category?.toLowerCase() || '';
        const query = search.toLowerCase();
        return text.includes(query) || cat.includes(query);
      })
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0)); // Sort by highest risk score first
  }, [clauses, filter, search]);

  return (
    <div className="flex flex-col gap-5 py-3 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
      {/* Search Bar */}
      <SearchBar 
        onSearch={setSearch} 
        placeholder="Search clauses or categories (e.g. 'indemnity')..." 
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#11151C] rounded-xl border border-[rgba(255,255,255,0.06)]">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map((lvl) => {
          const count = counts[lvl];
          const isActive = filter === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-[10px] sm:text-[11px] font-semibold rounded-lg uppercase tracking-wider transition-all duration-200 font-label ${
                isActive 
                  ? lvl === 'critical' ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.3)] shadow-[0_0_12px_rgba(239,68,68,0.1)]' :
                    lvl === 'high' ? 'bg-[rgba(249,115,22,0.15)] text-[#f97316] border border-[rgba(249,115,22,0.3)] shadow-[0_0_12px_rgba(249,115,22,0.1)]' :
                    lvl === 'medium' ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)] shadow-[0_0_12px_rgba(245,158,11,0.1)]' :
                    lvl === 'low' ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)] shadow-[0_0_12px_rgba(16,185,129,0.1)]' : 
                    'bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border border-[rgba(212,175,55,0.3)] shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                  : 'text-[#667085] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
              }`}
            >
              <span>{lvl}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                isActive ? 'bg-black/30 text-current' : 'bg-[#1A202B] text-[#667085]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Clause Cards List */}
      {filteredClauses.length > 0 ? (
        <StaggerChildren>
          <div className="flex flex-col gap-4">
            {filteredClauses.map((clause) => (
              <FadeIn key={clause.id} direction="up">
                <RiskCard clause={clause} onSelect={onSelectClause} />
              </FadeIn>
            ))}
          </div>
        </StaggerChildren>
      ) : (
        <FadeIn direction="none" className="py-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-[#10B981]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="font-bold text-[#F8FAFC] text-base">All Clear!</h3>
            <p className="text-sm text-[#A8B3C7] leading-relaxed">
              No matching clause risk flags found. Try refining your filters or search terms.
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
