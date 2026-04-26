"use client";

import type { WorkProject } from "./work-project-types";
import { WorkProjectHeading } from "./work-project-heading";
import { WorkProjectVideoPlayer } from "./work-project-video-player";

type WorkProjectSpotlightProps = {
  projects: WorkProject[];
  activeIndex: number;
};

export function WorkProjectSpotlight({ projects, activeIndex }: WorkProjectSpotlightProps) {
  if (projects.length === 0) return null;

  const currentProject = projects[Math.max(0, Math.min(activeIndex, projects.length - 1))];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[81]"
      style={{
        top: "var(--site-nav-h, 0px)",
        height: "max(0px, calc(var(--about-fixed-line-top, 20vh) - var(--site-nav-h, 0px)))",
      }}
    >
      <div className="mx-auto grid h-full w-full max-w-5xl grid-cols-[minmax(0,32vw)_1fr] items-end gap-5 px-4 pb-2 sm:px-6 md:grid-cols-[minmax(0,15rem)_1fr]">
        <div className="pointer-events-auto">
          <WorkProjectVideoPlayer video={currentProject.video} />
        </div>
        <WorkProjectHeading
          activeIndex={activeIndex}
          label={currentProject.spotlightLabel || currentProject.title.toUpperCase()}
        />
      </div>
    </div>
  );
}
