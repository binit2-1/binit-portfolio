"use client";

import type { WorkProject } from "./work-project-types";
import { WorkProjectHeading } from "./work-project-heading";
import { WorkProjectVideoPlayer } from "./work-project-video-player";

type WorkProjectSpotlightProps = {
  projects: WorkProject[];
  activeIndex: number;
  openSignal?: number;
};

export function WorkProjectSpotlight({ projects, activeIndex, openSignal }: WorkProjectSpotlightProps) {
  if (projects.length === 0) return null;

  const currentProject = projects[Math.max(0, Math.min(activeIndex, projects.length - 1))];
  const spotlightGridClassName =
    "mx-auto grid h-full w-full max-w-3xl grid-cols-[minmax(0,8.25rem)_minmax(0,1fr)] items-end gap-3 px-4 pb-4 sm:grid-cols-[minmax(0,11rem)_1fr] sm:px-6 md:grid-cols-[minmax(0,12rem)_1fr] md:gap-4 md:pb-5";

  return (
    <div
      className="pointer-events-none fixed inset-x-0"
      style={{
        top: "var(--site-nav-h, 0px)",
        height: "max(0px, calc(var(--about-fixed-line-top, 20vh) - var(--site-nav-h, 0px)))",
      }}
    >
      <div className="absolute inset-0 z-[100]">
        <div className={spotlightGridClassName}>
          <div className="pointer-events-auto relative z-10">
            <WorkProjectVideoPlayer video={currentProject.video} openSignal={openSignal} />
          </div>
          <div aria-hidden />
        </div>
      </div>

      <div className="absolute inset-0 z-[90]">
        <div className={spotlightGridClassName}>
          <div aria-hidden />
          <WorkProjectHeading
            activeIndex={activeIndex}
            label={currentProject.spotlightLabel || currentProject.title.toUpperCase()}
          />
        </div>
      </div>
    </div>
  );
}
