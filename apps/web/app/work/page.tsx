import type { Metadata } from "next";
import { WorkPageContent } from "./work-page-content";
import { WORK_PROJECTS } from "./work-projects";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  const isScrollable = WORK_PROJECTS.length > 5;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bg-background"
        style={{
          top: "var(--site-nav-h, 0px)",
          height: "max(0px, calc(var(--about-fixed-line-top, 20vh) - var(--site-nav-h, 0px)))",
          zIndex: 70,
        }}
        aria-hidden
      />

      <WorkPageContent projects={WORK_PROJECTS} isScrollable={isScrollable} />

      <div
        className="pointer-events-none fixed inset-x-0"
        style={{ top: "var(--about-fixed-line-top, 20vh)", zIndex: 80 }}
        aria-hidden
      >
        <div
          className="w-full bg-[#FF5800]"
          style={{ height: "1px", transform: "scaleY(0.5)", transformOrigin: "center" }}
        />
      </div>
    </>
  );
}
