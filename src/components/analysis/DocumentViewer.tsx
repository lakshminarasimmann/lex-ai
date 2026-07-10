'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';

// Set up PDF.js worker from local public directory to avoid CORS/CDN issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
    <Card 
      variant="command" 
      className="flex flex-col h-full overflow-hidden border-[rgba(255,255,255,0.06)]"
      padding="none"
    >
      {/* Control Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#090B0F]">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#A8B3C7] hover:text-[#F8FAFC] hover:bg-[#1A202B] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-[#F8FAFC] font-label tracking-wider">
            Page {currentPage} of {numPages || '--'}
          </span>
          <button
            onClick={handleNextPage}
            disabled={numPages ? currentPage >= numPages : true}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#A8B3C7] hover:text-[#F8FAFC] hover:bg-[#1A202B] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#A8B3C7] hover:text-[#F8FAFC] hover:bg-[#1A202B] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-[#F8FAFC] font-label w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#A8B3C7] hover:text-[#F8FAFC] hover:bg-[#1A202B] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="flex-1 overflow-auto p-6 bg-[#090B0F] flex justify-center items-start min-h-[500px]">
        {url ? (
          <div className="shadow-2xl rounded-lg overflow-hidden transition-all duration-300 transform scale-[var(--zoom)] origin-top">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex flex-col items-center gap-3 p-12 text-[#A8B3C7]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                  <span className="text-sm font-medium">Rendering document...</span>
                </div>
              }
              error={
                <div className="p-8 text-center text-xs text-[#EF4444] bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/20">
                  Failed to load PDF. Document preview unavailable.
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={zoom}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="transition-all duration-200 shadow-xl"
              />
            </Document>
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-[#667085] flex flex-col items-center gap-3">
            <FileText className="w-8 h-8 text-[#1A202B]" />
            No document URL specified.
          </div>
        )}
      </div>
    </Card>
  );
}
