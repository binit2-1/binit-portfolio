"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

/** Headings in the top third of the viewport count as "being read". */
const READING_BAND = 0.3;
/** Space left above a heading after jumping to it (clears the top of the viewport). */
const JUMP_OFFSET = 96;

/**
 * Index of the section being read, shared by the scroll indicator and the bottom TOC.
 * Updates only when a heading crosses the reading band (IntersectionObserver, no scroll
 * listener). The last sections are often too short to reach the band, so the end of the
 * article (`[data-writing-end]`) activates the last one.
 */
export function useActiveSection(ids: string[]) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const key = ids.join("|");

  useEffect(() => {
    const headings = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null);
    if (headings.length === 0) return;

    let atEnd = false;
    const update = () => {
      if (atEnd) return setActiveIndex(headings.length - 1);
      const line = window.innerHeight * READING_BAND;
      let next = 0;
      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= line) next = index;
      });
      setActiveIndex(next);
    };

    const headingObserver = new IntersectionObserver(update, {
      rootMargin: `0px 0px -${(1 - READING_BAND) * 100}% 0px`,
    });
    headings.forEach((heading) => headingObserver.observe(heading));

    const endObserver = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting;
      update();
    });
    const end = document.querySelector("[data-writing-end]");
    if (end) endObserver.observe(end);

    update();
    return () => {
      headingObserver.disconnect();
      endObserver.disconnect();
    };
  }, [key]);

  const jumpTo = useCallback(
    (index: number) => {
      const target = document.getElementById(ids[index]);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - JUMP_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
    },
    [ids, reducedMotion],
  );

  return { activeIndex, jumpTo };
}
