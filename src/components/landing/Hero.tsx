"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { ANIM, staggerContainer, fadeInUp } from "@/lib/animations";

const headlineWords = [
  { text: "THE ART", indent: false },
  { text: "OF REMOVAL", indent: true },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden px-6 md:px-12 lg:px-20">
      <div className="broken-grid items-center gap-8 py-16 md:py-24">
        {/* Left content */}
        <div className="relative z-10 col-span-12 flex flex-col justify-center md:col-span-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <h1 className="sr-only">
              Remove Background from Image — Free AI Background Remover Online
            </h1>
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                variants={fadeInUp}
                aria-hidden="true"
                className={`text-huge block font-headline font-black tracking-[-0.04em] ${
                  word.indent ? "ml-24 md:ml-48" : ""
                }`}
              >
                {word.text}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4,
              duration: ANIM.medium,
              ease: ANIM.smooth,
            }}
            className="mt-12 font-label text-sm uppercase tracking-widest text-on-surface-variant"
          >
            FREE AI BACKGROUND REMOVER — 100% PRIVATE, NO UPLOAD, RUNS LOCALLY IN YOUR BROWSER
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: ANIM.medium,
              ease: ANIM.smooth,
            }}
            className="mt-8"
          >
            <Link
              href="/editor"
              className="inline-block bg-secondary px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-white"
            >
              REMOVE BACKGROUND FREE
            </Link>
          </motion.div>
        </div>

        {/* Right — Before/After slider with REAL images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            duration: ANIM.slow,
            ease: ANIM.dramatic,
          }}
          className="relative z-0 col-span-12 mt-12 md:col-span-6 md:mt-0"
        >
          <div className="relative mx-auto w-full max-w-md overflow-hidden">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src="/samples/hero-before.jpg"
                  alt="Original photo before background removal with Backgrone AI"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  }}
                />
              }
              itemTwo={
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ backgroundColor: "#f9f9f9" }}
                >
                  <img
                    src="/samples/hero-after.png"
                    alt="Image with background removed using free AI background remover Backgrone"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              }
              style={{ width: "100%", height: "auto", aspectRatio: "3/4" }}
              defaultPosition={40}
            />
            {/* Labels */}
            <div className="absolute bottom-4 left-4 z-10 bg-primary/80 px-3 py-1 font-label text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
              Before
            </div>
            <div className="absolute bottom-4 right-4 z-10 bg-white/80 px-3 py-1 font-label text-[9px] uppercase tracking-widest text-primary backdrop-blur-sm">
              After
            </div>
          </div>
        </motion.div>
      </div>

      {/* Vertical scroll text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: ANIM.slow }}
        className="vertical-text absolute right-6 top-1/2 hidden -translate-y-1/2 font-label text-[10px] uppercase tracking-widest text-outline md:block"
      >
        SCROLL TO DISCOVER
      </motion.span>
    </section>
  );
}
