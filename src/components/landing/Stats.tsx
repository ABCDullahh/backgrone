"use client";

import { motion } from "motion/react";
import { ANIM } from "@/lib/animations";
import { CountUp } from "@/components/ui/CountUp";

interface StatItem {
  value: string | null;
  numericValue?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  style: string;
  hasDot?: boolean;
}

const STATS: StatItem[] = [
  {
    value: "3",
    numericValue: 3,
    label: "AI Engines",
    style: "bg-surface-container-low",
  },
  {
    value: "100%",
    numericValue: 100,
    suffix: "%",
    label: "Private",
    style: "bg-primary text-surface",
  },
  {
    value: "<2s",
    numericValue: 2,
    prefix: "<",
    suffix: "s",
    label: "Processing",
    style: "bg-surface-container-low text-secondary",
  },
  {
    value: null,
    label: "Local Processing",
    style: "border border-outline-variant/20",
    hasDot: true,
  },
];

export function Stats() {
  return (
    <section className="bg-surface-container-low px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.1,
              duration: ANIM.medium,
              ease: ANIM.smooth,
            }}
            viewport={ANIM.viewport}
            className={`flex flex-col items-start justify-between p-8 ${stat.style}`}
          >
            {stat.hasDot ? (
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 animate-pulse bg-secondary" />
                <span className="font-headline text-3xl font-black tracking-tight md:text-4xl">
                  ON
                </span>
              </div>
            ) : stat.numericValue !== undefined ? (
              <CountUp
                end={stat.numericValue}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="font-headline text-5xl font-black tracking-[-0.04em] md:text-6xl"
              />
            ) : (
              <span className="font-headline text-5xl font-black tracking-[-0.04em] md:text-6xl">
                {stat.value}
              </span>
            )}
            <p className="mt-4 font-label text-[10px] uppercase tracking-widest opacity-70">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
