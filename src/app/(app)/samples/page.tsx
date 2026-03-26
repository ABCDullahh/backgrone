import type { Metadata } from "next";
import { SampleShowcase } from "@/components/samples/SampleShowcase";
import { EngineArena } from "@/components/samples/EngineArena";

export const metadata: Metadata = {
  title: "Background Removal Examples \u2014 See AI Results",
  description:
    "See real background removal results from Backgrone's AI engines. Compare before and after images for portraits, products, animals, and more. Free AI background remover samples.",
  alternates: {
    canonical: "https://backgrone.app/samples",
  },
};

export default function SamplesPage() {
  return (
    <main className="pt-24 pb-24">
      <SampleShowcase />
      <EngineArena />
    </main>
  );
}
