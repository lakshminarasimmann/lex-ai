'use client';

import React, { useState, useMemo } from 'react';
import { ShieldCheck, Search, Filter } from 'lucide-react';
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
    <div className="flex flex-col gap-5 py-4 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search clauses or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/40 border border-[rgba(255,255,255,0.06)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-black/30 rounded-xl border border-[rgba(255,255,255,0.04)]">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map((lvl) => {
          const count = counts[lvl];
          const isActive = filter === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-[10px] sm:text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-200 ${
                isActive 
                  ? lvl === 'critical' ? 'bg-red-600 text-white' :
                    lvl === 'high' ? 'bg-orange-600 text-white' :
                    lvl === 'medium' ? 'bg-amber-500 text-black' :
                    lvl === 'low' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                  : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <span>{lvl}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                isActive ? 'bg-black/20 text-current' : 'bg-white/[0.05] text-[var(--text-muted)]'
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
          <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="font-bold text-white text-base">All Clear!</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              No matching clause risk flags found. Try refining your filters or search terms.
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
