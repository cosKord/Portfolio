'use client';

import Reveal from './Reveal';
import { experience, education } from '@/data/content';

export default function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden border-t border-hairline px-6 py-10 md:px-10">

      <div className="pointer-events-none absolute inset-0 z-0 bg-[length:100%] bg-center bg-repeat-x opacity-40 mix-blend-overlay [background-image:url('/nnnoise.svg')]" />
      
      <div className="mx-auto h-px w-7xl bg-hairline my-12"/>

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-parchment">
            where I have worked
          </p>
          <h2 className="max-w-xl font-serif text-4xl text-parchment md:text-5xl">
            <span className="bg-gradient bg-clip-text text-transparent">
              Experience
            </span>
            <div className="mx-auto h-px w-1xl bg-accent my-5" />
          </h2>
        </Reveal>

        {experience.map((role, i) => (
          <Reveal key={role.company} delay={i * 0.1}>
            <div className="grid gap-4 border-t border-hairline py-8 md:grid-cols-[140px_1fr] md:gap-10">
              <span className="font-mono text-xs uppercase tracking-widest text-parchment">
                {role.period}
              </span>
              <div>
                <h3 className="font-serif text-2xl text-parchment">
                  {role.role} <span className="text-muted">— {role.company}</span>
                </h3>
                <ul className="mt-4 space-y-2">
                  {role.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-parchment">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mx-auto h-px w-7xl bg-hairline my-12"/>
    </section>
  );
}
