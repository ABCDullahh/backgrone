export const ANIM = {
  fast: 0.2,
  medium: 0.5,
  slow: 0.8,
  stagger: 0.1,

  smooth: [0.25, 0.1, 0.25, 1] as const,
  dramatic: [0.16, 1, 0.3, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,

  viewport: { once: true, amount: 0.3 } as const,
} as const;

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIM.medium, ease: ANIM.smooth },
};

export const fadeInUpSlow = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIM.slow, ease: ANIM.dramatic },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: ANIM.stagger,
    },
  },
};

export const scaleOnHover = {
  whileHover: { scale: 0.98 },
  whileTap: { scale: 0.95 },
  transition: { duration: ANIM.fast },
};
