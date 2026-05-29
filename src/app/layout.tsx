import type { Metadata } from 'next';
import { inter, spaceGrotesk, ibmPlexSans, ibmPlexMono } from '@/styles/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'LexAI — AI-Powered Legal Intelligence & Contract Risk Analysis',
  description: 'Enterprise-grade contract intelligence platform. Upload any agreement to get instant risk analysis, clause extraction, negotiation playbooks, and AI-powered legal insights — without storing a single document.',
  openGraph: {
    title: 'LexAI — AI Legal Intelligence Platform',
    description: 'Contract risk analysis, clause extraction, and negotiation intelligence powered by AI.',
    type: 'website',
    locale: 'en_US',
    siteName: 'LexAI',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased font-sans bg-[#090B0F] text-[#F8FAFC]`}
      >
        {children}
      </body>
    </html>
  );
}
