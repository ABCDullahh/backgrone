import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-8 py-12 md:flex-row md:justify-between">
        {/* Brand */}
        <span className="font-label text-[10px] uppercase tracking-widest">
          BACKGRONE
        </span>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-label text-[10px] uppercase tracking-widest text-neutral-400 transition-colors hover:text-black"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <span className="font-label text-[10px] uppercase tracking-widest text-neutral-400">
          &copy; {new Date().getFullYear()} Backgrone. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
