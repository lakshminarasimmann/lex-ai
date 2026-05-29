'use client';

import React, { useState } from 'react';
import { Plus, Minus, Edit2, Shield, Info, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { CompareResult } from '@/lib/types';
import StaggerChildren from '@/components/animations/StaggerChildren';
import FadeIn from '@/components/animations/FadeIn';

interface DiffViewerProps {
  result: CompareResult;
}

export default function DiffViewer({ result }: DiffViewerProps) {
  const [filter, setFilter] = useState<'all' | 'added' | 'removed' | 'modified'>('all');

  const filteredChanges = result.changes.filter(change => {
    if (filter === 'all') return true;
    return change.changeType === filter;
  });

  const stats = {
    total: result.changes.length,
    added: result.changes.filter(c => c.changeType === 'added').length,
    removed: result.changes.filter(c => c.changeType === 'removed').length,
    modified: result.changes.filter(c => c.changeType === 'modified').length,
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="w-4 h-4 text-[#10B981]" />;
      case 'removed': return <Minus className="w-4 h-4 text-[#EF4444]" />;
      case 'modified': return <Edit2 className="w-4 h-4 text-[#F59E0B]" />;
      default: return null;
    }
  };

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'worse': return 'danger';
      case 'neutral': return 'warning';
      case 'better': return 'success';
      default: return 'outline';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header & Stats */}
      <FadeIn direction="up">
        <Card className="p-6 border-[rgba(255,255,255,0.06)] bg-[#11151C] flex flex-col md:flex-row justify-between items-center gap-6" padding="none">
          <div className="flex flex-col gap-1.5 w-full md:w-auto">
            <h2 className="text-lg font-bold text-[#F8FAFC]">Diff Analysis Complete</h2>
            <p className="text-sm text-[#A8B3C7] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              Comparison complete
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button 
              onClick={() => setFilter('all')}
              className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] border transition-colors ${
                filter === 'all' 
                  ? 'bg-[rgba(212,175,55,0.1)] border-[rgba(212,175,55,0.3)] shadow-[0_0_12px_rgba(212,175,55,0.1)]' 
                  : 'bg-[#1A202B] border-[rgba(255,255,255,0.06)] hover:bg-[#242B36]'
              }`}
            >
              <span className={`text-xl font-black ${filter === 'all' ? 'text-[#D4AF37]' : 'text-[#F8FAFC]'}`}>{stats.total}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#667085]">Total</span>
            </button>
            <button 
              onClick={() => setFilter('added')}
              className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] border transition-colors ${
                filter === 'added' 
                  ? 'bg-[rgba(16,185,129,0.15)] border-[rgba(16,185,129,0.3)] shadow-[0_0_12px_rgba(16,185,129,0.1)]' 
                  : 'bg-[#1A202B] border-[rgba(255,255,255,0.06)] hover:bg-[#242B36]'
              }`}
            >
              <span className={`text-xl font-black ${filter === 'added' ? 'text-[#10B981]' : 'text-[#F8FAFC]'}`}>{stats.added}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#667085]">Added</span>
            </button>
            <button 
              onClick={() => setFilter('removed')}
              className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] border transition-colors ${
                filter === 'removed' 
                  ? 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.3)] shadow-[0_0_12px_rgba(239,68,68,0.1)]' 
                  : 'bg-[#1A202B] border-[rgba(255,255,255,0.06)] hover:bg-[#242B36]'
              }`}
            >
              <span className={`text-xl font-black ${filter === 'removed' ? 'text-[#EF4444]' : 'text-[#F8FAFC]'}`}>{stats.removed}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#667085]">Removed</span>
            </button>
            <button 
              onClick={() => setFilter('modified')}
              className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] border transition-colors ${
                filter === 'modified' 
                  ? 'bg-[rgba(245,158,11,0.15)] border-[rgba(245,158,11,0.3)] shadow-[0_0_12px_rgba(245,158,11,0.1)]' 
                  : 'bg-[#1A202B] border-[rgba(255,255,255,0.06)] hover:bg-[#242B36]'
              }`}
            >
              <span className={`text-xl font-black ${filter === 'modified' ? 'text-[#F59E0B]' : 'text-[#F8FAFC]'}`}>{stats.modified}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#667085]">Modified</span>
            </button>
          </div>
        </Card>
      </FadeIn>

      {/* Changes Summary */}
      <FadeIn direction="up" delay={0.1}>
        <div className="p-4 bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.15)] rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#F8FAFC]">AI Impact Summary</h3>
            <p className="text-xs text-[#A8B3C7] leading-relaxed">
              Reviewed all semantic changes between versions.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Changes List */}
      <div className="flex flex-col gap-4 mt-2">
        <StaggerChildren>
          {filteredChanges.length > 0 ? (
            filteredChanges.map((change, idx) => (
              <FadeIn key={idx} direction="up">
                <Card 
                  className={`p-5 flex flex-col gap-4 border-[rgba(255,255,255,0.06)] bg-[#11151C] border-l-[3px] ${
                    change.changeType === 'added' ? 'border-l-[#10B981]' :
                    change.changeType === 'removed' ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]'
                  }`}
                  padding="none"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${
                        change.changeType === 'added' ? 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)]' :
                        change.changeType === 'removed' ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]' : 
                        'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)]'
                      }`}>
                        {getChangeIcon(change.changeType)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#F8FAFC]">
                          {change.changeType === 'modified' ? 'Modified Clause' : change.changeType === 'added' ? 'New Clause Added' : 'Clause Removed'}
                        </span>
                      </div>
                    </div>
                    {change.impact && (
                      <Badge variant={getImpactBadgeVariant(change.impact)}>
                        {change.impact.toUpperCase()} IMPACT
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2 p-4 bg-[rgba(16,185,129,0.03)] border border-[rgba(16,185,129,0.1)] rounded-xl relative">
                      <p className="text-xs font-mono text-[#F8FAFC] leading-relaxed pt-2">
                        {change.clause}
                      </p>
                    </div>
                  </div>

                  {change.explanation && (
                    <div className="mt-2 p-3.5 bg-[#090B0F] rounded-lg border border-[rgba(255,255,255,0.04)] flex gap-3 items-start">
                      <AlertTriangle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider font-label block mb-1">
                          Strategic Implication
                        </span>
                        <p className="text-xs text-[#A8B3C7] leading-relaxed">
                          {change.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </FadeIn>
            ))
          ) : (
            <div className="py-12 text-center text-sm text-[#667085]">
              No {filter} changes found between the documents.
            </div>
          )}
        </StaggerChildren>
      </div>
    </div>
  );
}
