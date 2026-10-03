"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import type { WritingSection } from "@/lib/writing-headings";
import { useActiveSection } from "./use-active-section";

const TOTAL_TICKS = 60;
const LAST_TICK = TOTAL_TICKS - 1;

/**
 * Vertical tick-mark scroll indicator for xl+ screens, adapted from ui.nexvyn.dev's
 * Scroll Indicator (without its sounds). Sections sit on longer ticks; hovering or
 * focusing reveals their labels; the accent marker and `n/total` follow the active one.
 */
export function WritingScrollIndicator({ sections }: { sections: WritingSection[] }) {
  const reducedMotion = useReducedMotion();
  const { activeIndex, jumpTo } = useActiveSection(sections.map((section) => section.id));
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);
  const [open, setOpen] = useState(false);

  const markerY = useSpring(0, reducedMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 300, damping: 30 });
  const sectionTick = (index: number) => Math.round((index / Math.max(sections.length - 1, 1)) * LAST_TICK);
  const tickY = (tick: number) => (tick / LAST_TICK) * trackHeight;
  const activeTick = sectionTick(activeIndex);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => setTrackHeight(track.clientHeight));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (trackHeight > 0) markerY.set((activeTick / LAST_TICK) * trackHeight);
  }, [activeTick, trackHeight, markerY]);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="fixed top-1/2 right-8 z-30 hidden h-[min(60dvh,30rem)] w-4 -translate-y-1/2 xl:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setOpen(false)}
    >
      <div ref={trackRef} className="relative h-full">
        {Array.from({ length: TOTAL_TICKS }, (_, tick) => {
          const major = tick % 5 === 0;
          return (
            <span
              key={tick}
              aria-hidden
              className={cn(
                "absolute right-0 h-px transition-colors duration-150 motion-reduce:transition-none",
                major ? "w-3" : "w-1.5",
                tick <= activeTick ? "bg-foreground" : major ? "bg-foreground/45" : "bg-foreground/20",
              )}
              style={{ top: tickY(tick) }}
            />
          );
        })}

        <ul>
          {sections.map((section, index) => {
            const active = index === activeIndex;
            const y = tickY(sectionTick(index));
            return (
              <li key={section.id}>
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-0 h-px transition-colors duration-150 motion-reduce:transition-none",
                    section.depth <= 2 ? "w-4" : "w-3",
                    active ? "bg-brand" : "bg-foreground/60",
                  )}
                  style={{ top: y }}
                />
                <button
                  type="button"
                  onClick={() => jumpTo(index)}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "absolute right-6 block max-w-[calc(50vw-22rem-6rem)] -translate-y-1/2 truncate rounded-md text-right font-mono text-[11px] tracking-wider whitespace-nowrap uppercase",
                    "transition-[opacity,translate,color] focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none",
                    open ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-2 opacity-0",
                    active ? "text-brand" : "text-muted-foreground hover:text-foreground",
                  )}
                  style={{ top: y, transitionDelay: open && !reducedMotion ? `${index * 25}ms` : "0ms" }}
                >
                  {section.title.replace(/[`*]/g, "")}
                </button>
              </li>
            );
          })}
        </ul>

        <motion.div aria-hidden className="absolute top-0 right-0 z-10" style={{ y: markerY }}>
          <div className="h-px w-4 bg-brand" />
          <span
            className={cn(
              "absolute top-0 right-6 -translate-y-1/2 font-mono text-[10px] text-brand tabular-nums transition-opacity duration-150",
              open ? "opacity-0" : "opacity-100",
            )}
          >
            {activeIndex + 1}/{sections.length}
          </span>
        </motion.div>
      </div>
    </nav>
  );
}
