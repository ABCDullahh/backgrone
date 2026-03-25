"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ANIM } from "@/lib/animations";

const FAQ_ITEMS = [
  {
    question: "Is my data really private?",
    answer:
      "Yes. Everything runs in your browser using WebAssembly and WebGPU. Your images are never uploaded to any server. There is no backend, no cloud processing, and no analytics on your content.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes. No signup, no watermarks, no usage limits. Backgrone is a free, open-source tool. The processing happens entirely on your device.",
  },
  {
    question: "What formats are supported?",
    answer:
      "JPEG, PNG, WebP, and HEIC input formats are supported. Output is always a transparent PNG at the original resolution.",
  },
  {
    question: "Can I process multiple images?",
    answer:
      "Yes. Batch up to 20 images at once. They are processed sequentially in your browser and you can download them all as a single ZIP file.",
  },
  {
    question: "Which AI engine should I use?",
    answer:
      "Start with Precision for best quality. Use Speed for faster results on simpler backgrounds. Use Quality for the best balance of speed and accuracy.",
  },
] as const;

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIM.medium, ease: ANIM.smooth }}
          viewport={ANIM.viewport}
        >
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            SECTION // 08
          </p>
          <h2 className="mt-4 font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
            FAQ.
          </h2>
        </motion.div>

        <div className="mt-16 space-y-8">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.05,
                  duration: ANIM.medium,
                  ease: ANIM.smooth,
                }}
                viewport={ANIM.viewport}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h3 className="font-headline text-xl font-bold">
                    {item.question}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-on-surface-variant transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: ANIM.fast },
                        opacity: { duration: ANIM.fast },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 font-body text-base leading-relaxed text-on-surface-variant">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
