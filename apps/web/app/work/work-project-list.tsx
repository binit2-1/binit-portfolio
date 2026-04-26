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
    "inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground/45 transition-colors";

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
      className={`${sharedClassName} hover:bg-white/6 hover:text-foreground/85`}
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
      className={`group flex min-h-[44px] cursor-pointer select-none items-center gap-1.5 rounded-xl px-1 py-0.5 text-[16px] leading-6 transition-colors ${
        isActive ? "bg-white/10 text-foreground" : "text-foreground/70 hover:bg-white/3"
      }`}
      onMouseEnter={onMouseEnter}
    >
      <p className="min-w-0 max-w-120 shrink truncate whitespace-nowrap leading-6">
        <span className={isActive ? "font-medium text-foreground" : "font-medium text-foreground/90"}>
          {project.title}
        </span>
        <span className="hidden text-foreground/40 md:inline"> {project.description}</span>
      </p>
      <span className="h-px min-w-24 flex-1 bg-white/12" aria-hidden />
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
  const isControlled = typeof activeIndexProp === "number";
  const maxIndex = Math.max(0, projects.length - 1);
  const activeIndex = projects.length === 0 ? -1 : Math.max(0, Math.min(activeIndexProp ?? internalActiveIndex, maxIndex));

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

  const moveActive = useCallback((nextIndex: number) => {
    commitActiveIndex(nextIndex);
  }, [commitActiveIndex]);

  useEffect(() => {
    const onDocumentKeyDown = (event: KeyboardEvent) => {
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

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(activeIndex + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(activeIndex - 1);
      }
    };

    document.addEventListener("keydown", onDocumentKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onDocumentKeyDown, { capture: true });
  }, [activeIndex, moveActive]);

  return (
    <ul
      ref={listRef}
      className="mx-auto w-full max-w-4xl space-y-0.5 outline-none"
      tabIndex={0}
      aria-label="Projects list"
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          moveActive(activeIndex + 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          moveActive(activeIndex - 1);
        }
      }}
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
