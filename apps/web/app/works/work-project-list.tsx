"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GithubLogoIcon, GlobeHemisphereWestIcon } from "@phosphor-icons/react/dist/ssr";
import type { WorkProject } from "./work-project-types";

type WorkProjectListProps = {
  projects: WorkProject[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onProjectOpen?: () => void;
};

type WorkProjectClickThroughEvent = CustomEvent<{ index: number }>;

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
  isArmed,
  onMouseEnter,
  onPress,
  index,
}: {
  project: WorkProject;
  isActive: boolean;
  isArmed: boolean;
  onMouseEnter: () => void;
  onPress: () => void;
  index: number;
}) {
  const shouldIgnoreRowIntent = (target: EventTarget | null) =>
    target instanceof HTMLElement && Boolean(target.closest("a, button"));

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (shouldIgnoreRowIntent(event.target)) return;
    onPress();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (shouldIgnoreRowIntent(event.target)) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onPress();
  };

  return (
    <li
      data-work-index={index}
      role="button"
      tabIndex={0}
      aria-current={isActive ? "true" : undefined}
      aria-label={`${isArmed ? "Open video for" : "Select"} ${project.title}`}
      className={`group flex min-h-11 cursor-pointer select-none items-center gap-1.5 rounded-xl border px-1 py-0.5 text-[16px] leading-6 transition-[background-color,border-color,color,box-shadow] duration-200 ${
        isActive
          ? "border-foreground/12 bg-foreground/7 text-foreground shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/10 dark:shadow-none"
          : "border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5 hover:text-foreground dark:hover:border-white/8 dark:hover:bg-white/5"
      }`}
      onMouseEnter={onMouseEnter}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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

export function WorkProjectList({
  projects,
  activeIndex: activeIndexProp,
  onActiveIndexChange,
  onProjectOpen,
}: WorkProjectListProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const [armedIndex, setArmedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const activeIndexRef = useRef(0);
  const armedIndexRef = useRef<number | null>(null);
  const isControlled = typeof activeIndexProp === "number";
  const maxIndex = Math.max(0, projects.length - 1);
  const activeIndex = projects.length === 0 ? -1 : Math.max(0, Math.min(activeIndexProp ?? internalActiveIndex, maxIndex));

  useEffect(() => {
    if (activeIndex >= 0) {
      activeIndexRef.current = activeIndex;
    }
  }, [activeIndex]);

  useEffect(() => {
    armedIndexRef.current = armedIndex;
  }, [armedIndex]);

  const commitActiveIndex = useCallback(
    (nextIndex: number) => {
      if (projects.length === 0) return null;

      const clamped = Math.max(0, Math.min(nextIndex, maxIndex));

      if (!isControlled) {
        setInternalActiveIndex(clamped);
      }

      onActiveIndexChange?.(clamped);
      setArmedIndex((current) => (current === clamped ? current : null));
      const target = listRef.current?.querySelector<HTMLLIElement>(`[data-work-index="${clamped}"]`);
      target?.scrollIntoView({ block: "nearest", behavior: "smooth" });

      return clamped;
    },
    [isControlled, maxIndex, onActiveIndexChange, projects.length],
  );

  const armProject = useCallback(
    (nextIndex: number) => {
      const clamped = commitActiveIndex(nextIndex);
      if (clamped === null) return;

      setArmedIndex(clamped);
    },
    [commitActiveIndex],
  );

  const openProject = useCallback(
    (nextIndex: number) => {
      const clamped = commitActiveIndex(nextIndex);
      if (clamped === null) return;

      setArmedIndex(clamped);
      onProjectOpen?.();
    },
    [commitActiveIndex, onProjectOpen],
  );

  const pressProject = useCallback(
    (nextIndex: number) => {
      if (armedIndexRef.current === nextIndex && activeIndexRef.current === nextIndex) {
        openProject(nextIndex);
        return;
      }

      armProject(nextIndex);
    },
    [armProject, openProject],
  );

  const moveActiveBy = useCallback(
    (delta: number) => {
      if (projects.length === 0) return;
      commitActiveIndex(activeIndexRef.current + delta);
    },
    [commitActiveIndex, projects.length],
  );

  useEffect(() => {
    const onProjectClickThrough = (event: Event) => {
      const nextIndex = (event as WorkProjectClickThroughEvent).detail?.index;
      if (!Number.isFinite(nextIndex)) return;

      armProject(nextIndex);
    };

    document.addEventListener("work-project-click-through", onProjectClickThrough);
    return () => document.removeEventListener("work-project-click-through", onProjectClickThrough);
  }, [armProject]);

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
          isArmed={index === armedIndex}
          onMouseEnter={() => commitActiveIndex(index)}
          onPress={() => pressProject(index)}
        />
      ))}
    </ul>
  );
}
