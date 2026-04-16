import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://backgrone.abcdullahh.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="pt-24">
      <article className="mx-auto max-w-3xl px-8 py-32">
        {/* Header */}
        <div className="mb-16">
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
            {post.category}
          </span>
          <h1 className="mt-4 font-headline text-4xl font-black tracking-[-0.04em] md:text-6xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              {post.date}
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              {post.readingTime}
            </span>
          </div>
        </div>

        {/* Hero image */}
        {post.thumbnail && (
          <div className="mb-16 aspect-[16/9] w-full overflow-hidden rounded-lg bg-surface-container">
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={1200}
              height={675}
              className="h-full w-full object-cover"
              preload
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none font-body text-on-surface-variant prose-headings:font-headline prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-on-surface prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-secondary prose-a:underline prose-strong:text-on-surface prose-table:border-collapse prose-th:border-b prose-th:border-outline-variant prose-th:pb-2 prose-th:text-left prose-th:font-label prose-th:text-[10px] prose-th:uppercase prose-th:tracking-widest prose-td:border-b prose-td:border-outline-variant/40 prose-td:py-2">
          <MDXRemote source={post.content} />
        </div>

        {/* Back link */}
        <div className="mt-24 border-t border-outline-variant pt-8">
          <Link
            href="/blog"
            className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
          >
            &larr; Back to Journal
          </Link>
        </div>
      </article>
    </main>
  );
}
