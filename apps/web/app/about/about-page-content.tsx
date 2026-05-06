"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { InView } from "@/components/core/in-view";
import GlowingScrollIndicator from "@/components/glowing-scroll-indicator";
import { GithubCalendar } from "@/components/ui/github-calendar";

import { AboutViewportMask } from "./about-viewport-mask";
import { AboutSectionHeadings } from "./about-section-headings";
import { useSnapScroll } from "./use-snap-scroll";

/** Matches the hero copy in section 1. */
const sectionTextClass =
  "w-full max-w-2xl rounded-md px-2 py-1 font-sans font-bold select-none text-base tracking-tighter text-foreground transition-[background-color,color,text-shadow,transform] duration-200 hover:bg-foreground/5 hover:text-foreground hover:[text-shadow:0_10px_34px_rgba(0,0,0,0.12)] dark:hover:bg-white/5 md:text-xl";

const scrollReveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
} as const;

const inViewTransition = {
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1] as const,
};

/**
 * Section labels — add new entries here and match with a <section> below.
 * The heading component and snap logic auto-adapt to however many you have.
 */
const SECTION_LABELS = ["HELLO", "EXP", "CONTRI"];

/**
 * Shared section class: each section is exactly 1 viewport tall,
 * and centers content in the visible band below the orange line.
 */
const snapSectionClass =
  "mx-auto flex h-dvh w-full flex-col items-center justify-center px-4 text-center sm:px-6";

export function AboutPageContent() {
  const [holeEl, setHoleEl] = useState<HTMLDivElement | null>(null);
  const holeRootRef = useRef<HTMLDivElement | null>(null);

  /* ── GSAP snap scroll ── */
  const { activeIndex } = useSnapScroll({
    sectionCount: SECTION_LABELS.length,
    duration: 0.85,
    ease: "power3.inOut",
  });

  useEffect(() => {
    holeRootRef.current = holeEl;
  }, [holeEl]);

  const inViewOptions = useMemo(
    () => ({
      root: holeRootRef,
      amount: 0.28 as const,
    }),
    [],
  );

  /* ── Set body styles for the About page ── */
  useEffect(() => {
    const html = document.documentElement;
    // Prevent native scroll-snap from interfering with GSAP
    html.style.overscrollBehaviorY = "none";
    document.body.style.overscrollBehaviorY = "none";

    return () => {
      html.style.overscrollBehaviorY = "";
      document.body.style.overscrollBehaviorY = "";
    };
  }, []);

  return (
    <>
      <div className="relative z-10 w-full min-w-0">
        {/* ── Section 1 ── */}
        <section
          className={snapSectionClass}
          style={{ marginTop: "-30px" }}
        >
          <h1 className="sr-only">About</h1>
          <p className={sectionTextClass}>
            I am Full-stack developer with taste. I build and ship with Next.js, React, and Tailwind on the frontend, Express and Go on the backend. I like making things and putting them out into the world.
          </p>
        </section>

        {/* ── Section 2 ── */}
        <InView
          as="section"
          className={snapSectionClass}
          variants={scrollReveal}
          viewOptions={inViewOptions}
          transition={inViewTransition}
        >
          <div style={{ marginTop: "-30px" }} className="flex w-full flex-col items-center justify-center flex-1">
            <h2 className="sr-only">More</h2>
            <p className={sectionTextClass}>
              Section 2 placeholder — add content here (e.g. experience, stack, or projects).
            </p>
          </div>
        </InView>

        {/* ── Section 3 ── */}
        <InView
          as="section"
          className={snapSectionClass}
          variants={scrollReveal}
          viewOptions={inViewOptions}
          transition={inViewTransition}
        >
          <div style={{ marginTop: "-30px" }} className="flex w-full flex-col items-center justify-center flex-1">
            <h2 className="sr-only">GitHub contributions</h2>
            <div className="flex w-full min-w-0 max-w-[min(100%,52rem)] justify-center rounded-md transition-[background-color,box-shadow] duration-200 hover:bg-foreground/4 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:hover:bg-white/4 dark:hover:shadow-none">
              <GithubCalendar username="binit2-1" colorSchema="orange" variant="default" showTotal />
            </div>
          </div>
        </InView>
      </div>

      <div
        className="pointer-events-none fixed inset-x-0"
        style={{ top: "var(--about-fixed-line-top, 20vh)", zIndex: 80 }}
        aria-hidden
      >
        <div
          className="w-full bg-[#FF5800]"
          style={{ height: "1px", transform: "scaleY(0.5)", transformOrigin: "center" }}
        />
      </div>

      <AboutViewportMask onHoleRef={setHoleEl} />
      <AboutSectionHeadings labels={SECTION_LABELS} activeIndex={activeIndex} />

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-45 -translate-x-1/2 p-1 md:bottom-8">
        <div className="flex h-20 items-end justify-center">
          <GlowingScrollIndicator direction="vertical" />
        </div>
      </div>
    </>
  );
}
