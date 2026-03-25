import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Backgrone",
  description: "Page not found.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <h1 className="font-headline text-[12rem] font-black leading-none tracking-[-0.04em] md:text-[20rem]">
        404
      </h1>
      <p className="mt-4 font-body text-xl text-on-surface-variant">
        Page not found.
      </p>
      <Link
        href="/"
        className="mt-12 bg-primary px-8 py-4 font-label text-xs font-bold uppercase tracking-widest text-on-primary"
      >
        BACK TO HOME
      </Link>
    </main>
  );
}
