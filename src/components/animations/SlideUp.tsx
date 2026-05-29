'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  className?: string;
}

export default function SlideUp({
  children,
  delay = 0,
  className,
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
