'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';
import { interests, type Interest } from '@/data/content';

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 },
  },
};

export default function About() {
  const [active, setActive] = useState<Interest | null>(null);
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const openInterest = (interest: Interest, index = 0) => {
    setActive(interest);
    setImgIndex(index);
  };

  const closeInterest = () => setActive(null);

  const next = () => {
    if (!active?.images?.length) return;
    setImgIndex((i) => (i + 1) % active.images!.length);
  };

  const prev = () => {
    if (!active?.images?.length) return;
    setImgIndex((i) => (i - 1 + active.images!.length) % active.images!.length);
  };

  return (
    <section id="interests" className="relative overflow-hidden border-t border-hairline px-6 py-10 md:px-10">

      <div className="pointer-events-none absolute inset-0 z-0 bg-repeat bg-[size:300px_300px] opacity-40 mix-blend-overlay [background-image:url('/nnnoise.svg')]" />

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Beyond code
            </p>
            <h2 className="font-serif text-4xl text-parchment md:text-5xl">
              Still figuring most of it out.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Apart from programming, I do a lot of other interesting stuff.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Check it out!
            </p>
          </div>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={rowVariants}
          className="relative mx-auto mt-16 grid max-w-[940px] grid-cols-1 justify-items-center gap-x-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {interests.map((interest) => {
                const isOpen = openFolder === interest.title;
                const isHovered = hoveredFolder === interest.title;
                const sheets = interest.images?.slice(0, 3) ?? [null];

                return <motion.div
                  key={interest.title}
                  layoutId={`interest-card-${interest.title}`}
                  onHoverStart={() => setHoveredFolder(interest.title)}
                  onHoverEnd={() => setHoveredFolder(null)}
                  onFocusCapture={() => setHoveredFolder(interest.title)}
                  onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setHoveredFolder(null);
                  }}
                  className="group relative mt-24 h-[280px] w-full max-w-[300px] text-left"
                  style={{ perspective: 900 }}
                >
                  <div className="pointer-events-none absolute inset-x-2 top-2 h-[76%] rounded-[20px] border border-parchment/25 bg-parchment/10 backdrop-blur-xl" />
                  <div className="pointer-events-none absolute -top-4 right-2 h-12 w-[46%] rounded-t-[20px] border-x border-t border-parchment/25 bg-parchment/10 backdrop-blur-xl" />
                  {sheets.map((image, index) => (
                    <motion.button
                      key={image ?? 'note'}
                      type="button"
                      layoutId={index === 0 ? `interest-image-${interest.title}` : undefined}
                      onClick={() => {
                        if (!isOpen) {
                          setOpenFolder(interest.title);
                        } else {
                          openInterest(interest, index);
                        }
                      }}
                      aria-label={isOpen ? `View ${interest.title} ${image ? `image ${index + 1}` : 'details'}` : `Open ${interest.title} folder`}
                      className="absolute inset-x-2 top-0 h-[78%] overflow-hidden rounded-[20px] border border-parchment/20 bg-surface text-left shadow-[0_8px_22px_rgba(0,0,0,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      style={{
                        zIndex: index + 1,
                        maskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
                      }}
                      animate={{
                        y: isOpen ? -75 - (sheets.length - index - 1) * 10 : index * 10 - (isHovered ? 14 : 0),
                        x: isOpen ? (index - (sheets.length - 1) / 2) * 17 : 0,
                        rotate: isOpen ? (index - (sheets.length - 1) / 2) * 7 : 0,
                      }}
                      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 25 }}
                    >
                      {image ? (
                        <Image src={image} alt="" fill sizes="300px" className="object-cover" draggable={false} />
                      ) : (
                        <span className="absolute inset-0 flex items-start bg-gradient-to-br from-accent/25 via-surface to-ink p-5 font-mono text-xs leading-relaxed text-parchment">
                          {interest.description}
                        </span>
                      )}
                      <span className="absolute inset-x-0 top-0 bg-ink/55 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-parchment">
                        {interest.title} / {image ? String(index + 1).padStart(2, '0') : 'Notes'}
                      </span>
                    </motion.button>
                  ))}

                  <motion.button
                    type="button"
                    onClick={() => {
                      setOpenFolder(isOpen ? null : interest.title);
                    }}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Close' : 'Open'} ${interest.title} folder`}
                    className="absolute inset-x-0 bottom-0 z-10 h-[62%] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    style={{ transformOrigin: 'bottom center' }}
                    animate={{ rotateX: isOpen ? -16 : isHovered ? -6 : 0, y: isOpen ? 4 : 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 25 }}
                  >
                    <div className="absolute -top-5 left-0 h-8 w-[45%] rounded-t-[18px] border-x border-t border-parchment/20 bg-surface/90 backdrop-blur-[64px]" />
                    <div className="absolute inset-0 rounded-[20px] border border-parchment/20 bg-surface/90 shadow-[0_12px_28px_rgba(0,0,0,0.3)] backdrop-blur-[64px] transition-colors duration-300 group-hover:bg-surface/95 group-focus-visible:bg-surface/95" />
                    <div className="relative flex h-full flex-col justify-end p-6">
                      <span className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                        Interest{interest.images?.length ? ` / ${interest.images.length} images` : ''}
                      </span>
                      <motion.h3
                        layoutId={`interest-title-${interest.title}`}
                        className="font-serif text-3xl leading-snug text-parchment"
                      >
                        {interest.title}
                      </motion.h3>
                    </div>
                  </motion.button>
                </motion.div>;
              })}
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInterest}
          >
            <motion.div
              layoutId={`interest-card-${active.title}`}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-hairline bg-ink shadow-2xl"
            >
              {active.images && active.images.length > 0 && (
                <motion.div
                  layoutId={`interest-image-${active.title}`}
                  className="relative h-150 w-full overflow-hidden bg-hairline/10"
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={imgIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      drag={active.images.length > 1 ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.15}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60) next();
                        else if (info.offset.x > 60) prev();
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={active.images[imgIndex]}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 672px"
                        className="object-cover"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

                  {active.images.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-ink/70 text-parchment transition-colors hover:border-accent hover:text-accent"
                      >
                        ‹
                      </button>
                      <button
                        onClick={next}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-ink/70 text-parchment transition-colors hover:border-accent hover:text-accent"
                      >
                        ›
                      </button>

                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {active.images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIndex(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === imgIndex ? 'bg-accent' : 'bg-parchment/30'
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              <div className="flex flex-1 flex-col p-8">
                <span className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                  Interest
                </span>
                <motion.h3
                  layoutId={`interest-title-${active.title}`}
                  className="font-serif text-4xl leading-snug text-parchment"
                >
                  {active.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-base leading-relaxed text-muted"
                >
                  {active.description}
                </motion.p>
              </div>

              <button
                onClick={closeInterest}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-ink/70 font-mono text-sm text-parchment transition-colors hover:border-accent hover:text-accent"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
