import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getAllWritings } from "@/lib/writings";

/** Every indexable page. Keep in sync with real routes (a wrong URL here sends Google to a 404). */
export default function sitemap(): MetadataRoute.Sitemap {
  const writings = getAllWritings();
  const latestPost = writings[0]?.frontmatter.date ? new Date(writings[0].frontmatter.date) : new Date();
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/works"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/writings"), lastModified: latestPost, changeFrequency: "weekly", priority: 0.8 },
  ];

  const posts = writings.map(({ slug, frontmatter }) => ({
    url: absoluteUrl(`/writings/${slug}`),
    lastModified: frontmatter.date ? new Date(frontmatter.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...(frontmatter.thumbnail && { images: [absoluteUrl(frontmatter.thumbnail)] }),
  }));

  return [...pages, ...posts];
}
