'use client';

import React, { useState } from 'react';
import { GitCompare, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/ui/FileUpload';
import { uploadDocument, compareDocuments } from '@/lib/api';
import DiffViewer from './DiffViewer';
import { CompareResult, Clause } from '@/lib/types';
import FadeIn from '@/components/animations/FadeIn';

export default function CompareUpload() {
  const [clauses1, setClauses1] = useState<Clause[] | null>(null);
  const [clauses2, setClauses2] = useState<Clause[] | null>(null);
  const [name1, setName1] = useState<string | null>(null);
  const [name2, setName2] = useState<string | null>(null);

  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload1 = async (file: File) => {
    setIsLoading1(true);
    setError(null);
    try {
      const data = await uploadDocument(file);
      setClauses1(data.clauses);
      setName1(file.name);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload and parse original contract');
    } finally {
      setIsLoading1(false);
    }
  };

  const handleUpload2 = async (file: File) => {
    setIsLoading2(true);
    setError(null);
    try {
      const data = await uploadDocument(file);
      setClauses2(data.clauses);
      setName2(file.name);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload and parse revised contract');
    } finally {
      setIsLoading2(false);
    }
  };

  const handleCompare = async () => {
    if (!clauses1 || !clauses2) return;
    setIsComparing(true);
    setError(null);
    try {
      const result = await compareDocuments(clauses1, clauses2);
      setCompareResult(result);
    } catch (err: any) {
      setError(err?.message || 'Comparison failed. Make sure both files have been successfully parsed.');
    } finally {
      setIsComparing(false);
    }
  };

  const handleReset = () => {
    setClauses1(null);
    setClauses2(null);
    setName1(null);
    setName2(null);
    setCompareResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto my-8 px-4">
      {/* Side-by-Side Upload Cards */}
      {!compareResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Slot 1: Original */}
          <FadeIn direction="left">
            <Card className="p-6 border-[rgba(255,255,255,0.06)] bg-[#0d0d18]/40 backdrop-blur-md flex flex-col gap-4 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                Baseline Agreement
              </span>
              <h3 className="text-xl font-bold text-white tracking-wide">1. Original Contract</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Upload the original, un-edited contract or standard boilerplate version.
              </p>
              
              <div className="mt-2 min-h-[160px] flex items-center justify-center border border-dashed border-[rgba(255,255,255,0.08)] bg-black/20 rounded-xl p-4">
                {name1 ? (
                  <div className="flex flex-col items-center text-center gap-2 p-4">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]">{name1}</span>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">✓ Parsed</span>
                  </div>
                ) : (
                  <FileUpload onUpload={handleUpload1} isLoading={isLoading1} progress={isLoading1 ? 50 : 0} />
                )}
              </div>
            </Card>
          </FadeIn>

          {/* Slot 2: Revised */}
          <FadeIn direction="right" delay={0.1}>
            <Card className="p-6 border-[rgba(255,255,255,0.06)] bg-[#0d0d18]/40 backdrop-blur-md flex flex-col gap-4 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                Modified Agreement
              </span>
              <h3 className="text-xl font-bold text-white tracking-wide">2. Revised Contract</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Upload the revised contract or redlined version with changes to check impact.
              </p>
              
              <div className="mt-2 min-h-[160px] flex items-center justify-center border border-dashed border-[rgba(255,255,255,0.08)] bg-black/20 rounded-xl p-4">
                {name2 ? (
                  <div className="flex flex-col items-center text-center gap-2 p-4">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]">{name2}</span>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">✓ Parsed</span>
                  </div>
                ) : (
                  <FileUpload onUpload={handleUpload2} isLoading={isLoading2} progress={isLoading2 ? 50 : 0} />
                )}
              </div>
            </Card>
          </FadeIn>
        </div>
      )}

      {/* Error Displays */}
      {error && (
        <FadeIn direction="none" className="p-4 rounded-xl border border-red-500/20 bg-red-950/10 text-red-400 text-sm font-medium text-left">
          {error}
        </FadeIn>
      )}

      {/* Compare Execution CTA */}
      {!compareResult && clauses1 && clauses2 && (
        <FadeIn direction="up" className="flex justify-center mt-2">
          <Button
            onClick={handleCompare}
            isLoading={isComparing}
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3 px-8 text-sm tracking-widest uppercase shadow-glow-primary border-0 rounded-xl"
          >
            <GitCompare className="w-5 h-5" /> Compare Drafts
          </Button>
        </FadeIn>
      )}

      {/* Diff Results Output */}
      {compareResult && (
        <FadeIn direction="up">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-black/30 border border-[rgba(255,255,255,0.06)] px-6 py-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse-slow" />
                <div className="flex flex-col text-left">
                  <h3 className="font-extrabold text-white text-base">Comparison Analysis</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Showing legal modifications and signer impact levels</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} className="border-slate-800 text-white hover:bg-white/[0.03]">
                Compare New Contracts
              </Button>
            </div>
            
            <DiffViewer changes={compareResult.changes} />
          </div>
        </FadeIn>
      )}
    </div>
  );
}
