'use client';

import Reveal from './Reveal';
import { stack } from '@/data/content';

export default function TechStack() {
  const groups = Object.entries(stack);

  return (
    <section id="stack" className="relative overflow-hidden border-t border-hairline px-6 py-28 md:px-10">
      <div className="mx-auto h-px w-7xl bg-parchment my-12"/>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[length:100%] bg-center bg-repeat-x opacity-20 mix-blend-overlay [background-image:url('/llline.svg')]" />

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Technical stack
          </p>
          <h2 className="max-w-xl font-serif text-4xl text-parchment md:text-5xl">
            My Tool kit
            <div className="mx-auto h-px w-1xl bg-accent my-5" />
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(([group, items], i) => (
            <Reveal key={group} delay={i * 0.08}>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">
                {group}
              </h3>
              <ul className="space-y-2">
                {items.map((tech) => (
                  <li key={tech} className="border-b border-hairline pb-2 text-sm text-parchment">
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="mx-auto h-px w-7xl bg-parchment my-12"/>
    </section>
  );
}
