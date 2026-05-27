'use client';

import { useState } from 'react';
import { uploadDocument } from '@/lib/api';
import { AnalysisResults } from '@/lib/types';

export function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResults | null>(null);

  const upload = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setProgress(10);
    setError(null);
    setResult(null);

    // Simulate progress bars
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 400);

    try {
      const data = await uploadDocument(selectedFile);
      clearInterval(progressInterval);
      setProgress(100);
      
      // Store complete report JSON in client's sessionStorage
      if (data && data.document && data.document.id) {
        sessionStorage.setItem(`lexai-report-${data.document.id}`, JSON.stringify(data));
      }
      
      setResult(data);
      setIsUploading(false);
      return data;
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setProgress(0);
      const errMsg = err?.message || 'Failed to analyze document. Make sure your API keys are configured correctly.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const reset = () => {
    setFile(null);
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setResult(null);
  };

  return {
    file,
    isUploading,
    progress,
    error,
    result,
    upload,
    reset,
  };
}
