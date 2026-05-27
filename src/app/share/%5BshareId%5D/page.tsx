'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Loader2, Info, ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import dynamic from 'next/dynamic';
import AnalysisPanel from '@/components/analysis/AnalysisPanel';

const DocumentViewer = dynamic(() => import('@/components/analysis/DocumentViewer'), {
  ssr: false,
});
import { AnalysisResults } from '@/lib/types';
import { MOCK_SAMPLES } from '@/lib/mockData';

interface PageProps {
  params: {
    shareId: string;
  };
}

// ---------------------------------------------------------------------------
// Browser-native GZIP state decompression
// ---------------------------------------------------------------------------
async function decompressResults(token: string): Promise<AnalysisResults> {
  // Restore standard base64 from base64url
  const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  const stream = new Blob([bytes]).stream();
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
  
  const chunks: any[] = [];
  const reader = decompressedStream.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  const decompressedBlob = new Blob(chunks);
  const jsonStr = await decompressedBlob.text();
  return JSON.parse(jsonStr) as AnalysisResults;
}

export default function SharedAnalysisPage({ params }: PageProps) {
  const router = useRouter();
  const shareId = params.shareId;

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Current page state for document viewer
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!shareId) return;

    // Support sample sandbox shares instantly
    if (shareId.startsWith('sample-')) {
      const data = MOCK_SAMPLES[shareId];
      if (data) {
        setResults(data);
      } else {
        setError('Sample shared dataset not found.');
      }
      setIsLoading(false);
      return;
    }

    const fetchSharedData = async () => {
      try {
        // Decompress GZIP results directly in browser!
        const decodedResults = await decompressResults(shareId);
        setResults(decodedResults);
      } catch (err: any) {
        console.error('Decompression failed:', err);
        setError('This shared report link appears to be invalid or corrupted.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedData();
  }, [shareId]);

  const handleSelectClause = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getMockDraftText = (type: string) => {
    if (type.includes('rental')) {
      return `RESIDENTIAL LEASE AGREEMENT (SAMPLE DRAFT)
      
1. SECURITY DEPOSIT: The Security Deposit of $3,500 shall be held by Landlord. Landlord shall have the right to retain the entirety of the deposit if Tenant vacates the premises prior to the expiration of the full 24-month term...
      
2. MAINTENANCE AND REPAIRS: Tenant shall be solely responsible for all maintenance, repairs, and upkeep of the premises including structural foundations...`;
    }
    if (type.includes('employment')) {
      return `EMPLOYMENT OFFER & INVENTIONS AGREEMENT (SAMPLE DRAFT)
      
1. NON-COMPETE COVENANT: Employee agrees that during their employment and for a period of three (3) years post-termination, Employee shall not engage directly or indirectly in any competitor business activity anywhere in the global market.`;
    }
    return `MUTUAL NON-DISCLOSURE AGREEMENT (SAMPLE DRAFT)

1. DURATION OF OBLIGATIONS: The Receiving Party's obligations to protect all Confidential Information shared under this agreement shall remain in effect perpetually and indefinitely...`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06060c] text-white flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <div className="flex flex-col gap-1.5 text-center">
          <h2 className="font-extrabold text-white text-lg tracking-wide animate-pulse">
            Decompressing Shared Report
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-semibold uppercase">
            Restoring in-memory legal dashboard...
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
          <h2 className="font-extrabold text-white text-xl">Report Not Found</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {error || 'This shared analysis link has expired or is invalid.'}
          </p>
        </div>
        <Button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-6">
          Analyze Your Document
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060c] text-slate-100 flex flex-col pt-16 relative">
      
      {/* Read-Only Top Banner */}
      <div className="bg-indigo-600 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 relative z-50 shadow-md">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>You are viewing a shared LexAI legal risk report.</span>
        <button 
          onClick={() => router.push('/')}
          className="underline hover:text-indigo-100 flex items-center gap-0.5 ml-2"
        >
          Analyze your own contract <ExternalLink className="w-3 h-3 inline" />
        </button>
      </div>

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
                READ-ONLY SHARE LINK
              </span>
            </div>
          </div>

          <div>
            <Button 
              size="sm" 
              onClick={() => router.push('/')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Scan New Contract
            </Button>
          </div>
        </div>
      </header>

      {/* Main split viewport layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full px-6 py-6 overflow-hidden mt-6">
        
        {/* Left pane: Contract document text or PDF */}
        <div className="lg:col-span-6 h-full flex flex-col min-h-[500px]">
          {shareId.startsWith('sample-') || !results.document.blobUrl ? (
            <Card className="flex-1 border-[rgba(255,255,255,0.06)] bg-[#0c0c16]/50 backdrop-blur-md overflow-hidden flex flex-col p-6 text-left">
              <div className="border-b border-[rgba(255,255,255,0.06)] pb-4 mb-4 flex justify-between items-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                  Document Draft
                </span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-xs text-[var(--text-secondary)] leading-relaxed bg-black/40 border border-[rgba(255,255,255,0.04)] rounded-xl p-6 select-none font-feature-settings:normal">
                {getMockDraftText(results.document.docType || results.document.id).split('\n\n').map((para, idx) => (
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
    </div>
  );
}
