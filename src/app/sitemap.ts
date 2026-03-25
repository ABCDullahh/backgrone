import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const blogEntries = posts.map((post) => ({
    url: `https://backgrone.app/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    { url: "https://backgrone.app", lastModified: new Date() },
    { url: "https://backgrone.app/editor", lastModified: new Date() },
    { url: "https://backgrone.app/samples", lastModified: new Date() },
    { url: "https://backgrone.app/pricing", lastModified: new Date() },
    { url: "https://backgrone.app/how-it-works", lastModified: new Date() },
    { url: "https://backgrone.app/about", lastModified: new Date() },
    { url: "https://backgrone.app/blog", lastModified: new Date() },
    { url: "https://backgrone.app/privacy", lastModified: new Date() },
    { url: "https://backgrone.app/terms", lastModified: new Date() },
    { url: "https://backgrone.app/video", lastModified: new Date() },
    ...blogEntries,
  ];
}
