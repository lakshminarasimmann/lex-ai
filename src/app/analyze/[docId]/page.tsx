'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, ArrowLeft, Loader2, Link2, Shield, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import dynamic from 'next/dynamic';
import AnalysisPanel from '@/components/analysis/AnalysisPanel';
import ChatInterface from '@/components/chat/ChatInterface';

const DocumentViewer = dynamic(() => import('@/components/analysis/DocumentViewer'), {
  ssr: false,
});
import { AnalysisResults } from '@/lib/types';
import { MOCK_SAMPLES } from '@/lib/mockData';

interface PageProps {
  params: {
    docId: string;
  };
}

// ---------------------------------------------------------------------------
// Browser-native state compression for share links (Zero Database)
// ---------------------------------------------------------------------------
async function generateShareLink(results: AnalysisResults): Promise<string> {
  const jsonStr = JSON.stringify(results);
  const blob = new Blob([jsonStr]);
  const stream = blob.stream();
  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));

  const chunks: any[] = [];
  const reader = compressedStream.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const compressedBlob = new Blob(chunks);
  const arrayBuffer = await compressedBlob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  
  // URL-safe Base64
  const base64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${window.location.origin}/share/${base64}`;
}

export default function AnalysisPage({ params }: PageProps) {
  const router = useRouter();
  const docId = params.docId;

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Current page state for document viewer
  const [currentPage, setCurrentPage] = useState(1);

  // Share modal state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  useEffect(() => {
    if (!docId) return;

    if (docId.startsWith('sample-')) {
      const data = MOCK_SAMPLES[docId];
      if (data) {
        setResults(data);
      } else {
        setError('Sample document not found.');
      }
      setIsLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const storedKey = `lexai-report-${docId}`;
        const stored = sessionStorage.getItem(storedKey);
        
        if (stored) {
          setResults(JSON.parse(stored));
        } else {
          setError('Analysis session not found. Please upload the document again.');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load analysis.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [docId]);

  const handleSelectClause = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleShare = async () => {
    if (!results) return;
    setIsGeneratingShare(true);
    try {
      const link = await generateShareLink(results);
      setShareLink(link);
      setIsShareOpen(true);
    } catch (err) {
      console.error('Failed to generate share link', err);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
    // Rely on Next.js loading.tsx to handle the AI Investigation sequence UI
    return null; 
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-[#090B0F] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="p-4 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2 max-w-sm">
          <h2 className="font-black text-[#F8FAFC] text-xl">Analysis Unavailable</h2>
          <p className="text-sm text-[#A8B3C7] leading-relaxed">
            {error || 'The session has expired. Since LexAI stores no data, you must re-upload the document.'}
          </p>
        </div>
        <Button onClick={() => router.push('/')} variant="gold" className="mt-2">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B0F] text-[#F8FAFC] flex flex-col pt-[72px]">
      {/* Header controls bar */}
      <header className="fixed top-0 left-0 w-full z-40 border-b border-[rgba(255,255,255,0.06)] bg-[#090B0F]/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="text-[#667085] hover:text-[#F8FAFC] p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors border border-transparent hover:border-[rgba(255,255,255,0.08)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col text-left">
              <h1 className="font-bold text-[#F8FAFC] text-[15px] leading-tight flex items-center gap-2">
                {results.document.fileName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-[0.15em] font-label flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Analyzed
                </span>
                <span className="text-[10px] text-[#667085] font-semibold uppercase tracking-wider flex items-center gap-1 ml-2">
                  <Shield className="w-3 h-3 text-[#D4AF37]" /> Zero Data Retention
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleShare}
              isLoading={isGeneratingShare}
              className="font-semibold text-xs"
            >
              <Share2 className="w-4 h-4 mr-2" /> Share Report
            </Button>
            
            <Button 
              size="sm" 
              variant="gold"
              onClick={() => router.push('/')}
              className="font-bold text-xs shadow-none"
            >
              New Scan
            </Button>
          </div>
        </div>
      </header>

      {/* Main split viewport layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1400px] mx-auto w-full px-6 py-6 overflow-hidden">
        
        {/* Left pane: Contract document text or PDF */}
        <div className="lg:col-span-6 h-full flex flex-col min-h-[600px]">
          {docId.startsWith('sample-') || !results.document.blobUrl ? (
            <Card variant="command" className="flex-1 flex flex-col p-6 text-left" padding="none">
              <div className="border-b border-[rgba(255,255,255,0.06)] pb-4 mb-4 flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4AF37] font-label">
                  Document Draft
                </span>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-xs text-[#A8B3C7] leading-relaxed bg-[#090B0F] border border-[rgba(255,255,255,0.04)] rounded-xl p-6 select-none font-feature-settings:normal">
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
        <div className="lg:col-span-6 h-full flex flex-col min-h-[600px]">
          <AnalysisPanel 
            results={results} 
            onSelectClause={handleSelectClause}
          />
        </div>
      </main>

      {/* Legal Copilot Chatbot */}
      <ChatInterface 
        docId={docId} 
        clauses={results.clauses} 
        docType={results.document.docType} 
      />

      {/* Share Modal */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Intelligence Report"
      >
        <div className="flex flex-col gap-5">
          <div className="flex gap-4 items-start p-4 rounded-xl bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.15)] text-[#10B981]">
            <Shield className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-sm text-[#F8FAFC]">Stateless Link Generated</h4>
              <p className="text-xs text-[#A8B3C7] leading-relaxed">
                Because LexAI has no database, this URL contains the <strong>entire compressed analysis payload</strong>. Anyone with this link can view the report in read-only mode instantly.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#667085] uppercase tracking-wider font-label">Shareable URL</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#090B0F] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-xs text-[#A8B3C7] truncate font-mono select-all">
                {shareLink}
              </div>
              <Button onClick={handleCopyLink} variant={isCopied ? 'secondary' : 'gold'}>
                {isCopied ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Link2 className="w-4 h-4" />}
                <span className="ml-2">{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
