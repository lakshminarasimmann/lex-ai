'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ArrowRight, CheckCircle2, AlertCircle, GitCompare, Shield } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';

interface CompareUploadProps {
  onUpload: (files: { file1: File; file2: File }) => void;
  isLoading?: boolean;
}

export default function CompareUpload({ onUpload, isLoading = false }: CompareUploadProps) {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2 | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSlotClick = (slot: 1 | 2) => {
    if (isLoading) return;
    setActiveSlot(slot);
    inputRef.current?.click();
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) return 'Only PDF files are supported';
    if (file.size > MAX_FILE_SIZE) return `File must be under ${formatFileSize(MAX_FILE_SIZE)}`;
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlot) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    if (activeSlot === 1) setFile1(file);
    if (activeSlot === 2) setFile2(file);
    setActiveSlot(null);
    e.target.value = ''; // Reset input
  };

  const handleCompare = () => {
    if (file1 && file2) {
      onUpload({ file1, file2 });
    }
  };

  const FileSlot = ({ num, file }: { num: 1 | 2; file: File | null }) => {
    return (
      <div 
        onClick={() => handleSlotClick(num)}
        className={cn(
          'relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer h-[240px]',
          file 
            ? 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.05)] shadow-[0_0_20px_rgba(16,185,129,0.1)]'
            : 'border-[rgba(255,255,255,0.08)] bg-[#11151C] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#1A202B]',
          isLoading && 'pointer-events-none opacity-50'
        )}
      >
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="filled"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#F8FAFC] line-clamp-1 break-all">{file.name}</p>
                <p className="text-xs text-[#A8B3C7] mt-1">{formatFileSize(file.size)}</p>
              </div>
              <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-[0.15em] bg-[rgba(16,185,129,0.1)] px-2 py-1 rounded">
                Version {num} Ready
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-[#1A202B] border border-[rgba(255,255,255,0.06)] flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#667085]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F8FAFC]">Upload Version {num}</p>
                <p className="text-xs text-[#A8B3C7] mt-1">Select PDF document</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="sr-only"
        aria-hidden="true"
      />

      <div className="text-center flex flex-col gap-3">
        <h2 className="text-2xl font-black text-[#F8FAFC]">Version Intelligence Viewer</h2>
        <p className="text-sm text-[#A8B3C7]">
          Upload original and revised agreements to instantly analyze semantic changes, risk implications, and structural modifications.
        </p>
        <div className="flex justify-center items-center gap-1.5 text-[10px] text-[#667085] mt-2">
          <Shield className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Zero data retention · Browser-owned processing</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <FileSlot num={1} file={file1} />
        
        <div className="flex justify-center md:rotate-0 rotate-90 my-2 md:my-0">
          <div className="w-12 h-12 rounded-full bg-[#1A202B] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-[#667085]" />
          </div>
        </div>
        
        <FileSlot num={2} file={file2} />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl flex items-center justify-center gap-2 text-sm text-[#EF4444]"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center">
        <motion.button
          whileHover={file1 && file2 && !isLoading ? { scale: 1.02, y: -1 } : undefined}
          whileTap={file1 && file2 && !isLoading ? { scale: 0.98 } : undefined}
          disabled={!file1 || !file2 || isLoading}
          onClick={handleCompare}
          className={cn(
            'flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-200',
            file1 && file2
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B0F] shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]'
              : 'bg-[#1A202B] text-[#667085] cursor-not-allowed border border-[rgba(255,255,255,0.04)]',
            isLoading && 'opacity-80 cursor-wait'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Diff...
            </>
          ) : (
            <>
              <GitCompare className="w-5 h-5" />
              Compare Versions
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
