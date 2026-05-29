'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Briefcase, Lock, Scale } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';

const SAMPLES = [
  {
    type: 'rental_agreement',
    icon: FileText,
    title: 'Residential Lease Agreement',
    desc: 'A standard tenant agreement featuring common traps around security deposits and maintenance costs.',
    accentColor: '#3B82F6',
    docId: 'sample-rental'
  },
  {
    type: 'employment_contract',
    icon: Briefcase,
    title: 'Software Engineer Contract',
    desc: 'An employment contract containing high-risk IP assignment clauses, notice periods, and non-competes.',
    accentColor: '#7C3AED',
    docId: 'sample-employment'
  },
  {
    type: 'nda',
    icon: Lock,
    title: 'Non-Disclosure Agreement',
    desc: 'A mutual NDA with extremely strict intellectual property definitions and perpetual confidentiality terms.',
    accentColor: '#10B981',
    docId: 'sample-nda'
  }
];

export default function SampleDocs() {
  const router = useRouter();

  const handleAnalyze = (docId: string) => {
    router.push(`/analyze/${docId}`);
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[rgba(212,175,55,0.02)] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#D4AF37] font-label">
            Intelligence Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F8FAFC]">
            Try LexAI in 1-Click.
          </h2>
          <p className="text-lg text-[#A8B3C7] leading-relaxed">
            No document on hand? Explore our pre-analyzed legal corpuses to see the full depth of risk scoring and plain-English guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLES.map((sample, idx) => {
            const Icon = sample.icon;
            return (
              <FadeIn key={idx} direction="up" delay={idx * 0.08}>
                <Card 
                  hoverable
                  className="p-7 border-[rgba(255,255,255,0.06)] bg-[#11151C] flex flex-col gap-6 h-full justify-between group"
                >
                  <div className="flex flex-col gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.06)]"
                      style={{ background: `${sample.accentColor}10` }}
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" style={{ color: sample.accentColor }} />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-bold text-[#F8FAFC] tracking-wide">{sample.title}</h3>
                      <p className="text-sm text-[#A8B3C7] leading-relaxed">
                        {sample.desc}
                      </p>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.04)] text-[#F8FAFC] font-medium flex items-center justify-center gap-2 group/btn"
                    onClick={() => handleAnalyze(sample.docId)}
                  >
                    <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Analyze Sample</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </Button>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
