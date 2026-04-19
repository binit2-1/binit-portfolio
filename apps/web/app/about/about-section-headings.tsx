"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Section headings displayed above the orange line, right-aligned to the
 * content area. Each heading slides smoothly from top → bottom (inverse to
 * content scroll direction), clipped at the orange line.
 *
 * Animation mirrors the descriptions' framer-motion reveal:
 *   - Fades in from `opacity: 0` → `1`
 *   - Slides from `translateY(-28px)` → `0`   (inverse of content's +28 → 0)
 *   - Unblurs from `blur(14px)` → `blur(0px)`
 *   - Duration ~0.85s with cubic-bezier(0.16, 1, 0.3, 1)
 *
 * Uses direct DOM refs for 60fps scroll-driven updates.
 *
 * @example
 * <AboutSectionHeadings labels={["HELLO", "STACK", "CONTRI"]} />
 */

interface AboutSectionHeadingsProps {
  /** Labels for each section — must match the number of <section>s on the About page. */
  labels: string[];
}

export function AboutSectionHeadings({ labels }: AboutSectionHeadingsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveRef = useRef(-1);

  const setHeadingRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      headingRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const sectionCount = labels.length;

    function update() {
      const scrollY = window.scrollY;
      const docH =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;

      const fraction = Math.min(Math.max(scrollY / docH, 0), 1);
      const scaled = fraction * sectionCount;
      const activeIndex = Math.min(Math.floor(scaled), sectionCount - 1);

      // Only trigger animation when active section changes
      if (activeIndex !== prevActiveRef.current) {
        const prevIndex = prevActiveRef.current;
        prevActiveRef.current = activeIndex;

        headingRefs.current.forEach((el, i) => {
          if (!el) return;

          if (i === activeIndex) {
            // --- Entering heading: animate in (matching description reveal) ---
            el.style.transition = "none";
            el.style.transform = "translateY(-28px)";
            el.style.opacity = "0";
            el.style.filter = "blur(14px)";

            // Force reflow so the start state is painted
            el.getBoundingClientRect();

            // Animate to resting state
            el.style.transition =
              "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), " +
              "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), " +
              "filter 0.85s cubic-bezier(0.16, 1, 0.3, 1)";
            el.style.transform = "translateY(0)";
            el.style.opacity = "1";
            el.style.filter = "blur(0px)";
          } else if (i === prevIndex && prevIndex >= 0) {
            // --- Exiting heading: slide away + fade + blur ---
            const goingDown = activeIndex > prevIndex;
            el.style.transition =
              "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), " +
              "opacity 0.4s ease-out, " +
              "filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            el.style.transform = goingDown
              ? "translateY(28px)"
              : "translateY(-28px)";
            el.style.opacity = "0";
            el.style.filter = "blur(14px)";
          } else {
            // --- All other headings: hidden instantly ---
            el.style.transition = "none";
            el.style.transform = "translateY(-28px)";
            el.style.opacity = "0";
            el.style.filter = "blur(14px)";
          }
        });
      }
    }

    // Initial paint: animate in the first heading on mount
    if (prevActiveRef.current === -1) {
      prevActiveRef.current = 0;
      headingRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) {
          el.style.transition = "none";
          el.style.transform = "translateY(-28px)";
          el.style.opacity = "0";
          el.style.filter = "blur(14px)";
          el.getBoundingClientRect();
          el.style.transition =
            "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), " +
            "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), " +
            "filter 0.85s cubic-bezier(0.16, 1, 0.3, 1)";
          el.style.transform = "translateY(0)";
          el.style.opacity = "1";
          el.style.filter = "blur(0px)";
        } else {
          el.style.transition = "none";
          el.style.transform = "translateY(-28px)";
          el.style.opacity = "0";
          el.style.filter = "blur(14px)";
        }
      });
    }

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [labels]);

  return (
    <div
      ref={containerRef}
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
            ref={setHeadingRef(i)}
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
