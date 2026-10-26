'use client';

import Reveal from './Reveal';
import MagneticButton from './MagneticButton';
import { siteInfo } from '@/data/content';
import HeroWaves from './HeroWaves';

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-hairline px-6 py-28 md:px-10">

      {/*<div className="pointer-events-none absolute inset-0 z-0 bg-[length:100%] bg-center bg-repeat-x opacity-20 mix-blend-overlay [background-image:url('/nnnoise.svg')]" />*/}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <HeroWaves />
      </div>

      <div className="mx-auto max-w-6xl text-center">

        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Hit me up
          </p>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl leading-tight text-parchment md:text-6xl">
            Building something worth talking about? Let&apos;s talk.
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              as="a"
              href={`mailto:${siteInfo.email}`}
              className="rounded-full bg-accent px-8 py-3 font-mono text-xs uppercase tracking-widest text-ink"
            >
              {siteInfo.email}
            </MagneticButton>
            <MagneticButton
              as="a"
              href={siteInfo.github}
              className="rounded-full border border-hairline px-8 py-3 font-mono text-xs uppercase tracking-widest text-parchment hover:border-accent hover:text-accent"
            >
              {siteInfo.githubHandle}
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
