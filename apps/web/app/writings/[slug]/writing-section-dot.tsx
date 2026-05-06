"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DOT_SIZE = 12;

export function WritingSectionDot() {
  const [dotState, setDotState] = useState<{ top: number | null; hasMoved: boolean }>({
    top: null,
    hasMoved: false,
  });
  const frameRef = useRef<number | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-writing-article='true']");
    if (!article) return;

    const headings = Array.from(article.querySelectorAll<HTMLElement>("[data-writing-section-heading='true']"));
    if (headings.length === 0) return;

    const measure = () => {
      const activationLine = window.innerHeight * 0.75;
      let activeHeading = headings[0];

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= activationLine) {
          activeHeading = heading;
        }
      }

      const headingRect = activeHeading.getBoundingClientRect();
      const firstLineCenter = Math.min(headingRect.height, 32) / 2;
      const nextTop = activeHeading.offsetTop + firstLineCenter - DOT_SIZE / 2;
      const activeId = activeHeading.dataset.writingSectionId || activeHeading.id || null;

      if (activeId && activeIdRef.current !== activeId) {
        activeIdRef.current = activeId;
        window.dispatchEvent(
          new CustomEvent("writing-section-active", {
            detail: { id: activeId },
          }),
        );
      }

      setDotState((currentState) => {
        const roundedNext = Math.round(nextTop);

        if (currentState.top === roundedNext) {
          return currentState;
        }

        return {
          top: roundedNext,
          hasMoved: currentState.top !== null,
        };
      });
    };

    const scheduleMeasure = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        measure();
      });
    };

    measure();

    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(article);
    headings.forEach((heading) => resizeObserver.observe(heading));

    return () => {
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      resizeObserver.disconnect();

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  if (dotState.top === null) {
    return null;
  }

  return (
    <motion.div
      data-writing-section-dot="true"
      aria-hidden
      className="pointer-events-none absolute z-20 hidden h-3 w-3 rounded-full bg-[#FF5800] shadow-[0_0_18px_rgba(255,88,0,0.14)] md:block md:-left-8"
      initial={false}
      animate={{ y: dotState.top }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.68,
        delay: prefersReducedMotion || !dotState.hasMoved ? 0 : 0.5,
        ease: EASE,
      }}
      style={{ top: 0, willChange: "transform" }}
    />
  );
}
