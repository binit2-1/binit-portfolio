import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, SITE_AUTHOR, SITE_NAME, siteImages } from "@/lib/site";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";
import { getWritingSections } from "@/lib/writing-headings";
import { WritingThumbnail } from "../writing-thumbnail";
import { ProgressiveBlur } from "./progressive-blur";
import { WritingMdxContent } from "./writing-mdx-content";
import { WritingProgressToc } from "./writing-progress-toc";
import { WritingSectionDot } from "./writing-section-dot";
import { WritingShareButton } from "./writing-share-button";

export async function generateStaticParams() {
  return getAllWritings().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getWritingBySlug(slug);
    const description = frontmatter.summary || frontmatter.subtitle;
    const image = absoluteUrl(frontmatter.thumbnail || siteImages.logo);

    return {
      title: frontmatter.title,
      description,
      alternates: {
        canonical: absoluteUrl(`/writings/${slug}`),
      },
      openGraph: {
        type: "article",
        title: frontmatter.title,
        description,
        url: `/writings/${slug}`,
        siteName: SITE_NAME,
        publishedTime: frontmatter.date || undefined,
        authors: [SITE_AUTHOR.name],
        images: [
          {
            url: image,
            width: frontmatter.thumbnail ? 1200 : 512,
            height: frontmatter.thumbnail ? 630 : 512,
            alt: frontmatter.title,
          },
        ],
      },
      twitter: {
        card: frontmatter.thumbnail ? "summary_large_image" : "summary",
        title: frontmatter.title,
        description,
        images: [
          {
            url: image,
            alt: frontmatter.title,
          },
        ],
        creator: "@BinitGupta21",
      },
    };
  } catch {
    return {};
  }
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getWritingBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = post;
  const writings = getAllWritings();
  const currentIndex = writings.findIndex((writing) => writing.slug === slug);
  const previousWriting =
    currentIndex >= 0 && writings.length > 1
      ? writings[(currentIndex - 1 + writings.length) % writings.length]
      : null;
  const nextWriting =
    currentIndex >= 0 && writings.length > 1
      ? writings[(currentIndex + 1) % writings.length]
      : null;
  const sections = [
    { id: "top", title: frontmatter.title, depth: 1 as const },
    ...getWritingSections(content),
  ];

  const formattedDate = frontmatter.date
    ? new Date(frontmatter.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.summary || frontmatter.subtitle,
    datePublished: frontmatter.date || undefined,
    dateModified: frontmatter.date || undefined,
    image: absoluteUrl(frontmatter.thumbnail || siteImages.logo),
    url: absoluteUrl(`/writings/${slug}`),
    author: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      image: absoluteUrl(siteImages.logo),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ProgressiveBlur position="top" height="130px" blurAmount="5px" />
      <ProgressiveBlur position="bottom" height="170px" blurAmount="6px" />

      <article
        id="top"
        data-writing-article="true"
        className="relative mx-auto w-full max-w-(--writing-content-width) pb-28 pt-8 sm:pt-10"
      >
        <WritingSectionDot />

        <nav className="mb-8 flex items-center justify-between gap-3 text-sm text-muted-foreground" aria-label="Writing navigation">
          <Link
            href="/writings"
            className="rounded-sm px-0 py-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Back
          </Link>
          <WritingShareButton
            title={frontmatter.title}
            shareUrl={absoluteUrl(`/writings/${slug}`)}
          />
        </nav>

        <header>
          <WritingThumbnail
            title={frontmatter.title}
            thumbnail={frontmatter.thumbnail}
            className="rounded-md"
            viewTransitionName="writing-thumbnail"
          />

          <div className="mt-7 flex flex-col gap-3">
            {formattedDate ? (
              <time className="text-xs font-medium tracking-[0.12em] text-[#FF5800]/85 uppercase">{formattedDate}</time>
            ) : null}
            <h1
              data-writing-section-heading="true"
              data-writing-section-id="top"
              className="font-display text-4xl leading-[1.05] tracking-normal text-foreground sm:text-5xl"
            >
              {frontmatter.title}
            </h1>
            <p className="max-w-2xl font-sans text-base leading-7 text-muted-foreground sm:text-lg">
              {frontmatter.subtitle || frontmatter.summary}
            </p>
          </div>

          <div className="mt-7 h-px w-full bg-border" aria-hidden />
        </header>

        <WritingMdxContent content={content} />

        {(previousWriting || nextWriting) ? (
          <nav
            className="mt-14 grid grid-cols-2 gap-3 border-t border-border pt-5 text-[11px] text-muted-foreground sm:text-sm"
            aria-label="Adjacent writings"
          >
            {previousWriting ? (
              <Link
                href={`/writings/${previousWriting.slug}`}
                className="group min-w-0 rounded-sm text-left transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Previous blog: ${previousWriting.frontmatter.title}`}
              >
                <span className="block text-[9px] uppercase tracking-[0.1em] text-muted-foreground/70 sm:text-xs sm:tracking-[0.12em]">Previous blog</span>
                <span className="mt-1 block truncate text-[11px] text-foreground/85 group-hover:text-foreground sm:text-sm">
                  {previousWriting.frontmatter.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden />
            )}
            {nextWriting ? (
              <Link
                href={`/writings/${nextWriting.slug}`}
                className="group min-w-0 rounded-sm text-right transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Next blog: ${nextWriting.frontmatter.title}`}
              >
                <span className="block text-[9px] uppercase tracking-[0.1em] text-muted-foreground/70 sm:text-xs sm:tracking-[0.12em]">Next blog</span>
                <span className="mt-1 block truncate text-[11px] text-foreground/85 group-hover:text-foreground sm:text-sm">
                  {nextWriting.frontmatter.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>

      <WritingProgressToc title={frontmatter.title} sections={sections} />
    </>
  );
}
