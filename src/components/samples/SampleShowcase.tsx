"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ANIM, fadeInUp } from "@/lib/animations";
import { SAMPLE_IMAGES, type Category } from "@/lib/data/samples";
import { CategoryFilter } from "./CategoryFilter";
import { SampleCard } from "./SampleCard";

/**
 * Assign editorial col-span classes based on index position within
 * the visible list, cycling through: 7/5, 12, 5/7.
 */
function getColSpan(index: number): string {
  const cycle = index % 4;
  switch (cycle) {
    case 0:
      return "col-span-12 md:col-span-7";
    case 1:
      return "col-span-12 md:col-span-5";
    case 2:
      return "col-span-12";
    case 3:
      return "col-span-12 md:col-span-5";
    default:
      return "col-span-12";
  }
}

export function SampleShowcase() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered =
    activeCategory === "all"
      ? SAMPLE_IMAGES
      : SAMPLE_IMAGES.filter((s) => s.category === activeCategory);

  return (
    <section className="px-6 md:px-12 lg:px-20">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={ANIM.viewport}
        transition={{ duration: ANIM.medium, ease: ANIM.smooth }}
      >
        <span className="font-label text-[10px] uppercase tracking-widest text-outline">
          SECTION // 01
        </span>
        <h2 className="mt-2 font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
          BACKGROUND REMOVAL
          <br />
          EXAMPLES.
        </h2>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={ANIM.viewport}
        transition={{
          delay: 0.2,
          duration: ANIM.medium,
          ease: ANIM.smooth,
        }}
        className="mt-10"
      >
        <CategoryFilter
          active={activeCategory}
          onChange={setActiveCategory}
        />
      </motion.div>

      {/* Editorial grid */}
      <div className="editorial-grid mt-12">
        {filtered.map((sample, i) => (
          <motion.div
            key={sample.id}
            className={getColSpan(i)}
            {...fadeInUp}
            whileInView="animate"
            initial="initial"
            viewport={ANIM.viewport}
            transition={{
              delay: i * 0.08,
              duration: ANIM.medium,
              ease: ANIM.smooth,
            }}
          >
            <SampleCard sample={sample} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 flex items-center justify-center py-20">
          <p className="font-label text-[10px] uppercase tracking-widest text-outline">
            No samples in this category yet.
          </p>
        </div>
      )}
    </section>
  );
}
