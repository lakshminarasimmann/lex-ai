'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, AlertCircle, CheckCircle2, X, Shield, Scale } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  progress?: number;
  className?: string;
  compact?: boolean;
}

export default function FileUpload({
  onUpload,
  isLoading = false,
  progress = 0,
  className,
  compact = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return 'Only PDF files are supported';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be under ${formatFileSize(MAX_FILE_SIZE)}`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      setSelectedFile(file);
      onUpload(file);
    },
    [onUpload, validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  return (
    <div className={cn('w-full', className)}>
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={cn(
          'relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden',
          compact ? 'p-6' : 'p-10',
          isDragOver
            ? 'border-[#D4AF37]/50 bg-[rgba(212,175,55,0.06)] shadow-[0_0_30px_rgba(212,175,55,0.1)]'
            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.02)]',
          isLoading && 'pointer-events-none opacity-80',
          error && 'border-[#EF4444]/30'
        )}
        whileHover={!isLoading ? { scale: 1.005 } : undefined}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF document"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
        />

        {/* Watermark legal shield background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <Shield className="w-32 h-32" />
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              {/* Scanning animation */}
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                  <circle
                    cx="32" cy="32" r="28" fill="none"
                    stroke="url(#intake-gradient)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${progress * 1.76} 176`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="intake-gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#B8860B" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#F8FAFC]">Processing Evidence...</p>
                <p className="text-xs text-[#667085] mt-1">AI intake pipeline active</p>
              </div>
              {selectedFile && (
                <p className="text-xs text-[#667085]">{selectedFile.name}</p>
              )}
            </motion.div>
          ) : selectedFile && !error ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-3 relative z-10"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#F8FAFC]">{selectedFile.name}</p>
                <p className="text-xs text-[#667085] mt-1">{formatFileSize(selectedFile.size)}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#10B981] bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.15)] px-2.5 py-1 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                AI Ready
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="text-xs text-[#667085] hover:text-[#A8B3C7] transition-colors flex items-center gap-1 mt-1"
              >
                <X className="w-3 h-3" /> Choose different file
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              <motion.div
                animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center',
                  isDragOver
                    ? 'bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.25)]'
                    : 'bg-[#171C25] border border-[rgba(255,255,255,0.08)]'
                )}
              >
                {isDragOver ? (
                  <Scale className="w-7 h-7 text-[#D4AF37]" />
                ) : (
                  <FileText className="w-7 h-7 text-[#667085]" />
                )}
              </motion.div>

              <div className="text-center">
                <p className="text-sm font-semibold text-[#F8FAFC]">
                  {isDragOver ? 'Release to analyze' : 'Upload Contract for Analysis'}
                </p>
                <p className="text-xs text-[#667085] mt-1.5">
                  or <span className="text-[#D4AF37] hover:underline cursor-pointer">browse files</span>
                  {' · '}PDF up to {formatFileSize(MAX_FILE_SIZE)}
                </p>
              </div>

              {/* Security indicator */}
              <div className="flex items-center gap-1.5 text-[10px] text-[#667085]">
                <Shield className="w-3 h-3 text-[#10B981]" />
                <span>Zero data retention · Browser-owned processing</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 mt-3 text-sm text-[#EF4444]"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
