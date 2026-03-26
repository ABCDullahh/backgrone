"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ANIM, fadeInUpSlow } from "@/lib/animations";

export function CTA() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-12 md:py-48 lg:px-20">
      {/* Giant background text */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-headline text-[30vw] font-black leading-none text-surface-container opacity-50">
        GO
      </span>

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.h2
          initial={fadeInUpSlow.initial}
          whileInView={fadeInUpSlow.animate}
          transition={fadeInUpSlow.transition}
          viewport={ANIM.viewport}
          className="font-headline text-6xl font-black tracking-[-0.04em] md:text-9xl"
        >
          Remove Background.
          <br />
          Free. Instant.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: ANIM.medium,
            ease: ANIM.smooth,
          }}
          viewport={ANIM.viewport}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/editor"
            className="bg-primary px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-primary"
          >
            REMOVE BACKGROUND NOW
          </Link>
          <Link
            href="/samples"
            className="border-2 border-primary px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-primary"
          >
            VIEW REMOVAL EXAMPLES
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
