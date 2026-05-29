'use client';

import React from 'react';
import { Shield, MessageSquare, AlertTriangle, FileText, GitCompare, Globe } from 'lucide-react';
import Card from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';

const FEATURES = [
  {
    icon: Shield,
    title: 'AI Risk Shield',
    description: 'Instantly highlights disadvantageous or dangerous terms categorized from Low to Critical risk levels.',
    accentColor: '#EF4444',
  },
  {
    icon: MessageSquare,
    title: 'Plain-English Translator',
    description: 'Deciphers complex, highly confusing legalese into clear explanations that anyone can understand.',
    accentColor: '#3B82F6',
  },
  {
    icon: AlertTriangle,
    title: 'Missing Clause Detection',
    description: 'Scans your agreement against industry standards to warn you about what the other party left out.',
    accentColor: '#F59E0B',
  },
  {
    icon: FileText,
    title: 'Negotiation Playbook',
    description: 'Generates specific dos and don\'ts, market metrics, and exact counter-clauses to push back with.',
    accentColor: '#D4AF37',
  },
  {
    icon: GitCompare,
    title: 'Contract Diff-Checker',
    description: 'Upload two versions of a contract to immediately see what was added, removed, or subtly edited.',
    accentColor: '#7C3AED',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Translate legal analyses instantly into Hindi, Tamil, or Telugu to review in your preferred language.',
    accentColor: '#10B981',
  },
];

export default function Features() {
  return (
    <section className="relative py-24 px-6 border-y border-[rgba(255,255,255,0.04)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#D4AF37] font-label">
            Enterprise Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F8FAFC]">
            Complete Legal Document Intelligence.
          </h2>
          <p className="text-lg text-[#A8B3C7] leading-relaxed">
            LexAI replaces expensive legal consultations with premium, instant AI reviews built on advanced ML architectures.
          </p>
        </div>

        <StaggerChildren>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <FadeIn key={idx} direction="up" delay={idx * 0.04}>
                  <Card 
                    hoverable 
                    className="p-7 flex flex-col gap-5 h-full border-[rgba(255,255,255,0.06)] bg-[#11151C] group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center border border-[rgba(255,255,255,0.06)]"
                      style={{ background: `${feat.accentColor}10` }}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" style={{ color: feat.accentColor }} />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-bold text-[#F8FAFC] tracking-wide">{feat.title}</h3>
                      <p className="text-sm text-[#A8B3C7] leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </StaggerChildren>
      </div>
    </section>
  );
}
