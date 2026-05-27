import type { Metadata } from 'next';
import { inter, spaceGrotesk, jetbrainsMono } from '@/styles/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'LexAI — Legal Document Intelligence & Risk Analysis',
  description: 'Upload any contract or PDF agreement to get an instant, plain-English analysis of risk flags, missing clauses, and a full negotiation playbook.',
  openGraph: {
    title: 'LexAI — Legal Document Intelligence',
    description: 'Instant risk analysis and plain-English guides for agreements.',
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
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans bg-[#06060c] text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
