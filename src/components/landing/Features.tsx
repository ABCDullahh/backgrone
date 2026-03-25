"use client";

import { motion } from "motion/react";
import { ANIM, fadeInUpSlow } from "@/lib/animations";

const FEATURES: ReadonlyArray<{
  title: string;
  description: string;
  layout: "image-left" | "image-right";
  imageSrc: string;
  imageAlt: string;
}> = [
  {
    title: "Edge Precision",
    description:
      "Less blurry edges, fewer artifacts. Our AI preserves fine details with precision.",
    layout: "image-left",
    imageSrc:
      "https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&w=1920",
    imageAlt: "Close-up of woman with hair blowing in studio light showing fine detail",
  },
  {
    title: "Multi-Engine Power",
    description:
      "Choose from 3 AI engines optimized for different needs.",
    layout: "image-right",
    imageSrc:
      "https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=1920",
    imageAlt: "Dashboard with multiple gauges and dials representing engine options",
  },
  {
    title: "Batch Processing",
    description:
      "Process up to 20 images at once. Download as ZIP.",
    layout: "image-left",
    imageSrc:
      "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1920",
    imageAlt: "Multiple screens showing various images for batch processing",
  },
];

export function Features() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-32">
        {FEATURES.map((feature, i) => {
          const isImageLeft = feature.layout === "image-left";
          return (
            <motion.div
              key={feature.title}
              initial={fadeInUpSlow.initial}
              whileInView={fadeInUpSlow.animate}
              transition={{
                ...fadeInUpSlow.transition,
                delay: 0.1,
              }}
              viewport={ANIM.viewport}
              className={`flex flex-col items-center gap-8 md:gap-12 ${
                isImageLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Image */}
              <div className={`relative w-full ${isImageLeft ? "md:w-3/5" : "md:w-3/5"}`}>
                <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container">
                  <img
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
                {/* Depth block behind */}
                <div
                  className={`absolute -bottom-4 ${
                    isImageLeft ? "-right-4" : "-left-4"
                  } -z-10 h-full w-full bg-surface-container-low`}
                />
              </div>

              {/* Text */}
              <div className={`w-full md:w-2/5 ${!isImageLeft ? "md:-mr-12" : ""}`}>
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {String(i + 1).padStart(2, "0")} // FEATURE
                </span>
                <h3 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] md:text-5xl">
                  {feature.title}
                </h3>
                <p className="mt-4 max-w-sm font-body text-lg leading-relaxed text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
