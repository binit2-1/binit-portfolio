"use client";

import { AnimatePresence, motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLenisInstance } from "@/components/lenis-provider";
import type { WritingSection } from "@/lib/writing-headings";

type WritingProgressTocProps = {
  title: string;
  sections: WritingSection[];
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const ACTIVE_LINE_RATIO = 0.75;
const CLOSED_HEIGHT = 52;
const OPEN_HEIGHT = 430;

type WritingSectionActiveEvent = CustomEvent<{ id: string }>;

export function WritingProgressToc({ title, sections }: WritingProgressTocProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeId, setActiveId] = useState(sections[0]?.id || "top");
  const frameRef = useRef<number | null>(null);
  const lenis = useLenisInstance();
  const { scrollYProgress } = useScroll();
  const clampedProgress = useTransform(scrollYProgress, (value) => Math.min(Math.max(value, 0), 1));
  const progressAsPercent = useTransform(clampedProgress, (value) => Math.round(value * 100));
  const svgRadius = 15.5;
  const circumference = 2 * Math.PI * svgRadius;
  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) || sections[0],
    [activeId, sections],
  );

  useMotionValueEvent(progressAsPercent, "change", (value) => {
    setProgressPercent(value);
  });

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const syncFromDot = (event: Event) => {
      const nextId = (event as WritingSectionActiveEvent).detail?.id;
      if (nextId) {
        setActiveId((currentId) => (currentId === nextId ? currentId : nextId));
      }
    };

    const measure = () => {
      const activationLine = window.innerHeight * ACTIVE_LINE_RATIO;
      let nextActiveId = sections[0]?.id || "top";

      const headings = Array.from(document.querySelectorAll<HTMLElement>("[data-writing-section-heading='true']"));

      for (const el of headings) {
        if (el && el.getBoundingClientRect().top <= activationLine) {
          nextActiveId = el.dataset.writingSectionId || el.id || nextActiveId;
        }
      }

      setActiveId((currentId) => (currentId === nextActiveId ? currentId : nextActiveId));
    };

    const scheduleMeasure = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        measure();
      });
    };

    measure();
    window.addEventListener("writing-section-active", syncFromDot);
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.removeEventListener("writing-section-active", syncFromDot);
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [sections]);

  function scrollToSection(id: string) {
    const target = document.getElementById(id);
    if (!target) return;

    setIsOpen(false);
    setActiveId(id);

    if (lenis) {
      lenis.scrollTo(target, { offset: -96, duration: 0.9 });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeLabel = activeSection?.title || title;

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-90 flex w-full -translate-x-1/2 justify-center px-4">
      <motion.div
        animate={{
          height: isOpen ? OPEN_HEIGHT : CLOSED_HEIGHT,
        }}
        transition={{ duration: 0.46, ease: EASE }}
        className={`writing-progress-toc pointer-events-auto relative overflow-hidden border border-border/80 bg-background/96 text-foreground shadow-[0_18px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl dark:border-white/12 dark:bg-[#171717]/96 dark:shadow-[0_18px_80px_rgba(0,0,0,0.48)] ${
          isOpen
            ? "w-[min(calc(100vw-2rem),35rem)] rounded-[1.75rem]"
            : "w-[min(calc(100vw-3rem),21.75rem)] rounded-full"
        }`}
      >
        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              key="toc-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="absolute inset-x-0 top-0 bottom-13"
            >
              <div className="px-7 pt-5 pb-2">
                <p className="text-sm font-medium tracking-[0.08em] text-muted-foreground uppercase">Table of contents</p>
              </div>
              <nav className="h-[calc(100%-3.25rem)] overflow-y-auto px-4 pb-4" aria-label="Table of contents">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  className={`relative flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base text-muted-foreground transition-colors hover:bg-foreground/7 hover:text-foreground dark:hover:bg-white/8 ${
                    section.depth > 2 ? "pl-8 text-sm" : ""
                  } ${
                    section.id === activeId
                      ? "bg-foreground/10 text-foreground dark:bg-white/14"
                      : ""
                  }`}
                  onClick={() => scrollToSection(section.id)}
                >
                  <span className="min-w-0 truncate">
                    {index > 0 ? `${index}. ` : ""}
                    {section.title}
                  </span>
                  {section.id === activeId ? (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                  ) : null}
                </button>
              ))}
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>

      <button
        type="button"
        className={`group absolute inset-x-0 bottom-0 flex h-13 w-full items-center gap-3 px-4 text-foreground transition-colors hover:bg-foreground/5 dark:hover:bg-white/7 ${
          isOpen ? "border-t border-border/60 dark:border-white/8" : ""
        }`}
        aria-expanded={isOpen}
        aria-label="Open table of contents"
        onClick={() => setIsOpen((value) => !value)}
      >
        <motion.span layoutId="writing-progress-dot" className="h-2.5 w-2.5 shrink-0 rounded-full bg-foreground" />
        <motion.span layout="position" className="min-w-0 flex-1 truncate text-left text-sm font-medium">
          {activeLabel}
          <span className="sr-only"> {progressPercent}% read</span>
        </motion.span>
        <ProgressRing clampedProgress={clampedProgress} circumference={circumference} radius={svgRadius} isOrange />
      </button>
      </motion.div>
    </div>
  );
}

function ProgressRing({
  clampedProgress,
  circumference,
  radius,
  isOrange = false,
}: {
  clampedProgress: MotionValue<number>;
  circumference: number;
  radius: number;
  isOrange?: boolean;
}) {
  return (
    <motion.span
      layoutId="writing-progress-ring"
      className={`relative flex size-9 shrink-0 items-center justify-center ${isOrange ? "text-[#FF5800]" : "text-foreground"}`}
    >
      <svg className="size-9" viewBox="0 0 40 40" role="presentation">
        <circle cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="3" className="opacity-20" fill="none" />
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          className="opacity-90"
          style={{
            pathLength: clampedProgress,
            rotate: -90,
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
    </motion.span>
  );
}
