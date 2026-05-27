'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Shield, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface DiffChange {
  clause: string;
  changeType: 'added' | 'removed' | 'modified';
  impact: 'better' | 'worse' | 'neutral';
  explanation: string;
}

interface DiffViewerProps {
  changes: DiffChange[];
}

export default function DiffViewer({ changes }: DiffViewerProps) {
  const getImpactBadgeVariant = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'better': return 'success';
      case 'worse': return 'danger';
      default: return 'info';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'better': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'worse': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      default: return <Shield className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'added': return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20';
      case 'removed': return 'text-red-400 bg-red-950/40 border-red-500/20';
      default: return 'text-amber-400 bg-amber-950/40 border-amber-500/20';
    }
  };

  if (!changes || changes.length === 0) {
    return (
      <Card className="p-8 text-center text-xs text-[var(--text-muted)] border-[rgba(255,255,255,0.06)] bg-white/[0.01]">
        No substantial legal changes identified between the two documents.
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {changes.map((change, idx) => (
        <Card 
          key={idx}
          className={`p-5 text-left border-[rgba(255,255,255,0.06)] bg-white/[0.01] hover:bg-white/[0.02] flex flex-col gap-3.5 border-l-4 ${
            change.impact === 'better' ? 'border-l-emerald-500' :
            change.impact === 'worse' ? 'border-l-red-500' : 'border-l-cyan-500'
          }`}
        >
          {/* Header Row */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              {getImpactIcon(change.impact)}
              <div className="flex flex-col gap-0.5">
                <h4 className="font-extrabold text-white text-sm leading-tight">
                  {change.clause}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-extrabold tracking-widest uppercase px-1.5 py-0.5 border rounded ${getChangeTypeColor(change.changeType)}`}>
                    {change.changeType}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)]">
                    Signer Impact:
                  </span>
                  <Badge variant={getImpactBadgeVariant(change.impact)} className="text-[8px] px-1 py-0 font-extrabold leading-none uppercase">
                    {change.impact}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation block */}
          <div className="text-xs text-[var(--text-secondary)] leading-relaxed bg-black/35 p-3 rounded-lg border border-[rgba(255,255,255,0.03)] flex gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              <strong>Impact Explanation:</strong> {change.explanation}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
