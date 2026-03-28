"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { Upload, ShoppingBag, User, Bird, Car } from "lucide-react";
import { setPendingFile } from "@/lib/pending-file";
import { ANIM, fadeInUp } from "@/lib/animations";

const SAMPLE_ITEMS = [
  {
    label: "Person",
    icon: User,
    original: "/samples/portrait-original.jpg",
    result: "/samples/portrait-result.png",
  },
  {
    label: "Product",
    icon: ShoppingBag,
    original: "/samples/headphones-original.jpg",
    result: "/samples/headphones-result.png",
  },
  {
    label: "Animal",
    icon: Bird,
    original: "/samples/dog-original.jpg",
    result: "/samples/parrot-result.png",
  },
  {
    label: "Car",
    icon: Car,
    original: "/samples/car-original.jpg",
    result: "/samples/car-result.png",
  },
] as const;

export function LiveDemo() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0); // default to first sample
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storeFileAndNavigate = useCallback(
    (file: File) => {
      setPendingFile(file);
      router.push("/editor");
    },
    [router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(file.type)) {
        storeFileAndNavigate(file);
      }
    },
    [storeFileAndNavigate]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(file.type)) {
        storeFileAndNavigate(file);
      }
    },
    [storeFileAndNavigate]
  );

  const activeSample = SAMPLE_ITEMS[activeIndex];

  return (
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <div className="mx-auto max-w-4xl">
        {/* Section label */}
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          transition={fadeInUp.transition}
          viewport={ANIM.viewport}
        >
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            SECTION // 02
          </p>
          <h2 className="mt-4 font-headline text-5xl font-black tracking-[-0.04em] md:text-7xl">
            REMOVE BACKGROUND
            <br />
            RIGHT NOW.
          </h2>
        </motion.div>

        {/* Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: ANIM.medium,
            ease: ANIM.smooth,
          }}
          viewport={ANIM.viewport}
          className="mt-12"
        >
          <div className="relative w-full overflow-hidden bg-surface-container-low">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={activeSample.original}
                  alt={`${activeSample.label} original image before background removal`}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f9f9f9",
                  }}
                />
              }
              itemTwo={
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ backgroundColor: "#f9f9f9" }}
                >
                  <img
                    src={activeSample.result}
                    alt={`${activeSample.label} with background removed using AI background remover`}
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              }
              style={{ width: "100%", height: "auto", maxHeight: "500px", aspectRatio: "4/3" }}
            />
            {/* Labels */}
            <div className="absolute bottom-4 left-4 z-10 bg-primary/80 px-3 py-1 font-label text-[9px] uppercase tracking-widest text-white backdrop-blur-sm">
              Before
            </div>
            <div className="absolute bottom-4 right-4 z-10 bg-white/80 px-3 py-1 font-label text-[9px] uppercase tracking-widest text-primary backdrop-blur-sm">
              After
            </div>
          </div>
        </motion.div>

        {/* Sample thumbnails + Upload */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {SAMPLE_ITEMS.map((sample, i) => {
            const Icon = sample.icon;
            return (
              <button
                key={sample.label}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`group flex flex-col items-center gap-2 ${
                  activeIndex === i
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-100"
                } transition-opacity`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center transition-transform group-hover:scale-95 ${
                    activeIndex === i
                      ? "bg-primary"
                      : "bg-surface-container"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      activeIndex === i
                        ? "text-white"
                        : "text-on-surface-variant"
                    }
                  />
                </div>
                <span className="font-label text-[9px] uppercase tracking-widest">
                  {sample.label}
                </span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="h-10 w-px bg-outline-variant/30" />

          {/* Upload your own */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`group flex flex-col items-center gap-2 opacity-60 transition-all hover:opacity-100`}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center border border-dashed transition-all duration-200 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary/10 ${
                isDragging
                  ? "border-secondary bg-secondary/10"
                  : "border-outline-variant"
              }`}
            >
              <Upload size={20} className="text-on-surface-variant transition-colors group-hover:text-primary" />
            </div>
            <span className="font-label text-[9px] uppercase tracking-widest transition-colors group-hover:text-primary">
              Your Image
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}
