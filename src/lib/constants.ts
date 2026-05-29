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
  rental_agreement: 'from-[#3B82F6] to-[#1E40AF]',
  employment_contract: 'from-[#7C3AED] to-[#5B21B6]',
  loan_agreement: 'from-[#D4AF37] to-[#B8860B]',
  nda: 'from-[#10B981] to-[#047857]',
  service_agreement: 'from-[#3B82F6] to-[#7C3AED]',
  insurance_policy: 'from-[#EF4444] to-[#B91C1C]',
  partnership_deed: 'from-[#D4AF37] to-[#92700C]',
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
  low: '#10B981',
  medium: '#F59E0B',
  high: '#f97316',
  critical: '#EF4444',
};

export const RISK_LEVEL_BG_COLORS: Record<RiskLevel, string> = {
  low: 'bg-[rgba(16,185,129,0.1)] text-[#10B981] border-[rgba(16,185,129,0.2)]',
  medium: 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-[rgba(245,158,11,0.2)]',
  high: 'bg-[rgba(249,115,22,0.1)] text-[#f97316] border-[rgba(249,115,22,0.2)]',
  critical: 'bg-[rgba(239,68,68,0.1)] text-[#EF4444] border-[rgba(239,68,68,0.2)]',
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
// Analysis Stages — AI Legal Investigation Sequence
// ============================================

export const ANALYSIS_STAGES: Record<string, { label: string; progress: number }> = {
  uploading: { label: 'Ingesting document into AI pipeline...', progress: 10 },
  parsing: { label: 'Reading document structure...', progress: 20 },
  extracting: { label: 'Identifying contract type...', progress: 35 },
  classifying: { label: 'Extracting legal clauses...', progress: 50 },
  analyzing: { label: 'Evaluating risk levels...', progress: 65 },
  generating: { label: 'Building negotiation strategy...', progress: 80 },
  completing: { label: 'Compiling intelligence report...', progress: 95 },
  completed: { label: 'Analysis complete', progress: 100 },
};

// ============================================
// Chat Constants
// ============================================

export const CHAT_SUGGESTIONS = [
  'What are the critical risk factors?',
  'Explain the termination clause in plain English',
  'Which clauses are missing from this agreement?',
  'What should I negotiate before signing?',
  'Are there any liability concerns?',
];
