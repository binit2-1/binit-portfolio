import type { Metadata } from "next";
import { HoverPreviewList } from "@/components/hover-preview";
import { ProjectRow } from "@/components/list-rows";
import { getProjectPreviews } from "@/lib/previews";
import { PROJECTS } from "@/lib/projects";
import { absoluteUrl, siteImages } from "@/lib/site";

const description = "Selected projects by Binit Gupta, including React tools, hackathon products, and AI workflow experiments.";

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: {
    canonical: absoluteUrl("/work"),
  },
  openGraph: {
    title: "Work by Binit Gupta",
    description,
    url: "/work",
    images: [
      {
        url: siteImages.og,
        width: 1200,
        height: 675,
        alt: "Work by Binit Gupta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work by Binit Gupta",
    description,
    images: [siteImages.og],
    creator: "@BinitGupta21",
  },
};

export default async function WorkPage() {
  const media = await getProjectPreviews(PROJECTS);

  return (
    <>
      <header>
        <h1 className="text-3xl leading-tight font-normal tracking-[-0.02em] sm:text-4xl">Work</h1>
        <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
          Things I&apos;ve built, from developer tools to hackathon products.
        </p>
      </header>

      <HoverPreviewList media={media} className="mt-8">
        <ul aria-label="Projects">
          {PROJECTS.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </ul>
      </HoverPreviewList>
    </>
  );
}
