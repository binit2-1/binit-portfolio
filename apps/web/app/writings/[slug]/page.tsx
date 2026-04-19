import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";

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
    return { title: frontmatter.title, description: frontmatter.summary };
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

  return (
    <article className="flex flex-col gap-8 pt-28">
      <header className="flex flex-col gap-2">
        <time className="text-xs text-muted-foreground">
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="text-3xl font-bold tracking-tight">{frontmatter.title}</h1>
        <p className="text-muted-foreground">{frontmatter.summary}</p>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </article>
  );
}
