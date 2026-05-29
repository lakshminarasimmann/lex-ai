'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Children, type ReactNode } from 'react';

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export default function StaggerChildren({
  children,
  staggerDelay = 0.06,
  className,
}: StaggerChildrenProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        exit="hidden"
        variants={{
          visible: {
            transition: {
              staggerChildren: staggerDelay,
            },
          },
          hidden: {},
        }}
        className={className}
      >
        {Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.98 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.35,
                  ease: [0.25, 0.4, 0.25, 1],
                },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
