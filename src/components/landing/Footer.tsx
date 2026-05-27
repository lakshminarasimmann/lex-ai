import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(255,255,255,0.06)] bg-[#050510] py-12 px-6 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[var(--text-secondary)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-glow-primary">
            <span className="font-bold text-white text-base">L</span>
          </div>
          <span className="font-bold text-white tracking-wide text-lg">LexAI</span>
        </div>
        
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} LexAI. Built for tenants, freelancers, and small businesses. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
            GitHub
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-6 text-center text-xs text-[var(--text-muted)]">
        Disclaimer: LexAI is an AI-powered legal analysis tool. It does not constitute professional legal advice. Always consult a qualified attorney for legal matters.
      </div>
    </footer>
  );
}
