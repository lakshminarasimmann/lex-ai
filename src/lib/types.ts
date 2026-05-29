// ============================================
// LexAI — TypeScript Definitions
// ============================================

export type DocumentType =
  | 'rental_agreement'
  | 'employment_contract'
  | 'loan_agreement'
  | 'nda'
  | 'service_agreement'
  | 'insurance_policy'
  | 'partnership_deed';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  blobUrl: string;
  docType: DocumentType;
  pageCount: number;
  clauseCount: number;
  fileHash: string;
  createdAt: string;
}

export interface Clause {
  id: string;
  documentId: string;
  index: number;
  text: string;
  category: string | null;
  confidence: number | null;
  riskLevel: RiskLevel | null;
  riskScore: number | null;
  riskReason: string | null;
  explanation: string | null;
  counterClause: string | null;
  pageNumber: number | null;
  startOffset: number | null;
  endOffset: number | null;
}

export interface Analysis {
  id: string;
  documentId: string;
  status: AnalysisStatus;
  overallScore: number | null;
  summary: string | null;
  topThingsToKnow: string[] | null;
  missingClauses: MissingClause[] | null;
  negotiationGuide: NegotiationGuide | null;
  stage: string | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface MissingClause {
  id: string;
  name: string;
  whyMatters: string;
  templateClause: string;
  status: 'missing';
}

export interface NegotiationGuide {
  pushBackClauses: PushBackClause[];
  dos: string[];
  donts: string[];
  marketTerms: MarketTerm[];
}

export interface PushBackClause {
  clauseSummary: string;
  suggestedWording: string;
}

export interface MarketTerm {
  metric: string;
  standard: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AnalysisResults {
  document: Document;
  clauses: Clause[];
  analysis: Analysis;
}

export interface UploadResponse {
  doc_id: string;
  doc_type: string;
  doc_type_confidence: number;
  clause_count: number;
  page_count: number;
  file_name: string;
}

export interface CompareResult {
  changes: CompareChange[];
}

export interface CompareChange {
  clause: string;
  changeType: 'added' | 'removed' | 'modified';
  impact: 'better' | 'worse' | 'neutral';
  explanation: string;
}

export interface ShareLinkResponse {
  shareUrl: string;
  token: string;
  expiresAt: string;
}

export interface TranslateResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface SampleDocument {
  name: string;
  type: DocumentType;
  description: string;
  fileName: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}
