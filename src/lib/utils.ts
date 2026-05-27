import { DOC_TYPE_LABELS, DOC_TYPE_ICONS, RISK_LEVEL_COLORS } from './constants';
import type { DocumentType, RiskLevel } from './types';

/**
 * Merge class names conditionally.
 * A lightweight alternative to clsx/tailwind-merge.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Format an ISO date string to a localized readable format.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get the color hex for a given risk level.
 */
export function getRiskColor(level: RiskLevel): string {
  return RISK_LEVEL_COLORS[level] ?? '#94a3b8';
}

/**
 * Get the Tailwind background + text classes for a risk level.
 */
export function getRiskBgColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: 'bg-emerald-500/10 text-emerald-400',
    medium: 'bg-amber-500/10 text-amber-400',
    high: 'bg-orange-500/10 text-orange-400',
    critical: 'bg-red-500/10 text-red-400',
  };
  return map[level] ?? 'bg-slate-500/10 text-slate-400';
}

/**
 * Truncate text to a maximum length, appending "…".
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Get the human-readable label for a document type.
 */
export function getDocTypeLabel(docType: DocumentType): string {
  return DOC_TYPE_LABELS[docType] ?? docType;
}

/**
 * Get the lucide icon name for a document type.
 */
export function getDocTypeIcon(docType: DocumentType): string {
  return DOC_TYPE_ICONS[docType] ?? 'FileText';
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a random ID for temporary use.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Delay for a given number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copy text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Score to label mapping.
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Low Risk';
  if (score >= 60) return 'Moderate Risk';
  if (score >= 40) return 'High Risk';
  return 'Critical Risk';
}

/**
 * Score to color mapping.
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}
