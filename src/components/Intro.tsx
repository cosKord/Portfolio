'use client';

import Reveal from './Reveal';
import { siteInfo } from '@/data/content';
import dynamic from 'next/dynamic';

const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
    loading: () => <p className="font-mono text-xs text-muted">Loading activity…</p>,
  }
);
export default function Intro() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-hairline px-6 py-10 md:px-10">

      <div className="pointer-events-none absolute inset-0 z-0 bg-[length:100%] bg-center bg-repeat-x opacity-40 mix-blend-overlay [background-image:url('/nnnoise.svg')]" />
      
      <div className="mx-auto h-px w-7xl bg-hairline my-12" />
      <div className="mx-auto grid max-w-6xl gap-1 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-parchment">
            Introduction
          </p>

          <h2 className="max-w-lg font-serif text-4xl text-parchment md:text-5xl">
            <span className="bg-gradient bg-clip-text text-transparent">
               Building useful projects, which scale as well
            </span>
            <div className="mx-auto h-px w-1xl bg-accent my-12" />
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="max-w-xl space-y-6 text-base leading-relaxed text-parchment/70 md:text-lg">

            <span className="px-6 font-mono text-[15px] tracking-widest text-parchment">
              <p>
              I enjoy designing responsive, engaging interfaces that feel
              intuitive to use and purposeful in every detail. I like turning
              ideas into polished digital experiences while keeping the
              underlying code clean, scalable, and maintainable.
              </p>
            <span/>

            <span className="px-6 font-mono text-[15px] tracking-widest text-parchment"></span>
              <p>
              My current focus is on growing beyond frontend development by
              strengthening my foundations in DSA and exploring areas like
              AI/ML, blockchain, and full-stack development.
              </p>
            <span/>

            <span className="px-6 font-mono text-[15px] tracking-widest text-parchment"></span>
              <p>
              I&apos;m always looking to build projects that challenge me to
              learn something new, experiment with different technologies, and
              turn interesting ideas into things that are actually useful.
              </p>
            </span>
            
          </div>
        </Reveal>
      </div>

      <div className="mx-auto h-px w-7xl bg-hairline my-12" />

      <div className="mx-auto grid max-w-6xl gap-1 md:grid-cols-[1.2fr_1fr]">
        <Reveal delay={0.1}>
          <span className="px-6 font-mono text-[15px] uppercase tracking-widest text-parchment"></span>
            <h2 className="max-w-lg font-serif text-4xl text-parchment md:text-5xl">
                <span className="bg-gradient bg-clip-text text-transparent">
                  Contributions.
                </span>
              <div className="mx-auto h-px w-1xl bg-accent my-5" />
            </h2>
          <span/>
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl">
        <Reveal delay={0.1}>
          <div className="flex justify-center">
            <GitHubCalendar username={siteInfo.github.replace('https://github.com/', '')} />
          </div>
        </Reveal>
      </div>

      <div className="mx-auto h-px w-7xl bg-hairline my-12" />
    </section>
  );
}