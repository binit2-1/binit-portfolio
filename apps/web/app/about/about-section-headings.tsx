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

const DOT_ENTER_DELAY = `transform 0.85s ${EASE} 1s, opacity 0.85s ${EASE} 1s`;
const DOT_ENTER_IMMEDIATE = `transform 0.85s ${EASE}, opacity 0.85s ${EASE}`;
const DOT_EXIT = `transform 0.6s ${EASE}, opacity 0.4s ease-out`;

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

function applyDotHidden(el: HTMLElement) {
  el.style.transition = "none";
  el.style.transform = "translateY(-40px)";
  el.style.opacity = "0";
}

function applyDotEnter(el: HTMLElement, fromTop: boolean, isInitial: boolean) {
  el.style.transition = "none";
  el.style.transform = fromTop ? "translateY(-40px)" : "translateY(40px)";
  el.style.opacity = "0";
  el.getBoundingClientRect(); // force reflow

  el.style.transition = isInitial ? DOT_ENTER_IMMEDIATE : DOT_ENTER_DELAY;
  el.style.transform = "translateY(0)";
  el.style.opacity = "1";
}

function applyDotExit(el: HTMLElement, exitDown: boolean) {
  el.style.transition = DOT_EXIT;
  el.style.transform = exitDown ? "translateY(40px)" : "translateY(-40px)";
  el.style.opacity = "0";
}

export function AboutSectionHeadings({ labels, activeIndex }: AboutSectionHeadingsProps) {
  const headingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevRef = useRef(-1);

  const setHeadingRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      headingRefs.current[i] = el;
    },
    [],
  );

  const setDotRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      dotRefs.current[i] = el;
    },
    [],
  );

  /* Animate headings and dots whenever activeIndex changes */
  useEffect(() => {
    const prev = prevRef.current;
    const goingDown = activeIndex > prev;
    const isInitial = prev === -1;
    prevRef.current = activeIndex;

    headingRefs.current.forEach((el, i) => {
      if (!el) return;

      if (i === activeIndex) {
        applyEnter(el);
      } else if (i === prev && prev >= 0) {
        applyExit(el, goingDown);
      } else {
        applyHidden(el);
      }
    });

    dotRefs.current.forEach((el, i) => {
      if (!el) return;

      if (i === activeIndex) {
        applyDotEnter(el, goingDown, isInitial);
      } else if (i === prev && prev >= 0) {
        applyDotExit(el, goingDown);
      } else {
        applyDotHidden(el);
      }
    });
  }, [activeIndex]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[81]"
      style={{
        height: "var(--about-fixed-line-top, 45vh)",
        touchAction: "manipulation",
      }}
      aria-hidden
    >
      {/* Headings layer - clipped with overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative mx-auto flex h-full w-full max-w-2xl items-end justify-end px-4 pb-3 sm:px-6">
          {labels.map((label, i) => (
            <div
              key={label}
              ref={setHeadingRef(i)}
              className="absolute right-8 bottom-3 font-oblique text-lg tracking-tight text-foreground sm:right-10 lg:right-8 sm:text-xl md:text-2xl lg:text-3xl"
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

      {/* Dots layer - no overflow-hidden so dots can span the line */}
      <div className="absolute inset-0">
        <div className="relative mx-auto h-full w-full max-w-2xl">
          {labels.map((label, i) => (
            <div
              key={`dot-${label}`}
              ref={setDotRef(i)}
              className="absolute left-8 h-4 w-4 rounded-full bg-[#FF5800] sm:left-10 lg:left-8"
              style={{
                bottom: "20px",
                transform: "translateY(-40px)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
