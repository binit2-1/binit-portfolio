import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { WorkPageContent } from "./work-page-content";
import { WorkOrangeLine } from "./work-orange-line";
import { WORK_PROJECTS } from "./work-projects";

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
  },
};

export default function WorkPage() {
  const isScrollable = WORK_PROJECTS.length > 5;

  return (
    <>
      <WorkPageContent projects={WORK_PROJECTS} isScrollable={isScrollable} />
      <WorkOrangeLine />
    </>
  );
}
