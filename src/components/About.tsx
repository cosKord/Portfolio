'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, PanInfo } from 'framer-motion';
import Reveal from './Reveal';
import { interests, type Interest } from '@/data/content';

const CARD_WIDTH = 256;
const GAP = 20;
const VISIBLE_COUNT = 3;
const STEP = CARD_WIDTH + GAP;
const VIEWPORT_WIDTH = VISIBLE_COUNT * CARD_WIDTH + (VISIBLE_COUNT - 1) * GAP;

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
  const [imgIndex, setImgIndex] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const dragDistanceRef = useRef(0);

  const maxIndex = Math.max(0, interests.length - VISIBLE_COUNT);
  const canCarousel = interests.length > VISIBLE_COUNT;

  const goNext = () => {
    setActiveCardIndex((i) => (i >= maxIndex ? 0 : i + 1));
  };

  const goPrev = () => {
    setActiveCardIndex((i) => (i <= 0 ? maxIndex : i - 1));
  };

  // Autoplay — paused whenever a card's modal is open, and skipped
  // entirely under prefers-reduced-motion.
  useEffect(() => {
    if (!canCarousel || prefersReducedMotion || active) return;
    const id = setInterval(goNext, 4000);
    return () => clearInterval(id);
  }, [canCarousel, prefersReducedMotion, active, maxIndex]);

  const openInterest = (interest: Interest) => {
    // A real drag that just ended shouldn't also open the card it
    // happened to land on.
    if (Math.abs(dragDistanceRef.current) > 5) {
      dragDistanceRef.current = 0;
      return;
    }
    setActive(interest);
    setImgIndex(0);
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

  const onTrackDragEnd = (_: unknown, info: PanInfo) => {
    dragDistanceRef.current = info.offset.x;
    if (info.offset.x < -60) goNext();
    else if (info.offset.x > 60) goPrev();
  };

  return (
    <section id="about" className="border-t border-hairline px-6 py-28 md:px-10">
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
          className="relative mx-auto mt-16 flex items-center justify-center gap-4"
        >
          {canCarousel && (
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-ink/70 text-parchment transition-colors hover:border-accent hover:text-accent md:flex"
            >
              ‹
            </button>
          )}

          <div
            className="overflow-hidden"
            style={{
              width: '100%',
              maxWidth: VIEWPORT_WIDTH,
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
            }}
          >
            <motion.div
              drag={canCarousel ? 'x' : false}
              dragConstraints={{ left: -maxIndex * STEP, right: 0 }}
              dragElastic={0.15}
              onDragEnd={onTrackDragEnd}
              animate={{ x: -activeCardIndex * STEP }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 300, damping: 32 }
              }
              className="flex gap-5"
            >
              {interests.map((interest) => (
                <motion.button
                  key={interest.title}
                  layoutId={`interest-card-${interest.title}`}
                  onClick={() => openInterest(interest)}
                  className="group relative flex h-100 w-64 shrink-0 flex-col justify-between overflow-hidden rounded-lg border border-transparent bg-ink/40 p-5 text-left transition-colors hover:border-accent/60"
                >
                  {interest.images && interest.images.length > 0 && (
                    <motion.div
                      layoutId={`interest-image-${interest.title}`}
                      className="absolute inset-0 -z-10"
                    >
                      <Image
                        src={interest.images[0]}
                        alt=""
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                      Interest
                    </span>
                    {interest.images && interest.images.length > 1 && (
                      <span className="font-mono text-[10px] text-muted">
                        {interest.images.length} photos
                      </span>
                    )}
                  </div>

                  <motion.h3
                    layoutId={`interest-title-${interest.title}`}
                    className="font-serif text-2xl leading-snug text-parchment"
                  >
                    {interest.title}
                  </motion.h3>
                </motion.button>
              ))}
            </motion.div>
          </div>

          {canCarousel && (
            <button
              onClick={goNext}
              aria-label="Next"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-ink/70 text-parchment transition-colors hover:border-accent hover:text-accent md:flex"
            >
              ›
            </button>
          )}
        </motion.div>

        {canCarousel && (
          <div className="mt-6 flex justify-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCardIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === activeCardIndex ? 'bg-accent' : 'bg-hairline'
                }`}
              />
            ))}
          </div>
        )}
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
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${
                              i === imgIndex ? 'bg-accent' : 'bg-parchment/30'
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