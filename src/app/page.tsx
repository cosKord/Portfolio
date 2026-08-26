'use client';

import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { frame, cancelFrame, FrameData } from 'framer-motion';
import Preloader from '@/components/preloader';
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

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const cursorRing = document.createElement('div');
  cursorRing.className = 'custom-cursor-ring';
  document.body.appendChild(cursorRing);

  document.body.classList.add('cursor-none');

  const handleMove = (e: MouseEvent) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  };
  const handleLeave = () => {
    cursor.style.opacity = '0';
    cursorRing.style.opacity = '0';
  };
  const handleEnter = () => {
    cursor.style.opacity = '1';
    cursorRing.style.opacity = '1';
  };

  const interactiveEls = document.querySelectorAll('a, button');
  const onHoverEnter = () => cursorRing.classList.add('is-hovering');
  const onHoverLeave = () => cursorRing.classList.remove('is-hovering');

  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseleave', handleLeave);
  document.addEventListener('mouseenter', handleEnter);
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', onHoverEnter);
    el.addEventListener('mouseleave', onHoverLeave);
  });

  return () => {
    cancelFrame(update);
    lenisRef.current?.destroy();
    document.body.classList.remove('cursor-none');
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseleave', handleLeave);
    document.removeEventListener('mouseenter', handleEnter);
    interactiveEls.forEach((el) => {
      el.removeEventListener('mouseenter', onHoverEnter);
      el.removeEventListener('mouseleave', onHoverLeave);
    });
    cursor.remove();
    cursorRing.remove();
  };
}, []);

  return (
    <main className="relative min-h-screen bg-ink text-parchment">
      <Preloader />
      <div className="relative z-10">
        <Navbar />
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