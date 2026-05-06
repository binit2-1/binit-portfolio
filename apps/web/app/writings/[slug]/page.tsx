import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";
import { getWritingSections } from "@/lib/writing-headings";
import { WritingThumbnail } from "../writing-thumbnail";
import { ProgressiveBlur } from "./progressive-blur";
import { WritingMdxContent } from "./writing-mdx-content";
import { WritingProgressToc } from "./writing-progress-toc";
import { WritingSectionDot } from "./writing-section-dot";

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
    return { title: frontmatter.title, description: frontmatter.summary || frontmatter.subtitle };
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

  return (
    <>
      <ProgressiveBlur position="top" height="130px" blurAmount="5px" />
      <ProgressiveBlur position="bottom" height="170px" blurAmount="6px" />

      <article
        id="top"
        data-writing-article="true"
        className="relative mx-auto w-full max-w-(--writing-content-width) pb-28 pt-8 sm:pt-10"
      >
        <WritingSectionDot />

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
      </article>

      <WritingProgressToc title={frontmatter.title} sections={sections} />
    </>
  );
}
