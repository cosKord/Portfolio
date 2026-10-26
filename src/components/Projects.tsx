'use client';

import Reveal from './Reveal';
import AnimatedBorder from './AnimatedBorder';
import { projects, siteInfo } from '@/data/content';

export default function Projects() {
  return (
    <section id="work" className="relative overflow-hidden border-t border-hairline px-6 py-10 md:px-10">

      <div className="mx-auto h-px w-7xl bg-parchment my-12" />

      <div className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-overlay [background-image:url('/uuundulate.svg')]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="relative z-10">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Projects
            </p>
            <h2 className="max-w-xl font-serif text-4xl text-parchment md:text-5xl">
              <span className="bg-gradient-2 bg-clip-text text-transparent">
                Systems I&apos;m actively building.
              </span>

              <div className="mx-auto h-px w-1xl bg-accent my-5" />
            </h2>

          </Reveal>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.name} delay={i * 0.1}>
                <AnimatedBorder radius={2} className="group h-full rounded-2xl">
                  <div className="flex h-full flex-col justify-between gap-8 bg-surface/85 p-8 transition-colors duration-300 group-hover:bg-surface">
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <h3 className="font-serif text-2xl text-accent">{project.name}</h3>
                        <span className="shrink-0 rounded-full border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-parchment">{project.description}</p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">

                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-3">
                        <a
                          href={project.repoUrl ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex flex-1 items-center justify-center rounded-full border border-hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-parchment transition-colors hover:border-accent hover:text-accent"
                        >
                          View Repository
                        </a>
                        <a
                          href={project.liveUrl ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex flex-1 items-center justify-center rounded-full border border-hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-parchment transition-colors hover:border-accent hover:text-accent"
                        >
                          Live
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedBorder>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>

            <a href={siteInfo.github}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent" >
              More on GitHub → {siteInfo.githubHandle}
            </a>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto h-px w-7xl bg-parchment my-12" />

    </section>
  );
}