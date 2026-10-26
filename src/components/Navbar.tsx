'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { navLinks, siteInfo } from '@/data/content';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('top');
      setScrolled(hero ? hero.getBoundingClientRect().bottom <= 64 : window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // anchor links for futrue ref
    const sectionLinks = navLinks.filter((link) => link.href.startsWith('#'));
    const sections = sectionLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hero = document.getElementById('top');
        if (hero && hero.getBoundingClientRect().bottom > window.innerHeight * 0.5) {
          setActiveHref(null);
          return;
        }

        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveHref(`#${topMost.target.id}`);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 ${scrolled
          ? 'border-white/[0.08] bg-ink/30 shadow-[0_4px_30px_rgba(0,0,0,0.2)]'
          : 'border-white/[0.06] bg-ink/15'
        }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="font-mono text-sm tracking-tight text-parchment">
          D<span className="text-accent">.</span>B
        </a>

        <ul className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest md:flex">
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith('#');
            const isActive = isAnchor && link.href === activeHref;

            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={isAnchor ? undefined : '_blank'}
                  rel={isAnchor ? undefined : 'noopener noreferrer'}
                  className={`relative py-1 transition-colors ${isActive ? 'text-accent' : 'text-muted hover:text-parchment'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute -bottom-1 left-0 h-px w-full bg-accent"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <button aria-label="Open menu" className="flex flex-col gap-1.5 md:hidden">
          <span className="h-px w-6 bg-parchment" />
          <span className="h-px w-6 bg-parchment" />
        </button>
      </nav>
    </header>
  );
}
