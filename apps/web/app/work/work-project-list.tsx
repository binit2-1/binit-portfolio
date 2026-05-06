"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GithubLogoIcon, GlobeHemisphereWestIcon } from "@phosphor-icons/react/dist/ssr";
import type { WorkProject } from "./work-project-types";

type WorkProjectListProps = {
  projects: WorkProject[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

function ProjectActionLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  const sharedClassName =
    "inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/45 transition-colors hover:bg-foreground/8 hover:text-foreground/85 dark:hover:bg-white/8";

  if (!href) {
    return (
      <span className={`${sharedClassName} cursor-not-allowed opacity-30`} aria-hidden title={`${label} link pending`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={sharedClassName}
    >
      {children}
    </Link>
  );
}

function WorkProjectRow({
  project,
  isActive,
  onMouseEnter,
  index,
}: {
  project: WorkProject;
  isActive: boolean;
  onMouseEnter: () => void;
  index: number;
}) {
  return (
    <li
      data-work-index={index}
      className={`group flex min-h-11 cursor-pointer select-none items-center gap-1.5 rounded-xl border px-1 py-0.5 text-[16px] leading-6 transition-[background-color,border-color,color,box-shadow] duration-200 ${
        isActive
          ? "border-foreground/12 bg-foreground/7 text-foreground shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/10 dark:shadow-none"
          : "border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5 hover:text-foreground dark:hover:border-white/8 dark:hover:bg-white/5"
      }`}
      onMouseEnter={onMouseEnter}
    >
      <p className="min-w-0 shrink pl-2.5 truncate whitespace-nowrap leading-6">
        <span className={isActive ? "font-medium text-foreground" : "font-medium text-foreground/90"}>
          {project.title}
        </span>
        <span className="hidden text-foreground/40 md:inline"> {project.description}</span>
      </p>
      <span className="h-px min-w-24 flex-1 bg-foreground/10 dark:bg-white/12" aria-hidden />
      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        <ProjectActionLink href={project.githubUrl} label={`${project.title} GitHub`}>
          <GithubLogoIcon size={16} weight="regular" />
        </ProjectActionLink>
        <ProjectActionLink href={project.liveUrl} label={`${project.title} Live`}>
          <GlobeHemisphereWestIcon size={16} weight="regular" />
        </ProjectActionLink>
      </div>
    </li>
  );
}

export function WorkProjectList({ projects, activeIndex: activeIndexProp, onActiveIndexChange }: WorkProjectListProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);
  const activeIndexRef = useRef(0);
  const isControlled = typeof activeIndexProp === "number";
  const maxIndex = Math.max(0, projects.length - 1);
  const activeIndex = projects.length === 0 ? -1 : Math.max(0, Math.min(activeIndexProp ?? internalActiveIndex, maxIndex));

  useEffect(() => {
    if (activeIndex >= 0) {
      activeIndexRef.current = activeIndex;
    }
  }, [activeIndex]);

  const commitActiveIndex = useCallback(
    (nextIndex: number) => {
      if (projects.length === 0) return;

      const clamped = Math.max(0, Math.min(nextIndex, maxIndex));

      if (!isControlled) {
        setInternalActiveIndex(clamped);
      }

      onActiveIndexChange?.(clamped);
      const target = listRef.current?.querySelector<HTMLLIElement>(`[data-work-index="${clamped}"]`);
      target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    [isControlled, maxIndex, onActiveIndexChange, projects.length],
  );

  const moveActiveBy = useCallback(
    (delta: number) => {
      if (projects.length === 0) return;
      commitActiveIndex(activeIndexRef.current + delta);
    },
    [commitActiveIndex, projects.length],
  );

  useEffect(() => {
    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (document.querySelector("[data-work-video-modal='true']")) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActiveBy(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActiveBy(-1);
      }
    };

    document.addEventListener("keydown", onDocumentKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onDocumentKeyDown, { capture: true });
  }, [moveActiveBy]);

  return (
    <ul
      ref={listRef}
      className="mx-auto w-full max-w-(--writing-content-width) space-y-0.5 outline-none"
      tabIndex={0}
      aria-label="Projects list"
    >
      {projects.map((project, index) => (
        <WorkProjectRow
          key={project.title}
          project={project}
          index={index}
          isActive={index === activeIndex}
          onMouseEnter={() => commitActiveIndex(index)}
        />
      ))}
    </ul>
  );
}
