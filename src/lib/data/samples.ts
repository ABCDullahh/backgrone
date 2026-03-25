import type { SampleImage } from "@/types";

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: "product-1",
    category: "product",
    name: "Vintage Clock",
    originalSrc: "/samples/watch-original.jpg",
    resultSrc: "/samples/watch-result.png",
  },
  {
    id: "product-2",
    category: "product",
    name: "Gold Watch",
    originalSrc: "/samples/watch2-original.jpg",
    resultSrc: "/samples/watch2-result.png",
  },
  {
    id: "people-1",
    category: "people",
    name: "Portrait",
    originalSrc: "/samples/portrait-original.jpg",
    resultSrc: "/samples/portrait-result.png",
  },
  {
    id: "people-2",
    category: "people",
    name: "Fashion",
    originalSrc: "/samples/fashion-original.jpg",
    resultSrc: "/samples/fashion-result.png",
  },
  {
    id: "people-3",
    category: "people",
    name: "Street Style",
    originalSrc: "/samples/fashion2-original.jpg",
    resultSrc: "/samples/fashion2-result.png",
  },
  {
    id: "animal-1",
    category: "animal",
    name: "Macaw Parrot",
    originalSrc: "/samples/dog-original.jpg",
    resultSrc: "/samples/parrot-result.png",
  },
  {
    id: "animal-2",
    category: "animal",
    name: "Cat",
    originalSrc: "/samples/cat-original.jpg",
    resultSrc: "/samples/cat-result.png",
  },
  {
    id: "car-1",
    category: "car",
    name: "Classic Plymouth",
    originalSrc: "/samples/car-original.jpg",
    resultSrc: "/samples/car-result.png",
  },
  {
    id: "product-3",
    category: "product",
    name: "Headphones",
    originalSrc: "/samples/headphones-original.jpg",
    resultSrc: "/samples/headphones-result.png",
  },
  {
    id: "graphic-1",
    category: "graphic",
    name: "Logo",
    originalSrc: "/samples/logo-original.jpg",
    resultSrc: "/samples/logo-result.png",
  },
];

export const CATEGORIES = [
  "all",
  "product",
  "people",
  "animal",
  "car",
  "graphic",
] as const;

export type Category = (typeof CATEGORIES)[number];
