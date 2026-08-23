'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  radius?: number;
  active?: boolean;
}

export default function AnimatedBorder({
  children,
  className = '',
  radius = 16,
  active = true,
}: AnimatedBorderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <rect
          x={1}
          y={1}
          rx={radius}
          fill="none"
          stroke="#302E2A"
          strokeWidth={1}
          style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)' }}
        />
        {!prefersReducedMotion && active && (
          <motion.rect
            x={1}
            y={1}
            rx={radius}
            fill="none"
            stroke="#E8A33D"
            strokeWidth={1}
            pathLength={100}
            strokeDasharray="6 94"
            style={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              opacity: 0.85,
            }}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -100 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </svg>
      <div className="relative h-full">{children}</div>
    </div>
  );
}
