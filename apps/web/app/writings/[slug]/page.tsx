import type { Metadata } from "next";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { notFound } from "next/navigation";
import { instrumentSans, jetbrainsMono } from "@/lib/fonts";
import { absoluteUrl, SITE_AUTHOR, SITE_NAME, siteImages } from "@/lib/site";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";
import { getWritingSections } from "@/lib/writing-headings";
import { WritingThumbnail } from "../writing-thumbnail";
import { WritingMdxContent } from "./writing-mdx-content";
import { WritingShareButton } from "./writing-share-button";
import { WritingMobileToc } from "./writing-mobile-toc";
import { WritingScrollIndicator } from "./writing-scroll-indicator";

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
    const image = absoluteUrl(frontmatter.thumbnail || siteImages.og);

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
            width: 1200,
            height: frontmatter.thumbnail ? 630 : 675,
            alt: frontmatter.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
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
  // Newest first: "previous" is the older post, "next" the newer one.
  const previousWriting = currentIndex >= 0 ? (writings[currentIndex + 1] ?? null) : null;
  const nextWriting = currentIndex > 0 ? writings[currentIndex - 1] : null;
  const sections = getWritingSections(content).filter((section) => section.depth <= 3);
  const readingMinutes = Math.max(1, Math.round(content.split(/\s+/).length / 220));

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
    image: absoluteUrl(frontmatter.thumbnail || siteImages.og),
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
    <div className={`${instrumentSans.variable} ${jetbrainsMono.variable} writing-type`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article id="top">
        <nav aria-label="Writing navigation" className="flex items-center justify-between gap-3 text-sm">
          <Link
            href="/writings"
            className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            All writing
          </Link>
          <WritingShareButton title={frontmatter.title} shareUrl={absoluteUrl(`/writings/${slug}`)} />
        </nav>

        <header className="mt-8">
          <h1 className="text-[1.625rem] leading-tight font-normal tracking-[-0.025em] text-foreground sm:text-[1.875rem] sm:leading-9">
            {frontmatter.title}
          </h1>
          {(frontmatter.subtitle || frontmatter.summary) && (
            <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
              {frontmatter.subtitle || frontmatter.summary}
            </p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            {formattedDate && (
              <>
                <time dateTime={frontmatter.date}>{formattedDate}</time>
                <span aria-hidden> · </span>
              </>
            )}
            {readingMinutes} min read
          </p>
        </header>

        <WritingThumbnail
          title={frontmatter.title}
          thumbnail={frontmatter.thumbnail}
          className="mt-8 rounded-xl border-border bg-code shadow-none"
          viewTransitionName="writing-thumbnail"
        />

        <WritingMdxContent content={content} />
        <div data-writing-end aria-hidden />

        {(previousWriting || nextWriting) && (
          <nav aria-label="More writing" className="mt-14">
            <hr className="mb-6 h-px border-0 bg-[linear-gradient(to_right,var(--muted-foreground)_50%,transparent_0)] bg-size-[4px_1px] opacity-40 mask-x-from-80%" />
            <div className="grid grid-cols-2 gap-6 text-sm">
              {previousWriting ? (
                <AdjacentLink direction="previous" slug={previousWriting.slug} title={previousWriting.frontmatter.title} />
              ) : (
                <span aria-hidden />
              )}
              {nextWriting && (
                <AdjacentLink direction="next" slug={nextWriting.slug} title={nextWriting.frontmatter.title} />
              )}
            </div>
          </nav>
        )}
      </article>

      <WritingScrollIndicator sections={sections} />
      <WritingMobileToc sections={sections} />
    </div>
  );
}

function AdjacentLink({ direction, slug, title }: { direction: "previous" | "next"; slug: string; title: string }) {
  const next = direction === "next";
  const Icon = next ? ArrowRightIcon : ArrowLeftIcon;

  return (
    <Link
      href={`/writings/${slug}`}
      className={`group min-w-0 ${next ? "col-start-2 text-right" : ""}`}
    >
      <span className={`flex items-center gap-1 text-muted-foreground ${next ? "justify-end" : ""}`}>
        {!next && <Icon aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-0.5" />}
        {next ? "Next" : "Previous"}
        {next && <Icon aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
      </span>
      <span className="mt-1 block truncate text-foreground/85 decoration-current/40 underline-offset-4 transition-colors group-hover:text-foreground group-hover:underline">
        {title}
      </span>
    </Link>
  );
}
