"use client";

import { CaretUpIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import type { WritingSection } from "@/lib/writing-headings";
import { useActiveSection } from "./use-active-section";

/** Show the bar once the reader is past the post header (hidden again at the site footer). */
const SHOW_AFTER = 300;

/**
 * Bottom-centre table of contents below xl, adapted from ui.nexvyn.dev's Table of Contents
 * (without its sounds): the current section + a reading-progress ring; tapping opens the
 * section list above the bar.
 */
export function WritingMobileToc({ sections }: { sections: WritingSection[] }) {
  const reducedMotion = useReducedMotion();
  const { activeIndex, jumpTo } = useActiveSection(sections.map((section) => section.id));
  const { scrollY, scrollYProgress } = useScroll();
  const [pastHeader, setPastHeader] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // Only flips at the threshold, so this doesn't re-render while scrolling.
  useMotionValueEvent(scrollY, "change", (y) => setPastHeader(y > SHOW_AFTER));

  // Step aside for the site footer so its links stay tappable.
  useEffect(() => {
    const footer = document.querySelector("body footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (sections.length === 0) return null;
  const active = sections[activeIndex];
  const spring = reducedMotion ? { duration: 0 } : { type: "spring" as const, damping: 25, stiffness: 300 };

  return (
    <AnimatePresence>
      {((pastHeader && !footerInView) || open) && (
        <motion.div
          ref={containerRef}
          className="fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 mx-auto w-[calc(100%-2rem)] max-w-sm xl:hidden"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={spring}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                id={listId}
                className="mb-2 overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-2xl"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "bottom center" }}
              >
                <ul className="max-h-[50dvh] overflow-y-auto overscroll-contain">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          jumpTo(index);
                        }}
                        aria-current={index === activeIndex ? "location" : undefined}
                        className={cn(
                          "w-full rounded-lg py-2.5 pr-3 text-left text-sm leading-snug transition-colors",
                          section.depth > 2 ? "pl-7 text-[0.8125rem]" : "pl-3",
                          index === activeIndex
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        {section.title.replace(/[`*]/g, "")}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={`Table of contents, current section: ${active?.title ?? ""}`}
            onClick={() => setOpen((value) => !value)}
            className="group flex h-12 w-full items-center gap-3 rounded-xl border border-border bg-background/95 pr-3 pl-4 shadow-lg backdrop-blur-sm transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="min-w-0 flex-1 truncate text-left text-sm text-foreground">
              {active?.title.replace(/[`*]/g, "")}
            </span>
            <span aria-hidden className="h-4 w-px bg-border" />
            <svg aria-hidden viewBox="0 0 18 18" className="size-[18px] shrink-0 -rotate-90">
              <circle cx="9" cy="9" r="8" fill="none" strokeWidth="2" className="stroke-foreground/10" />
              <motion.circle
                cx="9"
                cy="9"
                r="8"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                className="stroke-hire"
                style={{ pathLength: scrollYProgress }}
              />
            </svg>
            <CaretUpIcon
              aria-hidden
              weight="bold"
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:text-foreground motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
