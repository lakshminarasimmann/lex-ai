import type { DocumentType, RiskLevel, SampleDocument } from './types';

// ============================================
// Document Type Mappings
// ============================================

export const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  rental_agreement: 'Rental Agreement',
  employment_contract: 'Employment Contract',
  loan_agreement: 'Loan Agreement',
  nda: 'Non-Disclosure Agreement',
  service_agreement: 'Service Agreement',
  insurance_policy: 'Insurance Policy',
  partnership_deed: 'Partnership Deed',
};

export const DOC_TYPE_COLORS: Record<DocumentType, string> = {
  rental_agreement: 'from-blue-500 to-cyan-500',
  employment_contract: 'from-purple-500 to-pink-500',
  loan_agreement: 'from-amber-500 to-orange-500',
  nda: 'from-emerald-500 to-teal-500',
  service_agreement: 'from-indigo-500 to-violet-500',
  insurance_policy: 'from-rose-500 to-red-500',
  partnership_deed: 'from-sky-500 to-blue-500',
};

export const DOC_TYPE_ICONS: Record<DocumentType, string> = {
  rental_agreement: 'Home',
  employment_contract: 'Briefcase',
  loan_agreement: 'Banknote',
  nda: 'Lock',
  service_agreement: 'FileText',
  insurance_policy: 'Shield',
  partnership_deed: 'Handshake',
};

// ============================================
// Risk Level Mappings
// ============================================

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

export const RISK_LEVEL_BG_COLORS: Record<RiskLevel, string> = {
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical Risk',
};

// ============================================
// File Upload Constraints
// ============================================

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = ['application/pdf'];

// ============================================
// Sample Documents
// ============================================

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    name: 'Rental Agreement',
    type: 'rental_agreement',
    description:
      'A standard residential rental agreement with common clauses including rent, security deposit, maintenance, and termination terms.',
    fileName: 'sample_rental_agreement.pdf',
  },
  {
    name: 'Employment Contract',
    type: 'employment_contract',
    description:
      'A typical employment contract covering salary, benefits, non-compete, intellectual property, and termination provisions.',
    fileName: 'sample_employment_contract.pdf',
  },
  {
    name: 'Non-Disclosure Agreement',
    type: 'nda',
    description:
      'A mutual NDA with confidentiality obligations, exclusions, term, and remedies for breach of agreement.',
    fileName: 'sample_nda.pdf',
  },
];

// ============================================
// Analysis Stages
// ============================================

export const ANALYSIS_STAGES: Record<string, { label: string; progress: number }> = {
  uploading: { label: 'Uploading document...', progress: 10 },
  parsing: { label: 'Parsing document structure...', progress: 25 },
  extracting: { label: 'Extracting clauses...', progress: 40 },
  classifying: { label: 'Classifying clause types...', progress: 55 },
  analyzing: { label: 'Analyzing risk levels...', progress: 70 },
  generating: { label: 'Generating insights...', progress: 85 },
  completing: { label: 'Finalizing report...', progress: 95 },
  completed: { label: 'Analysis complete!', progress: 100 },
};

// ============================================
// Chat Constants
// ============================================

export const CHAT_SUGGESTIONS = [
  'What are the key risks in this contract?',
  'Explain the termination clause',
  'What clauses are missing?',
  'Summarize in simple language',
  'What should I negotiate?',
];
