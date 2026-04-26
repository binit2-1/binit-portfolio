"use client";

import { useCallback, useState } from "react";
import { WorkProjectList } from "./work-project-list";
import { WorkProjectSpotlight } from "./work-project-spotlight";
import type { WorkProject } from "./work-project-types";

type WorkPageContentProps = {
  projects: WorkProject[];
  isScrollable: boolean;
};

export function WorkPageContent({ projects, isScrollable }: WorkPageContentProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = Math.max(0, projects.length - 1);
  const safeActiveIndex = projects.length === 0 ? -1 : Math.max(0, Math.min(activeIndex, maxIndex));

  const handleActiveIndexChange = useCallback(
    (nextIndex: number) => {
      if (projects.length === 0) return;
      setActiveIndex(Math.max(0, Math.min(nextIndex, maxIndex)));
    },
    [maxIndex, projects.length],
  );

  return (
    <>
      <WorkProjectSpotlight projects={projects} activeIndex={safeActiveIndex} />

      <section
        className={`mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 ${isScrollable ? "h-dvh overflow-y-auto" : "h-auto overflow-visible"}`}
        style={{ paddingTop: "calc(var(--about-fixed-line-top, 20vh) + 6px)" }}
      >
        <h1 className="sr-only">Work</h1>
        <WorkProjectList
          projects={projects}
          activeIndex={safeActiveIndex}
          onActiveIndexChange={handleActiveIndexChange}
        />
      </section>
    </>
  );
}
