'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

function subscribeFinePointer(callback: () => void) {
  if (typeof window === 'undefined') return () => { };
  const mql = window.matchMedia('(pointer: fine)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getFinePointerSnapshot() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}

function getFinePointerServerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const isFinePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Mouse position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth physics springs for dot and trailing ring
  const ringX = useSpring(mouseX, {
    damping: 24,
    stiffness: 240,
    mass: 0.5,
  });
  const ringY = useSpring(mouseY, {
    damping: 24,
    stiffness: 240,
    mass: 0.5,
  });

  const dotX = useSpring(mouseX, {
    damping: 40,
    stiffness: 1000,
    mass: 0.1,
  });
  const dotY = useSpring(mouseY, {
    damping: 40,
    stiffness: 1000,
    mass: 0.1,
  });

  useEffect(() => {
    if (!isFinePointer) return;

    document.body.classList.add('cursor-none');

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover], .clickable'
      );
      setIsHovered(Boolean(interactive));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.body.classList.remove('cursor-none');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isFinePointer, mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <>
      {/* Outer Trailing Ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-accent mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 20,
          height: 20,
        }}
        animate={{
          scale: isHovered ? (isClicked ? 1.3 : 1.6) : isClicked ? 0.8 : 1,
          opacity: isVisible ? (isHovered ? 0.85 : 0.6) : 0,
          backgroundColor: isHovered ? 'rgba(232, 163, 61, 0.15)' : 'rgba(232, 163, 61, 0)',
        }}
        transition={{
          scale: { duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' },
          opacity: { duration: 0.15 },
          backgroundColor: { duration: 0.18 },
        }}
      />

      {/* Center Precision Dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[10000] rounded-full bg-accent mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
        }}
        animate={{
          scale: isHovered ? (isClicked ? 0.4 : 0.6) : isClicked ? 1.25 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale: { duration: prefersReducedMotion ? 0 : 0.15, ease: 'easeOut' },
          opacity: { duration: 0.15 },
        }}
      />
    </>
  );
}
