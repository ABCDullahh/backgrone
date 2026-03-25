import Link from "next/link";
import type { SampleImage } from "@/types";

interface SampleCardProps {
  sample: SampleImage;
}

export function SampleCard({ sample }: SampleCardProps) {

  return (
    <Link href={`/editor?sample=${sample.id}`} className="group relative block overflow-hidden">
      {/* Category badge */}
      <span className="absolute left-3 top-3 z-10 bg-secondary-container px-3 py-1 font-label text-[10px] uppercase tracking-widest text-on-secondary-container">
        {sample.category}
      </span>

      {/* Image area — real sample image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden transition-all duration-500 group-hover:grayscale-0 grayscale-[40%]">
        <img
          src={sample.originalSrc}
          alt={sample.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between border-t-2 border-outline-variant bg-surface-container-lowest px-4 py-3 transition-colors group-hover:bg-surface-container">
        <span className="font-headline text-lg font-bold text-on-surface">
          {sample.name}
        </span>
        <span className="border-b-2 border-primary pb-1 font-label text-[10px] uppercase tracking-widest text-on-surface opacity-0 transition-opacity group-hover:opacity-100">
          Try it yourself &rarr;
        </span>
      </div>
    </Link>
  );
}
