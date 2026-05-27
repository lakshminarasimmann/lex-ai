'use client';

import React from 'react';
import { 
  Shield, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  GitCompare, 
  Globe 
} from 'lucide-react';
import Card from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';

const FEATURES = [
  {
    icon: Shield,
    title: 'AI Risk Shield',
    description: 'Instantly highlights disadvantageous or dangerous terms categorized from Low to Critical risk levels.',
    gradient: 'from-indigo-600 to-violet-600',
  },
  {
    icon: MessageSquare,
    title: 'Plain-English Translator',
    description: 'Deciphers complex, highly confusing legalese into clear explanations that anyone can understand.',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    icon: AlertTriangle,
    title: 'Missing Clause Detection',
    description: 'Scans your agreement against industry standards to warn you about what the other party left out.',
    gradient: 'from-amber-600 to-orange-600',
  },
  {
    icon: FileText,
    title: 'Negotiation Playbook',
    description: 'Generates specific dos and don\'ts, market metrics, and exact counter-clauses to push back with.',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    icon: GitCompare,
    title: 'Contract Diff-Checker',
    description: 'Upload two versions of a contract to immediately see what was added, removed, or subtly edited.',
    gradient: 'from-pink-600 to-rose-600',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Translate legal analyses instantly into Hindi, Tamil, or Telugu to review in your preferred language.',
    gradient: 'from-purple-600 to-indigo-600',
  },
];

export default function Features() {
  return (
    <section className="relative py-24 px-6 border-y border-[rgba(255,255,255,0.04)] bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-indigo-400">
            Enterprise Intelligence
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Complete Legal Document Intelligence.
          </p>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            LexAI replaces expensive legal consultations with premium, instant AI reviews built on advanced ML architectures.
          </p>
        </div>

        <StaggerChildren>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <FadeIn key={idx} direction="up" delay={idx * 0.05}>
                  <Card 
                    hoverable 
                    glowing
                    className="p-8 flex flex-col gap-5 h-full border border-[rgba(255,255,255,0.06)] bg-white/[0.01]"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6 animate-pulse-slow" />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-white tracking-wide">{feat.title}</h3>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
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
