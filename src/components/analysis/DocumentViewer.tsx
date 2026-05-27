'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
  url: string;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export default function DocumentViewer({ url, currentPage, onPageChange }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (numPages && currentPage < numPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 0.15, 2.0));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 0.15, 0.6));
  };

  return (
    <Card className="flex flex-col h-full border-[rgba(255,255,255,0.06)] bg-[#0c0c16]/50 backdrop-blur-md overflow-hidden">
      {/* Control Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[rgba(255,255,255,0.06)] bg-black/30">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.03] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-300">
            Page {currentPage} of {numPages || '--'}
          </span>
          <button
            onClick={handleNextPage}
            disabled={numPages ? currentPage >= numPages : true}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.03] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & Extras */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.03] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-300">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.03] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="flex-1 overflow-auto p-6 bg-black/20 flex justify-center items-start min-h-[500px]">
        {url ? (
          <div className="shadow-2xl rounded-lg overflow-hidden transition-all duration-300 transform scale-[var(--zoom)] origin-top">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex flex-col items-center gap-3 p-12 text-[var(--text-secondary)]">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <span className="text-sm font-medium">Loading document viewer...</span>
                </div>
              }
              error={
                <div className="p-8 text-center text-xs text-red-400">
                  Failed to load PDF. Highlighting features and offline scrolling are still active.
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={zoom}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="transition-all duration-200"
              />
            </Document>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[var(--text-muted)]">
            No document URL specified.
          </div>
        )}
      </div>
    </Card>
  );
}
