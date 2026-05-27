'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, GitCompare, Link2, Check, Copy, Sparkles, Loader2, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import dynamic from 'next/dynamic';
import AnalysisPanel from '@/components/analysis/AnalysisPanel';

const DocumentViewer = dynamic(() => import('@/components/analysis/DocumentViewer'), {
  ssr: false,
});
import ChatInterface from '@/components/chat/ChatInterface';
import CompareUpload from '@/components/compare/CompareUpload';
import { useAnalysis } from '@/hooks/useAnalysis';
import { MOCK_SAMPLES } from '@/lib/mockData';
import { AnalysisResults } from '@/lib/types';

interface PageProps {
  params: {
    docId: string;
  };
}

// ---------------------------------------------------------------------------
// Browser-native GZIP state compression
// ---------------------------------------------------------------------------
async function compressResults(results: AnalysisResults): Promise<string> {
  const jsonStr = JSON.stringify(results);
  const stream = new Blob([jsonStr], { type: 'text/plain' }).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
  
  const chunks: any[] = [];
  const reader = compressedStream.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  const compressedBlob = new Blob(chunks);
  const buffer = await compressedBlob.arrayBuffer();
  
  // Convert ArrayBuffer to base64url
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export default function AnalysisPage({ params }: PageProps) {
  const router = useRouter();
  const docId = params.docId;
  const isSample = docId.startsWith('sample-');

  const [sampleLoading, setSampleLoading] = useState(isSample);
  const [sampleResults, setSampleResults] = useState<AnalysisResults | null>(null);

  // Retrieve report from client sessionStorage or sample preloads
  const realAnalysis = useAnalysis(isSample ? '' : docId);

  // Share link states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Compare modal states
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Current page state for document viewer
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isSample) {
      const timer = setTimeout(() => {
        setSampleResults(MOCK_SAMPLES[docId] || null);
        setSampleLoading(false);
      }, 700); // Fast realistic sandbox loader
      return () => clearTimeout(timer);
    }
  }, [docId, isSample]);

  const results = isSample ? sampleResults : (realAnalysis.results ? realAnalysis.results : null);
  const isLoading = isSample ? sampleLoading : realAnalysis.isLoading;
  const error = isSample ? null : realAnalysis.error;

  const handleShare = async () => {
    setIsShareModalOpen(true);
    if (shareToken || !results) return;

    setIsGeneratingShare(true);
    try {
      // Compress the entire results JSON client-side using browser GZIP!
      const token = await compressResults(results);
      setShareToken(token);
    } catch (err) {
      console.error('Failed to compress share state:', err);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const copyShareLink = () => {
    if (!shareToken) return;
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleSelectClause = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getMockDraftText = (type: string) => {
    switch (type) {
      case 'sample-rental':
        return `RESIDENTIAL LEASE AGREEMENT

This lease agreement is made and entered into this 27th day of May, 2026, by and between the Landlord and the Tenant.

1. SECURITY DEPOSIT: The Security Deposit of $3,500 shall be held by Landlord. Landlord shall have the right to retain the entirety of the deposit if Tenant vacates the premises prior to the expiration of the full 24-month term, regardless of whether a replacement tenant is secured, and Landlord shall not be required to provide an itemized list of damages or deductions.

2. MAINTENANCE AND REPAIRS: Tenant shall be solely responsible for all maintenance, repairs, and upkeep of the premises including structural foundations, roof leaks, plumbing backups, and electrical wiring systems, and shall execute all repairs at Tenant's sole expense within 5 days of occurrence.

3. RIGHT OF ENTRY: Landlord reserves the right to enter the premises at any time, without prior notice, for inspections, general repairs, showing the property to prospective purchasers or tenants, or for any other reason deemed fit by Landlord.

4. AUTOMATIC RENEWAL: This agreement shall automatically renew for successive 1-year terms at a rent increase of 15% per annum unless either party provides written notice of non-renewal at least 90 days prior to the expiration date.`;

      case 'sample-employment':
        return `EMPLOYMENT OFFER & INVENTIONS AGREEMENT

This Agreement is made between the Employer and the Employee for Software Engineering services.

1. NON-COMPETE COVENANT: Employee agrees that during their employment and for a period of three (3) years post-termination, Employee shall not engage directly or indirectly in any business activity that competes with Company, or perform software engineering services for any competitor anywhere in the global market.

2. INTELLECTUAL PROPERTY RIGHTS: Company shall own all intellectual property, source code, designs, and systems conceived or created by Employee during the term of employment, including creations developed entirely on Employee's personal time, using personal equipment, and completely unrelated to Company's business scope.`;

      default:
        return `MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is made by the parties to discuss strategic business relations.

1. DURATION OF OBLIGATIONS: The Receiving Party's obligations to protect all Confidential Information shared under this agreement shall remain in effect perpetually and indefinitely, regardless of whether negotiations terminate or this agreement expires.`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06060c] text-white flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <div className="flex flex-col gap-1.5 text-center">
          <h2 className="font-extrabold text-white text-lg tracking-wide animate-pulse">
            Analyzing Contract Terms
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">
            Compiling in-flight analysis playbook...
          </p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-[#06060c] text-white flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="p-4 rounded-full bg-red-950/40 border border-red-500/20 text-red-400">
          <Info className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2 max-w-sm">
          <h2 className="font-extrabold text-white text-xl">Analysis Failed</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {error || 'The analysis results could not be retrieved from client memory. Please try re-uploading the PDF.'}
          </p>
        </div>
        <Button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-6">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060c] text-slate-100 flex flex-col pt-16 relative">
      
      {/* Header controls bar */}
      <header className="fixed top-0 left-0 w-full z-40 border-b border-[rgba(255,255,255,0.04)] bg-[#06060c]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="text-[var(--text-secondary)] hover:text-white p-1 rounded hover:bg-white/[0.03] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col text-left">
              <h1 className="font-extrabold text-white text-sm sm:text-base leading-none">
                {results.document.fileName}
              </h1>
              <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mt-0.5">
                LexAI risk report
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsCompareModalOpen(true)}
              className="border-slate-800 text-white hover:bg-white/[0.03] flex items-center gap-1.5 text-xs font-bold"
            >
              <GitCompare className="w-4 h-4" /> Compare
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleShare}
              className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 text-xs font-bold"
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main split viewport layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full px-6 py-6 overflow-hidden">
        
        {/* Left pane: Contract document text or PDF */}
        <div className="lg:col-span-6 h-full flex flex-col min-h-[500px]">
          {isSample ? (
            <Card className="flex-1 border-[rgba(255,255,255,0.06)] bg-[#0c0c16]/50 backdrop-blur-md overflow-hidden flex flex-col p-6 text-left">
              <div className="border-b border-[rgba(255,255,255,0.06)] pb-4 mb-4 flex justify-between items-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                  Interactive Agreement Draft
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-black uppercase">
                  Sandbox simulation
                </span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-xs text-[var(--text-secondary)] leading-relaxed bg-black/40 border border-[rgba(255,255,255,0.04)] rounded-xl p-6 select-all font-feature-settings:normal">
                {getMockDraftText(docId).split('\n\n').map((para, idx) => (
                  <p key={idx} className="mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </Card>
          ) : (
            <DocumentViewer 
              url={results.document.blobUrl} 
              currentPage={currentPage}
              onPageChange={(p) => setCurrentPage(p)}
            />
          )}
        </div>

        {/* Right pane: Analysis panel */}
        <div className="lg:col-span-6 h-full flex flex-col min-h-[500px]">
          <AnalysisPanel 
            results={results} 
            onSelectClause={handleSelectClause}
          />
        </div>
      </main>

      {/* Floating interactive chatbot Q&A (In-flight RAG) */}
      <ChatInterface 
        docId={docId} 
        clauses={results.clauses} 
        docType={results.document.docType} 
      />

      {/* Share Link Modal */}
      <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Share Analysis Report">
        <div className="flex flex-col gap-5 py-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Generate a secure, read-only link containing the full GZIP-compressed legal analysis to share with landlords, employers, or legal advisors. 
          </p>

          {isGeneratingShare ? (
            <div className="flex items-center justify-center p-6 gap-2 text-xs text-[var(--text-muted)] font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Compressing legal report...</span>
            </div>
          ) : shareToken ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 p-3 bg-black/40 rounded-xl border border-[rgba(255,255,255,0.08)] items-center">
                <Link2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/share/${shareToken}`}
                  className="flex-1 bg-transparent text-xs text-slate-200 border-0 focus:outline-none overflow-x-auto"
                />
                <button
                  onClick={copyShareLink}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 shrink-0"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest text-center">
                {copiedShare ? 'Copied link to clipboard!' : 'Click to copy the compressed state link'}
              </span>
            </div>
          ) : (
            <div className="text-center text-xs text-red-400">
              Failed to generate share link. Please try again.
            </div>
          )}
        </div>
      </Modal>

      {/* Compare Modal */}
      <Modal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
        title="Compare revised contract drafts"
        size="lg"
      >
        <CompareUpload />
      </Modal>
    </div>
  );
}
