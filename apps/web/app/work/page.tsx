import type { Metadata } from "next";
import { WorkPageContent } from "./work-page-content";
import { WorkOrangeLine } from "./work-orange-line";
import { WORK_PROJECTS } from "./work-projects";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  const isScrollable = WORK_PROJECTS.length > 5;

  return (
    <>
      <WorkPageContent projects={WORK_PROJECTS} isScrollable={isScrollable} />
      <WorkOrangeLine />
    </>
  );
}
