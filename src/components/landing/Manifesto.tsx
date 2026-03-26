"use client";

import { motion } from "motion/react";
import { ANIM, fadeInUpSlow } from "@/lib/animations";

const PILLARS = [
  { num: "01", title: "100% Local Processing", description: "Remove backgrounds entirely in your browser. No server, no cloud." },
  { num: "02", title: "Zero Upload Required", description: "Your images never leave your device. Private background removal by design." },
  { num: "03", title: "Lossless PNG Output", description: "Get transparent backgrounds at full resolution with no watermarks." },
] as const;

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-primary px-6 py-24 text-surface md:px-12 md:py-32 lg:px-20">
      {/* Giant background text */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-headline text-[20rem] font-black leading-none opacity-[0.04]">
        BACKGRONE
      </span>

      <div className="relative mx-auto max-w-5xl">
        <motion.blockquote
          initial={fadeInUpSlow.initial}
          whileInView={fadeInUpSlow.animate}
          transition={fadeInUpSlow.transition}
          viewport={ANIM.viewport}
          className="font-headline text-3xl font-black italic leading-snug tracking-tight md:text-5xl lg:text-6xl"
        >
          &ldquo;Privacy is not a feature,
          <br />
          it&rsquo;s a right. Remove backgrounds
          <br />
          without uploading your images.&rdquo;
        </motion.blockquote>

        <div className="mt-16 grid grid-cols-1 gap-8 md:mt-24 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * ANIM.stagger,
                duration: ANIM.medium,
                ease: ANIM.smooth,
              }}
              viewport={ANIM.viewport}
              className="border-l border-surface-variant/20 pl-8"
            >
              <span className="font-label text-[10px] uppercase tracking-widest text-surface-variant/60">
                {pillar.num}.
              </span>
              <h3 className="mt-2 font-headline text-xl font-bold">
                {pillar.title}
              </h3>
              <p className="mt-1 font-body text-sm text-surface-variant/80">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
