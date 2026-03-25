"use client";

import { motion } from "motion/react";
import {
  Camera,
  ShoppingBag,
  Megaphone,
  Code,
  Building2,
  User,
} from "lucide-react";
import { ANIM } from "@/lib/animations";

const USE_CASES = [
  {
    icon: Camera,
    title: "Photographers",
    description: "Clean backdrops for portraits and product shots.",
    span: "md:col-span-2",
  },
  {
    icon: ShoppingBag,
    title: "eCommerce",
    description: "White-background product images in seconds.",
    span: "md:col-span-1",
  },
  {
    icon: Megaphone,
    title: "Marketers",
    description: "Create ad creatives without a design team.",
    span: "md:col-span-1",
  },
  {
    icon: Code,
    title: "Developers",
    description: "Open-source, self-hostable, no vendor lock-in.",
    span: "md:col-span-2",
  },
  {
    icon: Building2,
    title: "Enterprise",
    description: "Scale without limits, zero data leaves your network.",
    span: "md:col-span-1",
  },
  {
    icon: User,
    title: "Individuals",
    description: "Perfect profile pictures and social media posts.",
    span: "md:col-span-2",
  },
] as const;

export function UseCases() {
  return (
    <section className="bg-surface-container-low px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIM.medium, ease: ANIM.smooth }}
          viewport={ANIM.viewport}
        >
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            SECTION // 04
          </p>
          <h2 className="mt-4 font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
            BUILT FOR
            <br />
            EVERYONE.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.08,
                  duration: ANIM.medium,
                  ease: ANIM.smooth,
                }}
                viewport={ANIM.viewport}
                className={`group border-l-4 border-transparent bg-surface p-8 transition-all hover:border-secondary ${uc.span}`}
              >
                <Icon
                  size={28}
                  className="text-on-surface-variant transition-colors group-hover:text-secondary"
                />
                <h3 className="mt-6 font-headline text-xl font-bold tracking-tight">
                  {uc.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
                  {uc.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
