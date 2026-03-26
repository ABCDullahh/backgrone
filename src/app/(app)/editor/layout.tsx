import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Background from Image \u2014 Free Online Tool",
  description:
    "Upload your image and remove the background instantly. 100% free, no signup, runs locally in your browser. Supports PNG, JPG, WebP, HEIC. AI-powered background remover.",
  alternates: {
    canonical: "https://backgrone.app/editor",
  },
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
