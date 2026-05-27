'use client';

import { useState, useEffect } from 'react';
import { AnalysisResults } from '@/lib/types';
import { MOCK_SAMPLES } from '@/lib/mockData';

export function useAnalysis(docId: string) {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) return;

    setIsLoading(true);
    setError(null);

    // Support trial sandboxes instantly
    if (docId.startsWith('sample-')) {
      const data = MOCK_SAMPLES[docId];
      if (data) {
        setResults(data);
      } else {
        setError('Sandbox sample data not found.');
      }
      setIsLoading(false);
      return;
    }

    // Retrieve from client's sessionStorage
    try {
      const cached = sessionStorage.getItem(`lexai-report-${docId}`);
      if (cached) {
        const parsed = JSON.parse(cached) as AnalysisResults;
        setResults(parsed);
      } else {
        setError('Document report not found in memory. Please upload your contract again.');
      }
    } catch (err: any) {
      setError('Failed to load contract report details.');
    } finally {
      setIsLoading(false);
    }
  }, [docId]);

  return {
    document: results?.document || null,
    clauses: results?.clauses || [],
    analysis: results?.analysis || null,
    results,
    isLoading,
    error,
  };
}
