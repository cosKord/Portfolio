'use client';

import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { frame, cancelFrame, FrameData } from 'framer-motion';
import Preloader from '@/components/preloader';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import TechnicalStack from '@/components/TechStack';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Intro from '@/components/Intro';

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 2,
    });

    function update(data: FrameData) {
      lenisRef.current?.raf(data.timestamp);
    }
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-ink text-parchment">
      <CustomCursor />
      <Preloader />
      <Navbar />
      <div className="relative z-10">
        <Hero />
        <Intro />
        <Projects />
        <Experience />
        <TechnicalStack />
        <About />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
