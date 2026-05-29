'use client';

import React, { useState } from 'react';
import { AlertTriangle, Plus, Minus, Edit2, Shield, Info } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { DiffResult } from '@/lib/types';
import StaggerChildren from '@/components/animations/StaggerChildren';
import FadeIn from '@/components/animations/FadeIn';

interface DiffViewerProps {
  result: DiffResult;
}

export default function DiffViewer({ result }: DiffViewerProps) {
  const [filter, setFilter] = useState<'all' | 'added' | 'removed' | 'modified'>('all');

  const filteredChanges = result.changes.filter(change => {
    if (filter === 'all') return true;
    return change.type === filter;
  });

  const stats = {
    total: result.changes.length,
    added: result.changes.filter(c => c.type === 'added').length,
    removed: result.changes.filter(c => c.type === 'removed').length,
    modified: result.changes.filter(c => c.type === 'modified').length,
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="w-4 h-4 text-[#10B981]" />;
      case 'removed': return <Minus className="w-4 h-4 text-[#EF4444]" />;
      case 'modified': return <Edit2 className="w-4 h-4 text-[#F59E0B]" />;
      default: return null;
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'success';
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
              Compared <span className="font-mono text-[#F8FAFC] text-xs px-1.5 py-0.5 bg-[#1A202B] rounded border border-[rgba(255,255,255,0.08)]">{result.file1Name}</span> and <span className="font-mono text-[#F8FAFC] text-xs px-1.5 py-0.5 bg-[#1A202B] rounded border border-[rgba(255,255,255,0.08)]">{result.file2Name}</span>
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
              {result.summary}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Changes List */}
      <div className="flex flex-col gap-4 mt-2">
        <StaggerChildren>
          {filteredChanges.length > 0 ? (
            filteredChanges.map((change) => (
              <FadeIn key={change.id} direction="up">
                <Card 
                  className={`p-5 flex flex-col gap-4 border-[rgba(255,255,255,0.06)] bg-[#11151C] border-l-[3px] ${
                    change.type === 'added' ? 'border-l-[#10B981]' :
                    change.type === 'removed' ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]'
                  }`}
                  padding="none"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${
                        change.type === 'added' ? 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)]' :
                        change.type === 'removed' ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]' : 
                        'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)]'
                      }`}>
                        {getChangeIcon(change.type)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#F8FAFC]">
                          {change.type === 'modified' ? 'Modified Clause' : change.type === 'added' ? 'New Clause Added' : 'Clause Removed'}
                        </span>
                        {change.location && (
                          <p className="text-[10px] text-[#667085] uppercase tracking-wider font-label">
                            {change.location}
                          </p>
                        )}
                      </div>
                    </div>
                    {change.riskLevel && (
                      <Badge variant={getRiskBadgeVariant(change.riskLevel)}>
                        {change.riskLevel.toUpperCase()} RISK
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Old Version */}
                    {change.oldText && (
                      <div className="flex flex-col gap-2 p-4 bg-[rgba(239,68,68,0.03)] border border-[rgba(239,68,68,0.1)] rounded-xl relative">
                        <span className="absolute top-2 right-3 text-[9px] font-bold text-[#EF4444] uppercase tracking-[0.15em] font-label">Previous</span>
                        <p className="text-xs font-mono text-[#A8B3C7] leading-relaxed pt-2 line-through opacity-70">
                          {change.oldText}
                        </p>
                      </div>
                    )}
                    
                    {/* New Version */}
                    {change.newText && (
                      <div className="flex flex-col gap-2 p-4 bg-[rgba(16,185,129,0.03)] border border-[rgba(16,185,129,0.1)] rounded-xl relative">
                        <span className="absolute top-2 right-3 text-[9px] font-bold text-[#10B981] uppercase tracking-[0.15em] font-label">Current</span>
                        <p className="text-xs font-mono text-[#F8FAFC] leading-relaxed pt-2">
                          {change.newText}
                        </p>
                      </div>
                    )}
                  </div>

                  {change.implication && (
                    <div className="mt-2 p-3.5 bg-[#090B0F] rounded-lg border border-[rgba(255,255,255,0.04)] flex gap-3 items-start">
                      <AlertTriangle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider font-label block mb-1">
                          Strategic Implication
                        </span>
                        <p className="text-xs text-[#A8B3C7] leading-relaxed">
                          {change.implication}
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
