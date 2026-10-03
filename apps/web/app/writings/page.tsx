import type { Metadata } from "next";
import { HoverPreviewList } from "@/components/hover-preview";
import { PageHeader } from "@/components/prose";
import { WritingListRow } from "@/components/list-rows";
import { getWritingPreviewMedia } from "@/lib/previews";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, PERSON_ID, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { getWritingPreviews } from "@/lib/writings";

export const metadata: Metadata = pageMetadata({
  title: "Writings",
  description:
    "Articles by Binit Gupta on full-stack web development: authentication with Next.js and Go, debouncing in React, and lessons from building real projects.",
  path: "/writings",
});

export default function WritingsPage() {
  const writings = getWritingPreviews();

  return (
    <>
      <JsonLd
        nodes={[
          {
            "@type": "Blog",
            "@id": `${absoluteUrl("/writings")}#blog`,
            url: absoluteUrl("/writings"),
            name: "Writings by Binit Gupta",
            author: { "@id": PERSON_ID },
            blogPost: writings.map((writing) => ({
              "@type": "BlogPosting",
              headline: writing.title,
              description: writing.subtitle,
              url: absoluteUrl(writing.href),
              ...(writing.date && { datePublished: writing.date }),
              author: { "@id": PERSON_ID },
            })),
          },
          breadcrumbSchema([{ name: "Writings", path: "/writings" }]),
        ]}
      />
      <PageHeader title="Writings">How I perceive technology and its impact on design and development.</PageHeader>

      <HoverPreviewList media={getWritingPreviewMedia(writings)} className="mt-8">
        <ul aria-label="Writing">
          {writings.map((writing) => (
            <WritingListRow key={writing.slug} writing={writing} />
          ))}
        </ul>
      </HoverPreviewList>
    </>
  );
}
