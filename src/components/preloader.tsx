'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Curtains from './Curtains';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const finish = () => setLoading(false);

    if (document.readyState === 'complete') {
      const t = setTimeout(finish, prefersReducedMotion ? 0 : 400);
      return () => clearTimeout(t);
    }

    window.addEventListener('load', finish);
    return () => window.removeEventListener('load', finish);
  }, [prefersReducedMotion]);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none fixed inset-0 z-[101] flex flex-col items-center justify-center gap-6"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-parchment">
              D<span className="text-accent">.</span>B
            </span>

            <div className="h-px w-40 overflow-hidden bg-blue-300">
              {!prefersReducedMotion && (
                <motion.div
                  className="h-full w-1/2 bg-accent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Curtains
        active={loading}
        color="bg-ink"
        onRevealed={() => {
          document.body.style.overflow = '';
          setMounted(false);
        }}
      />
    </>
  );
}