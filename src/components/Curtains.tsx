'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface CurtainsProps {
  active: boolean;
  stripCount?: number;
  color?: string;
  onRevealed?: () => void;
}

export default function Curtains({
  active,
  stripCount = 8,
  color = 'bg-ink',
  onRevealed,
}: CurtainsProps) {
  const prefersReducedMotion = useReducedMotion();
  const strips = Array.from({ length: stripCount });

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex overflow-hidden">
      <AnimatePresence>
        {active &&
          strips.map((_, i) => (
            <motion.div
              key={i}
              className={`h-full w-full ${color}`}
              initial={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.7,
                      ease: [0.65, 0, 0.35, 1],
                      delay: i * 0.05,
                    }
              }
              onAnimationComplete={
                i === stripCount - 1 ? onRevealed : undefined
              }
            />
          ))}
      </AnimatePresence>
    </div>
  );
}