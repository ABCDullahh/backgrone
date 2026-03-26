import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How AI Background Removal Works in Your Browser",
  description:
    "Learn how Backgrone removes backgrounds from images using AI locally in your browser. WebAssembly-powered, no upload to servers, 3 AI engines, instant transparent PNG output.",
  alternates: {
    canonical: "https://backgrone.app/how-it-works",
  },
};

const STEPS = [
  {
    num: "01",
    title: "SELECT YOUR IMAGE",
    description:
      "Drag and drop or click to browse. Backgrone supports JPEG, PNG, WebP, and HEIC formats. Your image is read directly into browser memory using the File API — it never touches a server.",
    layout: "left" as const,
    imageSrc:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920",
    imageAlt: "Upload image to free AI background remover tool in browser",
  },
  {
    num: "02",
    title: "AI PROCESSES LOCALLY",
    description:
      "Our neural network runs entirely in your browser via WebAssembly (WASM). Choose from three AI engines — Precision (ISNet fp16), Lightweight (ISNet uint8), or Balanced (RMBG-1.4) — each optimized for different quality and speed requirements.",
    layout: "right" as const,
    imageSrc:
      "https://images.pexels.com/photos/17483869/pexels-photo-17483869.jpeg?auto=compress&cs=tinysrgb&w=1920",
    imageAlt: "AI background removal processing locally in browser via WebAssembly",
  },
  {
    num: "03",
    title: "DOWNLOAD RESULT",
    description:
      "Your transparent PNG is generated instantly. Lossless quality, no watermark, no signup required. The result is yours — we never see it, store it, or process it.",
    layout: "left" as const,
    imageSrc:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920",
    imageAlt: "Download transparent PNG after removing background from image for free",
  },
] as const;

const ENGINES = [
  {
    name: "Precision",
    model: "ISNet fp16",
    size: "~84 MB",
    quality: "Best",
    speed: "Medium",
  },
  {
    name: "Lightweight",
    model: "ISNet uint8",
    size: "~42 MB",
    quality: "Very Good",
    speed: "Fastest",
  },
  {
    name: "Balanced",
    model: "RMBG-1.4",
    size: "~44 MB",
    quality: "Good",
    speed: "Fast",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            THE PROCESS
          </p>
          <h1 className="mt-4 font-headline text-6xl font-black tracking-[-0.04em] md:text-8xl">
            HOW IT
            <br />
            WORKS.
          </h1>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-20">
        <div className="mx-auto max-w-6xl space-y-32">
          {STEPS.map((step) => {
            const isLeft = step.layout === "left";
            return (
              <div
                key={step.num}
                className={`flex flex-col items-center gap-12 md:gap-16 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className="w-full md:w-1/2">
                  <span className="font-headline text-8xl font-black leading-none text-secondary-container">
                    {step.num}
                  </span>
                  <h2 className="mt-6 font-headline text-3xl font-black tracking-[-0.04em] md:text-4xl">
                    {step.title}
                  </h2>
                  <p className="mt-4 max-w-lg font-body text-base leading-relaxed text-on-surface-variant">
                    {step.description}
                  </p>
                </div>

                {/* Step visual */}
                <div className="relative w-full md:w-1/2">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container">
                    <img
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      className="h-full w-full object-cover grayscale"
                      loading="lazy"
                    />
                  </div>
                  <div
                    className={`absolute -bottom-4 ${
                      isLeft ? "-right-4" : "-left-4"
                    } -z-10 h-full w-full bg-surface-container-low`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Deep Dive */}
      <section className="bg-primary px-6 py-24 text-on-primary md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-primary/60">
            TECHNICAL
          </p>
          <h2 className="mt-4 font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
            UNDER THE HOOD.
          </h2>
          <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-on-primary/80">
            Backgrone runs ONNX models via Transformers.js and ONNX Runtime Web.
            Models are downloaded once, cached in IndexedDB, and loaded in under
            200ms on subsequent visits.
          </p>

          {/* Engine comparison table */}
          <div className="mt-16 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-on-primary/20">
                  {["Engine", "Model", "Size", "Quality", "Speed"].map(
                    (header) => (
                      <th
                        key={header}
                        className="pb-4 text-left font-label text-[10px] uppercase tracking-widest text-on-primary/60"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {ENGINES.map((engine) => (
                  <tr
                    key={engine.name}
                    className="border-b border-on-primary/10"
                  >
                    <td className="py-4 font-headline text-lg font-bold">
                      {engine.name}
                    </td>
                    <td className="py-4 font-body text-sm text-on-primary/80">
                      {engine.model}
                    </td>
                    <td className="py-4 font-body text-sm text-on-primary/80">
                      {engine.size}
                    </td>
                    <td className="py-4 font-body text-sm text-on-primary/80">
                      {engine.quality}
                    </td>
                    <td className="py-4 font-body text-sm text-on-primary/80">
                      {engine.speed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Browser compatibility */}
          <div className="mt-16 border-t border-on-primary/10 pt-8">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-primary/60">
              BROWSER COMPATIBILITY
            </p>
            <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-on-primary/80">
              Backgrone requires a modern browser with WebAssembly and SIMD
              support. Chrome 91+, Firefox 89+, Safari 16.4+, and Edge 91+ are
              fully supported. WebGPU acceleration is available in Chrome 113+
              for even faster processing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
            TRY IT YOURSELF.
          </h2>
          <div className="mt-10">
            <Link
              href="/editor"
              className="inline-block bg-secondary-container px-10 py-5 font-label text-xs font-bold uppercase tracking-widest text-on-secondary-container"
            >
              REMOVE BACKGROUND FREE
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
