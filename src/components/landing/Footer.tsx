import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(255,255,255,0.04)] bg-[#090B0F] py-12 px-6 overflow-hidden">
      {/* Gold gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.3)] to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#A8B3C7]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="3" x2="12" y2="21" />
              <path d="M2 12h8M14 12h8" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="font-bold text-[#F8FAFC] tracking-wide text-lg font-display">LexAI</span>
        </div>
        
        <p className="text-center md:text-left text-[#667085] text-xs">
          &copy; {new Date().getFullYear()} LexAI. Built for tenants, freelancers, and small businesses. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6 text-xs">
          <Link href="/privacy" className="hover:text-[#F8FAFC] transition-colors duration-200">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#F8FAFC] transition-colors duration-200">Terms of Service</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC] transition-colors duration-200">
            GitHub
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          {['Zero Data Retention', 'Stateless Architecture', 'Browser-Owned'].map((badge, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[9px] text-[#667085] font-semibold uppercase tracking-wider">
              <Shield className="w-3 h-3 text-[#10B981]" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-[#667085] max-w-2xl leading-relaxed">
          Disclaimer: LexAI is an AI-powered legal analysis tool. It does not constitute professional legal advice. Always consult a qualified attorney for legal matters.
        </p>
      </div>
    </footer>
  );
}
