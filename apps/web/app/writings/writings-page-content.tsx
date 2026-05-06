"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import type { WritingPreview } from "@/lib/writings";
import { WritingThumbnail } from "./writing-thumbnail";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
  };
};

function WritingTransitionLink({
  href,
  children,
  className,
  ariaLabel,
  onIntent,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  onIntent?: () => void;
}) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    onIntent?.();

    const doc = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || prefersReducedMotion) {
      router.push(href);
      return;
    }

    doc.startViewTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={handleClick}
      onFocus={onIntent}
      onPointerDown={onIntent}
    >
      {children}
    </Link>
  );
}

function WritingHeading({ label, activeIndex }: { label: string; activeIndex: number }) {
  const [direction, setDirection] = useState(1);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const previous = prevIndexRef.current;
    setDirection(activeIndex >= previous ? 1 : -1);
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <div className="relative flex h-full w-full items-end justify-end pb-3 pr-1 md:pb-4 md:pr-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeIndex}-${label}`}
          initial={{ opacity: 0, y: direction > 0 ? -28 : 28, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: direction > 0 ? 28 : -28, filter: "blur(14px)" }}
          transition={{ duration: 0.52, ease: EASE }}
          className="absolute right-0 bottom-0 text-right font-oblique text-xl tracking-tight text-foreground sm:text-2xl md:text-3xl"
          aria-live="polite"
        >
          {label}
          <span style={{ color: "#FF5800" }}>.</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WritingsSpotlight({ writings, activeIndex }: { writings: WritingPreview[]; activeIndex: number }) {
  if (writings.length === 0) return null;

  const currentWriting = writings[Math.max(0, Math.min(activeIndex, writings.length - 1))];
  const spotlightGridClassName =
    "mx-auto grid h-full w-full max-w-3xl grid-cols-[minmax(0,11rem)_1fr] items-end gap-3 px-4 pb-4 sm:px-6 md:grid-cols-[minmax(0,12rem)_1fr] md:gap-4 md:pb-5";

  return (
    <div
      className="pointer-events-none fixed inset-x-0"
      style={{
        top: "var(--site-nav-h, 0px)",
        height: "max(0px, calc(var(--about-fixed-line-top, 20vh) - var(--site-nav-h, 0px)))",
      }}
    >
      <div className="absolute inset-0 z-[100]">
        <div className={spotlightGridClassName}>
          <WritingTransitionLink
            href={currentWriting.href}
            ariaLabel={`Open ${currentWriting.title}`}
            className="pointer-events-auto relative z-10 block"
          >
            <WritingThumbnail
              title={currentWriting.title}
              thumbnail={currentWriting.thumbnail}
              index={activeIndex}
              viewTransitionName="writing-thumbnail"
            />
          </WritingTransitionLink>
          <div aria-hidden />
        </div>
      </div>

      <div className="absolute inset-0 z-[90]">
        <div className={spotlightGridClassName}>
          <div aria-hidden />
          <WritingHeading activeIndex={activeIndex} label={currentWriting.label} />
        </div>
      </div>
    </div>
  );
}

function WritingRow({
  writing,
  isActive,
  onMouseEnter,
  index,
}: {
  writing: WritingPreview;
  isActive: boolean;
  onMouseEnter: () => void;
  index: number;
}) {
  return (
    <li data-writing-index={index}>
      <WritingTransitionLink
        href={writing.href}
        ariaLabel={`Open ${writing.title}`}
        onIntent={onMouseEnter}
        className={`group flex min-h-11 cursor-pointer select-none items-center gap-1.5 rounded-xl px-1 py-0.5 text-[16px] leading-6 transition-colors ${
          isActive ? "bg-white/10 text-foreground" : "text-foreground/70 hover:bg-white/3"
        }`}
      >
        <p className="min-w-0 shrink pl-2.5 truncate whitespace-nowrap leading-6">
          <span className={isActive ? "font-medium text-foreground" : "font-medium text-foreground/90"}>
            {writing.title}
          </span>
          <span className="hidden text-foreground/40 md:inline"> {writing.description}</span>
        </p>
        <span className="h-px min-w-24 flex-1 bg-white/12" aria-hidden />
        <span className="ml-auto inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-foreground/45 transition-colors group-hover:bg-white/6 group-hover:text-foreground/85">
          <ArrowSquareOutIcon size={16} weight="regular" />
        </span>
      </WritingTransitionLink>
    </li>
  );
}

export function WritingsPageContent({ writings }: { writings: WritingPreview[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);
  const maxIndex = Math.max(0, writings.length - 1);
  const safeActiveIndex = Math.max(0, Math.min(activeIndex, maxIndex));

  const commitActiveIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(nextIndex, maxIndex));
      setActiveIndex(clamped);
      const target = listRef.current?.querySelector<HTMLLIElement>(`[data-writing-index="${clamped}"]`);
      target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    [maxIndex],
  );

  return (
    <>
      <WritingsSpotlight writings={writings} activeIndex={safeActiveIndex} />

      <section
        className="mx-auto h-auto w-full max-w-5xl overflow-visible px-4 pb-16 sm:px-6"
        style={{ paddingTop: "calc(var(--about-fixed-line-top, 20vh) + 6px)" }}
      >
        <h1 className="sr-only">Writings</h1>
        <ul
          ref={listRef}
          className="mx-auto w-full max-w-(--writing-content-width) space-y-0.5 outline-none"
          aria-label="Writings list"
        >
          {writings.map((writing, index) => (
            <WritingRow
              key={writing.title}
              writing={writing}
              index={index}
              isActive={index === safeActiveIndex}
              onMouseEnter={() => commitActiveIndex(index)}
            />
          ))}
        </ul>
      </section>
    </>
  );
}
