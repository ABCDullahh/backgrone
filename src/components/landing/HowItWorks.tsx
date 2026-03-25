"use client";

import { motion } from "motion/react";
import { ANIM } from "@/lib/animations";

const STEPS = [
  {
    num: "01",
    title: "Upload",
    description:
      "Drag and drop your image or click to browse. Supports JPEG, PNG, WebP, and HEIC.",
  },
  {
    num: "02",
    title: "Process",
    description:
      "Our AI analyzes and removes the background in under 2 seconds, entirely in your browser.",
  },
  {
    num: "03",
    title: "Download",
    description:
      "Get your transparent PNG instantly. No watermarks, no signup, no limits.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIM.medium, ease: ANIM.smooth }}
          viewport={ANIM.viewport}
        >
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            SECTION // 05
          </p>
          <h2 className="mt-4 font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
            HOW IT WORKS.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.15,
                duration: ANIM.medium,
                ease: ANIM.smooth,
              }}
              viewport={ANIM.viewport}
            >
              <span className="font-headline text-8xl font-black leading-none text-secondary-container">
                {step.num}
              </span>
              <h3 className="mt-4 font-headline text-2xl font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 font-body text-base leading-relaxed text-on-surface-variant">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
