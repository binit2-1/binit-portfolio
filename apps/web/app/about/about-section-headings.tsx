"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Section headings displayed above the orange line, right-aligned to the
 * content area. Animates in/out based on the active section index
 * (driven by the snap-scroll hook).
 *
 * Animation mirrors the descriptions' framer-motion reveal:
 *   - Fades in from `opacity: 0` → `1`
 *   - Slides from `translateY(-28px)` → `0`
 *   - Unblurs from `blur(14px)` → `blur(0px)`
 *   - Duration ~0.85s with cubic-bezier(0.16, 1, 0.3, 1)
 *
 * @example
 * <AboutSectionHeadings labels={["HELLO", "STACK", "CONTRI"]} activeIndex={0} />
 */

interface AboutSectionHeadingsProps {
  /** Labels for each section. */
  labels: string[];
  /** Currently active section index (from useSnapScroll). */
  activeIndex: number;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ENTER = `transform 0.85s ${EASE}, opacity 0.85s ${EASE}, filter 0.85s ${EASE}`;
const EXIT = `transform 0.6s ${EASE}, opacity 0.4s ease-out, filter 0.6s ${EASE}`;

function applyHidden(el: HTMLElement) {
  el.style.transition = "none";
  el.style.transform = "translateY(-28px)";
  el.style.opacity = "0";
  el.style.filter = "blur(14px)";
}

function applyEnter(el: HTMLElement) {
  applyHidden(el);
  el.getBoundingClientRect(); // force reflow
  el.style.transition = ENTER;
  el.style.transform = "translateY(0)";
  el.style.opacity = "1";
  el.style.filter = "blur(0px)";
}

function applyExit(el: HTMLElement, goingDown: boolean) {
  el.style.transition = EXIT;
  el.style.transform = goingDown ? "translateY(28px)" : "translateY(-28px)";
  el.style.opacity = "0";
  el.style.filter = "blur(14px)";
}

export function AboutSectionHeadings({ labels, activeIndex }: AboutSectionHeadingsProps) {
  const headingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevRef = useRef(-1);

  const setRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      headingRefs.current[i] = el;
    },
    [],
  );

  /* Animate headings whenever activeIndex changes */
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = activeIndex;

    headingRefs.current.forEach((el, i) => {
      if (!el) return;

      if (i === activeIndex) {
        applyEnter(el);
      } else if (i === prev && prev >= 0) {
        applyExit(el, activeIndex > prev);
      } else {
        applyHidden(el);
      }
    });
  }, [activeIndex]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[81] overflow-hidden"
      style={{
        height: "var(--about-fixed-line-top, 45vh)",
        touchAction: "manipulation",
      }}
      aria-hidden
    >
      <div className="relative mx-auto flex h-full w-full max-w-2xl items-end justify-end px-4 pb-3 sm:px-6">
        {labels.map((label, i) => (
          <div
            key={label}
            ref={setRef(i)}
            className="absolute right-4 bottom-3 font-oblique text-lg tracking-tight text-foreground sm:right-6 sm:text-xl md:text-2xl lg:text-3xl"
            style={{
              transform: "translateY(-28px)",
              opacity: 0,
              filter: "blur(14px)",
              willChange: "transform, opacity, filter",
            }}
          >
            {label}
            <span style={{ color: "#FF5800" }}>.</span>
          </div>
        ))}
      </div>
    </div>
  );
}
