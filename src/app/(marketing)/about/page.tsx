import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Backgrone",
  description:
    "The philosophy of removal. Privacy-first, no-cloud AI background removal.",
};

const TECH_CREDITS = [
  {
    name: "ISNet",
    description: "Intermediate Supervision Network for dichotomous image segmentation",
  },
  {
    name: "RMBG-1.4",
    description: "BRIA AI's background removal model trained on 12,000+ images",
  },
  {
    name: "ONNX Runtime Web",
    description: "High-performance ML inference engine for the browser",
  },
  {
    name: "Transformers.js",
    description: "Hugging Face's library for running models in JavaScript",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="relative pt-24">
      {/* Giant watermark */}
      <span className="watermark-text">B</span>

      {/* Hero */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            ABOUT
          </p>
          <h1 className="mt-4 font-headline text-6xl font-black tracking-[-0.04em] md:text-8xl">
            THE PHILOSOPHY
            <br />
            OF REMOVAL.
          </h1>
        </div>
      </section>

      {/* Brand story */}
      <section className="px-6 pb-24 md:px-12 md:pb-32 lg:px-20">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="font-body text-xl leading-relaxed text-on-surface-variant">
            Backgrone exists because we believe image processing should happen
            where your images live — on your device. Not on someone else&apos;s
            server. Not in someone else&apos;s cloud. Not behind someone
            else&apos;s paywall.
          </p>
          <p className="font-body text-xl leading-relaxed text-on-surface-variant">
            Every major background removal tool follows the same pattern: upload
            your image, let their servers process it, download the result. In
            that transaction, your data passes through infrastructure you
            don&apos;t control, under policies you didn&apos;t read, for
            purposes you can&apos;t verify.
          </p>
          <p className="font-body text-xl leading-relaxed text-on-surface-variant">
            We chose a different architecture. WebAssembly and modern ML
            runtimes make it possible to run production-quality neural networks
            entirely in the browser. No uploads. No servers. No cloud. The AI
            comes to your data, not the other way around.
          </p>
          <p className="font-body text-xl leading-relaxed text-on-surface-variant">
            The result is a tool that is private by architecture, not by
            promise. We can&apos;t see your images because there is literally no
            mechanism for us to receive them. That&apos;s not a policy
            decision — it&apos;s a technical fact.
          </p>
        </div>
      </section>

      {/* Tech acknowledgments */}
      <section className="bg-surface-container px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            BUILT WITH
          </p>
          <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] md:text-5xl">
            STANDING ON SHOULDERS.
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TECH_CREDITS.map((tech) => (
              <div key={tech.name} className="border-l-4 border-secondary-container pl-6">
                <h3 className="font-headline text-xl font-bold">{tech.name}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            CONTACT
          </p>
          <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] md:text-5xl">
            LET&apos;S TALK.
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-on-surface-variant">
            Questions, ideas, collaborations, or just want to say hello.
          </p>
          <a
            href="mailto:hello@backgrone.app"
            className="mt-4 inline-block font-headline text-2xl font-bold underline decoration-secondary-container decoration-2 underline-offset-4 hover:decoration-secondary"
          >
            hello@backgrone.app
          </a>
        </div>
      </section>
    </main>
  );
}
