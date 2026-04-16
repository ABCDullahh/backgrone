import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog \u2014 AI Background Removal Tips & Guides",
  description:
    "Articles on AI background removal, WebAssembly-powered image processing, privacy-first design, and tips for removing backgrounds from images. Backgrone journal.",
  alternates: {
    canonical: "https://backgrone.abcdullahh.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts[0] ?? null;
  const recent = posts.slice(1);

  if (posts.length === 0) {
    return (
      <main className="pt-24">
        <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              EDITORIAL
            </p>
            <h1 className="mt-4 font-headline text-6xl font-black tracking-[-0.04em] md:text-8xl">
              THE JOURNAL.
            </h1>
            <p className="mt-12 font-body text-xl text-on-surface-variant">
              No posts yet. Check back soon.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-24">
      {/* Header */}
      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            EDITORIAL
          </p>
          <h1 className="mt-4 font-headline text-6xl font-black tracking-[-0.04em] md:text-8xl">
            THE JOURNAL.
          </h1>
        </div>
      </section>

      {/* Editorial grid */}
      <section className="px-6 pb-32 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-12">
          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group col-span-1 md:col-span-7"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-surface-container">
                {featured.thumbnail && (
                  <Image
                    src={featured.thumbnail}
                    alt={featured.title}
                    width={1200}
                    height={750}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                )}
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                    {featured.category}
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {featured.date}
                  </span>
                </div>
                <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-3 max-w-lg font-body text-base leading-relaxed text-on-surface-variant">
                  {featured.excerpt}
                </p>
                <span className="mt-4 inline-block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {featured.readingTime}
                </span>
              </div>
            </Link>
          )}

          {/* Recent posts stacked */}
          <div className="col-span-1 flex flex-col gap-8 md:col-span-5">
            {recent.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-surface-container">
                  {post.thumbnail && (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      width={1200}
                      height={675}
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-4">
                    <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                      {post.category}
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="mt-2 font-headline text-xl font-bold tracking-tight">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-on-surface-variant">
                    {post.excerpt}
                  </p>
                  <span className="mt-2 inline-block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {post.readingTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
