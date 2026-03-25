"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/samples", label: "Samples" },
  { href: "/editor", label: "Tools" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="font-headline text-2xl font-black uppercase tracking-[-0.04em]"
        >
          BACKGRONE
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? "border-b-2 border-black pb-1 text-sm font-medium text-black"
                    : "pb-1 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
                }
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/editor"
            className="hidden bg-primary px-6 py-2 font-label text-xs font-bold uppercase tracking-widest text-on-primary md:inline-block"
          >
            GET STARTED
          </Link>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-outline-variant/20 bg-white/90 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    isActive
                      ? "border-b-2 border-black pb-1 text-sm font-medium text-black"
                      : "pb-1 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
                  }
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/editor"
              onClick={() => setMobileOpen(false)}
              className="mt-2 bg-primary px-6 py-3 text-center font-label text-xs font-bold uppercase tracking-widest text-on-primary"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
