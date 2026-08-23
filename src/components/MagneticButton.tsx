'use client';

import { useRef, useState, MouseEvent, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a';
  href?: string;
  onClick?: () => void;
}
export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as = 'button',
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 12, mass: 0.4 }}
      className="inline-block"
    >
      {as === 'a' ? (
        <a
          href={href}
          onClick={onClick}
          className={`inline-flex items-center justify-center transition-colors ${className}`}
        >
          {children}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={`inline-flex items-center justify-center transition-colors ${className}`}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
}
