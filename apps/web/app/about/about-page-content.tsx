"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { InView } from "@/components/core/in-view";
import GlowingScrollIndicator from "@/components/glowing-scroll-indicator";
import { GithubCalendar } from "@/components/ui/github-calendar";

import { AboutViewportMask } from "./about-viewport-mask";

/** Matches the hero copy in section 1. */
const sectionTextClass =
  "w-full max-w-2xl font-sans font-bold select-none text-base tracking-tighter text-foreground md:text-xl";

const scrollReveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
} as const;

const inViewTransition = {
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function AboutPageContent() {
  const [holeEl, setHoleEl] = useState<HTMLDivElement | null>(null);
  const holeRootRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <>
      <div className="relative z-10 w-full min-w-0">
        <section className="mx-auto flex min-h-[calc(100dvh-var(--site-nav-h))] w-full flex-col items-center justify-center px-4 text-center sm:px-6">
          <h1 className="sr-only">About</h1>
          <p className={sectionTextClass}>
            I am a full-stack developer and computer science student focused on developer experience and systems
            architecture. From building custom React renderers to engineering lightweight Go applications, I love
            diving deep into how things work under the hood. I build interactive apps with taste, prioritizing speed,
            clean code, and zero-friction user experiences.
          </p>
        </section>

        <InView
          as="section"
          className="mx-auto flex min-h-[80vh] w-full flex-col items-center justify-center px-4 py-16 text-center sm:px-6"
          variants={scrollReveal}
          viewOptions={inViewOptions}
          transition={inViewTransition}
        >
          <h2 className="sr-only">More</h2>
          <p className={sectionTextClass}>
            Section 2 placeholder — add content here (e.g. experience, stack, or projects).
          </p>
        </InView>

        <InView
          as="section"
          className="mx-auto flex min-h-[80vh] w-full flex-col items-center justify-center px-4 py-16 sm:px-6"
          variants={scrollReveal}
          viewOptions={inViewOptions}
          transition={inViewTransition}
        >
          <h2 className="sr-only">GitHub contributions</h2>
          <div className="flex w-full min-w-0 max-w-[min(100%,52rem)] justify-center">
            <GithubCalendar username="binit2-1" colorSchema="orange" variant="default" showTotal />
          </div>
        </InView>
      </div>

      <AboutViewportMask onHoleRef={setHoleEl} />

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-45 -translate-x-1/2 p-1 md:bottom-8">
        <div className="flex h-20 items-end justify-center">
          <GlowingScrollIndicator direction="vertical" />
        </div>
      </div>
    </>
  );
}
