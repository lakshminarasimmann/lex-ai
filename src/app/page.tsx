import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import SampleDocs from '@/components/landing/SampleDocs';
import SocialProof from '@/components/landing/SocialProof';
import Footer from '@/components/landing/Footer';
import PageTransition from '@/components/animations/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-[#090B0F] text-[#F8FAFC] overflow-x-hidden font-sans selection:bg-[rgba(212,175,55,0.25)] selection:text-white">
        {/* Navigation header */}
        <header className="fixed top-0 left-0 w-full z-50 border-b border-[rgba(255,255,255,0.06)] bg-[#090B0F]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.3)]">
                <img src="/logo.png" alt="LexAI Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-[#F8FAFC] tracking-wider text-lg font-display">LexAI</span>
            </div>

            <div className="hidden sm:flex items-center gap-8 text-sm text-[#A8B3C7] font-medium">
              <a href="#features" className="hover:text-[#F8FAFC] transition-colors duration-200">Features</a>
              <a href="#samples" className="hover:text-[#F8FAFC] transition-colors duration-200">Sandbox</a>
              <a href="#about" className="hover:text-[#F8FAFC] transition-colors duration-200">About</a>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5 text-[10px] text-[#667085] font-semibold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>ZERO DATA RETENTION</span>
              </div>
              <a 
                href="#upload" 
                className="inline-flex items-center justify-center rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-bold text-[#090B0F] shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:bg-[#E0C04A] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div id="upload" className="pt-16">
          <Hero />
        </div>

        {/* Feature Grid */}
        <div id="features">
          <Features />
        </div>

        {/* Sample contracts */}
        <div id="samples">
          <SampleDocs />
        </div>

        {/* Social metrics & proof */}
        <div id="about">
          <SocialProof />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </PageTransition>
  );
}
