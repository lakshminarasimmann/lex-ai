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
      <div className="relative min-h-screen bg-[#06060c] text-slate-100 overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
        {/* Dynamic header / navigation */}
        <header className="fixed top-0 left-0 w-full z-50 border-b border-[rgba(255,255,255,0.04)] bg-[#06060c]/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-glow-primary">
                <span className="font-bold text-white text-base">L</span>
              </div>
              <span className="font-bold text-white tracking-wider text-lg">LexAI</span>
            </div>

            <div className="hidden sm:flex items-center gap-8 text-sm text-[var(--text-secondary)] font-medium">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#samples" className="hover:text-white transition-colors">Sandbox</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
            </div>

            <div>
              <a 
                href="#upload" 
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 hover:shadow-glow-primary transition-all duration-200"
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
