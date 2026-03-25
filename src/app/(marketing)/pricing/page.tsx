import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Backgrone",
  description: "Free forever. No signup, no watermarks.",
};

const FREE_FEATURES = [
  "UNLIMITED PROCESSING",
  "3 AI ENGINES",
  "LOSSLESS PNG EXPORTS",
] as const;

const SPEC_LIST = [
  { label: "Storage", value: "Unlimited" },
  { label: "Engines", value: "3" },
  { label: "Batch", value: "20 images" },
  { label: "Privacy", value: "100%" },
] as const;

export default function PricingPage() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            TIER SELECTION
          </p>
          <h1 className="mt-4 font-headline text-6xl font-black tracking-[-0.04em] md:text-8xl">
            INVESTMENT
            <br />
            IN QUALITY.
          </h1>
        </div>
      </section>

      {/* Two-column pricing */}
      <section className="px-6 pb-32 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left: Free Edition */}
          <div className="flex flex-col justify-between py-8 md:py-12">
            <div>
              <h2 className="font-headline text-4xl font-black tracking-[-0.04em] md:text-5xl">
                THE FREE
                <br />
                EDITION
              </h2>
              <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-on-surface-variant">
                Everything you need to remove backgrounds professionally.
                No hidden fees, no premium tiers, no bait-and-switch.
                The full product, free.
              </p>

              <ul className="mt-10 space-y-4">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-secondary" />
                    <span className="font-label text-[10px] uppercase tracking-widest">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <blockquote className="mt-12 border-l-4 border-secondary-container pl-6">
              <p className="font-headline text-xl italic leading-relaxed">
                &ldquo;No servers means no costs.
                No costs means no reason to charge you.&rdquo;
              </p>
              <cite className="mt-4 block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                — THE BACKGRONE PHILOSOPHY
              </cite>
            </blockquote>
          </div>

          {/* Right: Pricing Card */}
          <div className="flex flex-col justify-between bg-primary p-12 text-on-primary md:p-20">
            <div>
              <span className="font-headline text-[12rem] font-black leading-none md:text-9xl">
                $0
              </span>
              <p className="mt-2 font-label text-[10px] uppercase tracking-widest text-on-primary/60">
                / FOREVER
              </p>
              <p className="mt-8 font-body text-lg leading-relaxed text-on-primary/80">
                Full access to all features.
              </p>
            </div>

            <div className="mt-12">
              <ul className="space-y-4 border-t border-on-primary/10 pt-8">
                {SPEC_LIST.map((spec) => (
                  <li
                    key={spec.label}
                    className="flex items-center justify-between"
                  >
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-primary/60">
                      {spec.label}
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-widest">
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/editor"
                className="mt-10 block bg-secondary-container py-4 text-center font-label text-xs font-bold uppercase tracking-widest text-on-secondary-container"
              >
                START REMOVING
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise / Self-Host */}
      <section className="bg-surface-container px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              ENTERPRISE
            </p>
            <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] md:text-5xl">
              Self-Host
            </h2>
            <p className="mt-4 max-w-lg font-body text-lg leading-relaxed text-on-surface-variant">
              Run Backgrone on your own infrastructure. Full control,
              full privacy, full ownership.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-primary px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-primary"
          >
            TALK
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Bottom manifesto */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <p className="max-w-lg font-headline text-2xl font-black leading-snug tracking-tight md:text-3xl">
              We believe the best tools should be free.
              Not freemium. Not free-with-limits. Free.
            </p>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-on-surface-variant">
              Backgrone processes everything locally in your browser.
              No servers to pay for means no reason to charge you.
              Quality without compromise, cost without concern.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
            <img
              src="/samples/pricing-hero.jpg"
              alt="Backgrone creator"
              className="h-full w-full object-cover grayscale"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
