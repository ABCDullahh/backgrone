"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Video, Maximize2 } from "lucide-react";
import { ANIM, fadeInUp } from "@/lib/animations";

const UPCOMING = [
  {
    icon: Video,
    title: "Video BG Remover",
    description:
      "Remove backgrounds from video in real-time, right in your browser. Frame-by-frame precision with temporal consistency.",
    badge: "Q3 2026",
    href: "/video",
  },
  {
    icon: Maximize2,
    title: "Image Upscaler",
    description:
      "Enhance image resolution up to 4x using AI. Upscale your photos without losing quality — all processed locally.",
    badge: "Q4 2026",
    href: null,
  },
] as const;

export function ComingSoon() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          transition={fadeInUp.transition}
          viewport={ANIM.viewport}
        >
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            COMING SOON
          </p>
          <h2 className="mt-4 font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
            WHAT&apos;S NEXT.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {UPCOMING.map((item, i) => {
            const Icon = item.icon;
            const content = (
              <motion.div
                key={item.title}
                initial={fadeInUp.initial}
                whileInView={fadeInUp.animate}
                transition={{
                  ...fadeInUp.transition,
                  delay: i * 0.1,
                }}
                viewport={ANIM.viewport}
                className="bg-surface-container-low p-8 transition-colors duration-300 hover:bg-surface-container"
              >
                <Icon className="h-8 w-8 text-secondary" />
                <h3 className="mt-4 font-headline text-2xl font-bold">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-sm text-on-surface-variant">
                  {item.description}
                </p>
                <span className="mt-4 inline-block bg-secondary-container px-3 py-1 font-label text-[9px] uppercase tracking-widest text-on-secondary-container">
                  {item.badge}
                </span>
              </motion.div>
            );

            if (item.href) {
              return (
                <Link key={item.title} href={item.href} className="block">
                  {content}
                </Link>
              );
            }

            return content;
          })}
        </div>
      </div>
    </section>
  );
}
