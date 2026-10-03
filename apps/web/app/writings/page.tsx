import type { Metadata } from "next";
import { HoverPreviewList } from "@/components/hover-preview";
import { WritingListRow } from "@/components/list-rows";
import { getWritingPreviewMedia } from "@/lib/previews";
import { absoluteUrl, siteImages } from "@/lib/site";
import { getWritingPreviews } from "@/lib/writings";

const description = "Notes by Binit Gupta on interface design, frontend craft, product work, and building smoother web experiences.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: {
    canonical: absoluteUrl("/writings"),
  },
  openGraph: {
    title: "Writings by Binit Gupta",
    description,
    url: "/writings",
    images: [
      {
        url: siteImages.og,
        width: 1200,
        height: 675,
        alt: "Writings by Binit Gupta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writings by Binit Gupta",
    description,
    images: [siteImages.og],
    creator: "@BinitGupta21",
  },
};

export default function WritingsPage() {
  const writings = getWritingPreviews();

  return (
    <>
      <header>
        <h1 className="text-3xl leading-tight font-normal tracking-[-0.02em] sm:text-4xl">Writings</h1>
        <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
          How I perceive technology and its impact on design and development.
        </p>
      </header>

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
