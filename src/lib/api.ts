import type {
  AnalysisResults,
  ChatMessage,
  CompareResult,
  TranslateResponse,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// ============================================
// Helpers
// ============================================

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.error || body.message || message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

function apiUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

// ============================================
// In-flight Upload & Analysis Ingestion
// ============================================

export async function uploadDocument(file: File): Promise<AnalysisResults> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(apiUrl('/api/parse-document'), {
    method: 'POST',
    body: formData,
  });

  return handleResponse<AnalysisResults>(response);
}

// ============================================
// Interactive Chat Q&A (In-flight RAG)
// ============================================

export async function sendChatMessage(
  docId: string,
  message: string,
  history: ChatMessage[],
  clauses: any[],
  docType = 'agreement'
): Promise<{ reply: string }> {
  const response = await fetch(apiUrl('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      clauses,
      doc_type: docType,
    }),
  });
  return handleResponse<{ reply: string }>(response);
}

// ============================================
// Side-by-Side In-flight Compare
// ============================================

export async function compareDocuments(
  clauses1: any[],
  clauses2: any[]
): Promise<CompareResult> {
  const response = await fetch(apiUrl('/api/compare'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clauses_1: clauses1, clauses_2: clauses2 }),
  });
  return handleResponse<CompareResult>(response);
}

// ============================================
// Indian Language Translation
// ============================================

export async function translateText(
  text: string,
  targetLang: string
): Promise<TranslateResponse> {
  const response = await fetch(apiUrl('/api/translate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, target_lang: targetLang }),
  });
  const data = await handleResponse<any>(response);
  return {
    translatedText: data.translated_text || data.translatedText,
    sourceLang: data.source_lang || data.sourceLang,
    targetLang: data.target_lang || data.targetLang,
  };
}
