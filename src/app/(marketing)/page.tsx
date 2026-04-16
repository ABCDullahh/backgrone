import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { Manifesto } from "@/components/landing/Manifesto";
import { LiveDemo } from "@/components/landing/LiveDemo";
import { Features } from "@/components/landing/Features";
import { UseCases } from "@/components/landing/UseCases";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Stats } from "@/components/landing/Stats";
import { CTA } from "@/components/landing/CTA";
import { ComingSoon } from "@/components/landing/ComingSoon";
import { FAQ } from "@/components/landing/FAQ";

export const metadata: Metadata = {
  title:
    "Free AI Background Remover \u2014 Remove Background Online, 100% Private",
  description:
    "Remove background from images online for free using AI. No upload to servers, no signup, no watermark. Private client-side background removal powered by WebAssembly. Supports PNG, JPG, WebP, HEIC.",
  alternates: {
    canonical: "https://backgrone.abcdullahh.com",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is background removal really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Backgrone is a completely free background remover with no signup, no watermarks, and no usage limits. All processing happens locally in your browser, so there are no server costs to pass on to you.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private when I remove backgrounds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Backgrone runs 100% in your browser using WebAssembly and WebGPU. Your images are never uploaded to any server. There is no backend, no cloud processing, and no analytics on your content. Privacy is guaranteed by architecture, not by policy.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats are supported for background removal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Backgrone supports JPEG, PNG, WebP, and HEIC input formats. Output is always a transparent PNG at the original resolution with no quality loss.",
      },
    },
    {
      "@type": "Question",
      name: "Can I remove backgrounds from multiple images at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can batch process up to 20 images at once. They are processed sequentially in your browser and you can download them all as a single ZIP file.",
      },
    },
    {
      "@type": "Question",
      name: "Which AI engine should I use for background removal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Backgrone offers 3 AI engines: Precision (ISNet fp16) for best quality, Lightweight (ISNet uint8) for fastest processing, and Balanced (RMBG-1.4) for optimal speed-quality balance. Start with Precision for the most accurate background removal results.",
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <main className="pt-24">
      <Hero />
      <Manifesto />
      <LiveDemo />
      <Features />
      <UseCases />
      <HowItWorks />
      <Stats />
      <CTA />
      <ComingSoon />
      <FAQ />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </main>
  );
}
