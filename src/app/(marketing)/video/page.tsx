import type { Metadata } from "next";
import Link from "next/link";
import { Play, Camera, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Video BG Removal — Backgrone",
  description:
    "Video background removal is coming to Backgrone. Real-time preview, webcam support, MP4/WEBM export.",
};

const PLANNED_FEATURES = [
  {
    icon: Play,
    title: "Real-time Preview",
    description:
      "See the background removal applied live as your video plays. Frame-by-frame accuracy with temporal consistency.",
  },
  {
    icon: Camera,
    title: "Webcam Support",
    description:
      "Remove your background in real-time from your webcam feed. Perfect for video calls and content creation.",
  },
  {
    icon: Download,
    title: "Export MP4 / WEBM",
    description:
      "Download your processed video in industry-standard formats. Lossless alpha channel support via WEBM.",
  },
] as const;

export default function VideoPage() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary">
            COMING SOON
          </p>
          <h1 className="mt-4 font-headline text-6xl font-black tracking-[-0.04em] md:text-8xl">
            VIDEO
            <br />
            BACKGROUND
            <br />
            REMOVAL.
          </h1>
        </div>
      </section>

      {/* Mockup area with grain */}
      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="relative aspect-video w-full overflow-hidden bg-surface-container">
            {/* Static grain texture overlay — no animation to prevent rerender jank */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: "256px 256px",
              }}
            />
            {/* Badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-primary px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-primary">
                COMING Q3 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Planned features */}
      <section className="bg-surface-container px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            PLANNED FEATURES
          </p>
          <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] md:text-5xl">
            WHAT&apos;S COMING.
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {PLANNED_FEATURES.map((feature) => (
              <div key={feature.title}>
                <feature.icon className="size-8 text-secondary" />
                <h3 className="mt-6 font-headline text-2xl font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 font-body text-base leading-relaxed text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <Link
            href="/blog"
            className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
          >
            Follow our blog for updates &rarr;
          </Link>
          <Link
            href="/editor"
            className="inline-block bg-secondary-container px-10 py-5 font-label text-xs font-bold uppercase tracking-widest text-on-secondary-container"
          >
            TRY OUR IMAGE REMOVER
          </Link>
        </div>
      </section>
    </main>
  );
}
