import React from 'react';
import { Shield, Lock, Eye, Server } from 'lucide-react';
import Card from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';

export default function SocialProof() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[rgba(59,130,246,0.02)] blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
            <div className="flex flex-col gap-6">
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#D4AF37] bg-[rgba(212,175,55,0.06)] px-3 py-1.5 rounded-full w-fit border border-[rgba(212,175,55,0.15)] font-label">
                The Problem
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F8FAFC] leading-tight">
                Over <span className="gradient-text">200 Million people</span> sign contracts they don't understand.
              </h2>
              <p className="text-lg text-[#A8B3C7] leading-relaxed">
                Legal agreements are intentionally written in complex legalese to protect large corporations. 
                LexAI levels the playing field — translating confusing terms, revealing hidden risks, and empowering you with a professional negotiation strategy.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="border-l-2 border-[#D4AF37] pl-4 py-1">
                  <div className="text-3xl font-black text-[#F8FAFC] font-display">90%</div>
                  <div className="text-sm text-[#A8B3C7] mt-1">Don't read contracts fully</div>
                </div>
                <div className="border-l-2 border-[#EF4444] pl-4 py-1">
                  <div className="text-3xl font-black text-[#F8FAFC] font-display">45%</div>
                  <div className="text-sm text-[#A8B3C7] mt-1">Regret signing terms later</div>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn direction="right" delay={0.2}>
            <div className="flex flex-col gap-5">
              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-6 flex flex-col gap-3 border-[rgba(255,255,255,0.06)] bg-[#11151C]">
                  <div className="text-3xl font-black text-[#D4AF37] font-display">98.4%</div>
                  <h3 className="font-bold text-[#F8FAFC] text-sm">AI Classification Precision</h3>
                  <p className="text-xs text-[#A8B3C7] leading-relaxed">
                    Evaluated using Legal-BERT embeddings on CUAD benchmarks.
                  </p>
                </Card>
                
                <Card className="p-6 flex flex-col gap-3 border-[rgba(255,255,255,0.06)] bg-[#11151C]">
                  <div className="text-3xl font-black text-[#10B981] font-display">&lt; 30s</div>
                  <h3 className="font-bold text-[#F8FAFC] text-sm">Instant Ingestion</h3>
                  <p className="text-xs text-[#A8B3C7] leading-relaxed">
                    Serverless extraction structures legal clauses in seconds.
                  </p>
                </Card>
              </div>

              {/* Testimonial */}
              <Card className="p-6 flex flex-col gap-4 border-[rgba(255,255,255,0.06)] bg-[#11151C]">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] border-2 border-[#090B0F] flex items-center justify-center text-xs font-bold text-[#090B0F]">JD</div>
                    <div className="w-8 h-8 rounded-full bg-[#10B981] border-2 border-[#090B0F] flex items-center justify-center text-xs font-bold text-[#090B0F]">AM</div>
                    <div className="w-8 h-8 rounded-full bg-[#3B82F6] border-2 border-[#090B0F] flex items-center justify-center text-xs font-bold text-white">SK</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#F8FAFC] text-sm">Trusted by Freelancers & Renters</h3>
                    <p className="text-xs text-[#667085]">Real people avoiding legal traps every single day.</p>
                  </div>
                </div>
                <p className="text-sm text-[#A8B3C7] italic leading-relaxed">
                  "As a freelancer, hiring lawyers is too expensive. LexAI caught a critical intellectual property clause in a client contract that would have stripped me of my source code. Saved my business."
                </p>
              </Card>

              {/* Security Trust Section */}
              <Card className="p-5 border-[rgba(16,185,129,0.12)] bg-[rgba(16,185,129,0.03)]">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-[#10B981]" />
                  <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">Privacy & Security</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Eye, text: 'Zero Data Retention' },
                    { icon: Lock, text: 'Browser-Owned Reports' },
                    { icon: Server, text: 'Stateless Sharing' },
                    { icon: Shield, text: 'Secure Processing' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-[#A8B3C7] font-medium">
                      <item.icon className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
