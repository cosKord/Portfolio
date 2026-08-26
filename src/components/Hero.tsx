'use client';

import { useRef } from 'react';
import HeroWaves from '@/components/HeroWaves';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  Variants,
} from 'framer-motion';
import { siteInfo } from '@/data/content';

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ['start start', 'end end'],
  });

  const nameOpacity = useTransform( scrollYProgress, [0, 0.3, 1], [1, 0, 0] );
  const nameY = useTransform(scrollYProgress,[0, 0.3],[0, -60]);

  const hiOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.65, 0.75], [0, 1, 1, 0]);
  const hiY = useTransform(scrollYProgress, [0.35, 0.5], [40, 0]);

  const wOpacity = useTransform(scrollYProgress, [0.8, 0.95, 1], [0, 1, 1]);
  const wY = useTransform(scrollYProgress, [0.8, 0.95, 1], [40, 0, 0]);

  return (
    <section ref={sectionRef} id="top" className="relative h-[300vh]">

      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 pt-28 md:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <HeroWaves />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink/30 via-ink/30 to-accent/50" />

        <motion.div
          variants={prefersReducedMotion ? undefined : container}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'visible'}
          className="relative z-10 mx-auto w-full max-w-6xl"
        >
          <motion.p
            variants={item}
            className="mb-6 text-center font-mono text-xs uppercase tracking-[0.3em] text-accent"
          ></motion.p>
          
          <div className="grid justify-items-center">
            <motion.h1
              style={ prefersReducedMotion ? undefined : { opacity: nameOpacity, y: nameY }}
              className="col-start-1 row-start-1 text-center font-serif text-[18vw] font-bold leading-[0.9] text-parchment [text-shadow:0_2px_24px_rgba(0,0,0,0.4)] sm:text-9xl md:text-8xl lg:text-[12rem]"
            >
            {siteInfo.name}
            </motion.h1>

            <motion.p
                aria-hidden="true"
                style={{ opacity: hiOpacity, y: hiY }}
                className="col-start-1 row-start-1 max-w-4xl px-4 text-center font-serif text-5xl font-bold leading-snug text-parchment [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:text-6xl md:text-7xl">
               Hi there, I&apos;m an aspiring Full-Stack Developer
            </motion.p>

            <motion.p
                aria-hidden="true"
                style={{ opacity: wOpacity, y: wY }}
                className="col-start-1 row-start-1 max-w-4xl px-4 text-center font-serif text-4xl font-bold leading-snug text-parchment [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl"
            >
              Take a stroll around
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}