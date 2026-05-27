'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Briefcase, FileCode } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';

const SAMPLES = [
  {
    type: 'rental_agreement',
    icon: FileText,
    title: 'Residential Lease Agreement',
    desc: 'A standard tenant agreement featuring common traps around security deposits and maintenance costs.',
    color: 'from-blue-600 to-indigo-600',
    fileUrl: '/samples/rental_sample.pdf',
    docId: 'sample-rental'
  },
  {
    type: 'employment_contract',
    icon: Briefcase,
    title: 'Software Engineer Contract',
    desc: 'An employment contract containing high-risk IP assignment clauses, notice periods, and non-competes.',
    color: 'from-indigo-600 to-violet-600',
    fileUrl: '/samples/employment_sample.pdf',
    docId: 'sample-employment'
  },
  {
    type: 'nda',
    icon: FileCode,
    title: 'Non-Disclosure Agreement',
    desc: 'A mutual NDA with extremely strict intellectual property definitions and perpetual confidentiality terms.',
    color: 'from-cyan-600 to-blue-600',
    fileUrl: '/samples/nda_sample.pdf',
    docId: 'sample-nda'
  }
];

export default function SampleDocs() {
  const router = useRouter();

  const handleAnalyze = (docId: string) => {
    // Redirect to pre-seeded analysis page
    router.push(`/analyze/${docId}`);
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <span className="text-sm font-semibold tracking-wider uppercase text-cyan-400">
            Instant Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Try LexAI in 1-Click.
          </h2>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            No document on hand? Explore our pre-analyzed legal corpuses to see the full depth of risk scoring and plain-English guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SAMPLES.map((sample, idx) => {
            const Icon = sample.icon;
            return (
              <FadeIn key={idx} direction="up" delay={idx * 0.1}>
                <Card 
                  hoverable
                  className="p-8 border border-[rgba(255,255,255,0.06)] bg-white/[0.01] flex flex-col gap-6 h-full justify-between group"
                >
                  <div className="flex flex-col gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${sample.color} flex items-center justify-center text-white`}>
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-white tracking-wide">{sample.title}</h3>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        {sample.desc}
                      </p>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-white font-medium flex items-center justify-center gap-2 group/btn"
                    onClick={() => handleAnalyze(sample.docId)}
                  >
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
