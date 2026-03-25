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
    </main>
  );
}
