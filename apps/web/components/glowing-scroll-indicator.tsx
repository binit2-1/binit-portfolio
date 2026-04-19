"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect } from "react";

import { useLenisInstance } from "@/components/lenis-provider";

const ACCENT = "#FF5800";
const BARS = 40;

/** In dark mode, higher floors so inactive bars stay visibly light (whiteish) on near-black backgrounds. */
const OPACITY_STOPS = {
  light: [0.12, 0.38, 1, 0.38, 0.12] as const,
  dark: [0.32, 0.62, 1, 0.62, 0.32] as const,
};

const ScrollBar = ({
  index,
  scrollProgress,
  opacityStops,
}: {
  index: number;
  scrollProgress: MotionValue<number>;
  opacityStops: readonly [number, number, number, number, number];
}) => {
  const thisBarPosition = index / BARS;
  const preStep = Math.max(0, (index - 3) / BARS);
  const postStep = Math.min(1, (index + 3) / BARS);

  const height = useTransform(scrollProgress, [0, preStep, thisBarPosition, postStep, 1], [4, 10, 26, 10, 4]);
  const opacity = useTransform(
    scrollProgress,
    [0, preStep, thisBarPosition, postStep, 1],
    [...opacityStops],
  );
  const width = useTransform(scrollProgress, [0, thisBarPosition, 1], [1, 3.5, 1]);

  return (
    <motion.div
      className="bg-foreground"
      style={{
        height,
        opacity,
        width: useTransform(width, (value) => `${value}px`),
      }}
    />
  );
};

const ScrollIndicatorBars = ({
  containerElement,
  direction,
  draggable,
}: {
  containerElement: HTMLElement | null;
  direction: "vertical" | "horizontal";
  draggable: boolean;
}) => {
  const ref = React.useRef<HTMLElement | null>(containerElement);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef(false);
  const { resolvedTheme } = useTheme();
  const lenis = useLenisInstance();

  React.useEffect(() => {
    ref.current = containerElement;
  }, [containerElement]);

  const opacityStops = resolvedTheme === "dark" ? OPACITY_STOPS.dark : OPACITY_STOPS.light;

  const { scrollXProgress, scrollYProgress } = useScroll(
    containerElement ? { container: ref } : undefined,
  );

  const scrollProgress = direction === "vertical" ? scrollYProgress : scrollXProgress;
  const left = useTransform(scrollProgress, [0, 1], [0, 100]);

  const applyScrollFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));

      const scrollEl = ref.current;
      if (scrollEl) {
        if (direction === "vertical") {
          const max = scrollEl.scrollHeight - scrollEl.clientHeight;
          if (max <= 0) return;
          scrollEl.scrollTop = ratio * max;
        } else {
          const max = scrollEl.scrollWidth - scrollEl.clientWidth;
          if (max <= 0) return;
          scrollEl.scrollLeft = ratio * max;
        }
        return;
      }

      if (direction === "vertical") {
        if (lenis) {
          if (lenis.limit <= 0) return;
          lenis.scrollTo(ratio * lenis.limit, { immediate: true });
        } else {
          const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
          if (max <= 0) return;
          window.scrollTo(0, ratio * max);
        }
      } else {
        const max = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
        if (max <= 0) return;
        window.scrollTo(ratio * max, 0);
      }
    },
    [direction, lenis],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    applyScrollFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || !dragRef.current) return;
    applyScrollFromClientX(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* released */
    }
  };

  return (
    <div
      ref={trackRef}
      className={
        draggable
          ? "pointer-events-auto relative flex w-fit cursor-grab touch-none select-none items-end justify-center gap-0.5 active:cursor-grabbing md:gap-1"
          : "relative flex w-fit items-end justify-center gap-0.5 md:gap-1"
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label={draggable ? "Drag horizontally to scroll the page" : undefined}
    >
      {Array.from({ length: BARS }).map((_, index) => (
        <ScrollBar
          key={`scroll-bar-${index}-${opacityStops[0]}`}
          index={index}
          scrollProgress={direction === "vertical" ? scrollYProgress : scrollXProgress}
          opacityStops={opacityStops}
        />
      ))}
      <motion.div
        className="absolute bottom-0 left-1/2 h-14 w-px -translate-x-1/2 shadow-[0_0_8px_rgba(255,88,0,0.45)]"
        style={{
          left: useTransform(left, (value) => `${value}%`),
          backgroundColor: ACCENT,
        }}
      >
        <div
          className="absolute top-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full shadow-sm"
          style={{ backgroundColor: ACCENT }}
        />
      </motion.div>
    </div>
  );
};

const ScrollIndicator = ({
  scrollContainerId,
  direction,
  draggable,
}: {
  scrollContainerId: string;
  direction: "vertical" | "horizontal";
  draggable: boolean;
}) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setContainer(document.getElementById(scrollContainerId));
    });
    return () => {
      cancelled = true;
    };
  }, [scrollContainerId]);

  if (!container) {
    return null;
  }

  return <ScrollIndicatorBars containerElement={container} direction={direction} draggable={draggable} />;
};

export default function GlowingScrollIndicator({
  scrollContainerId,
  direction = "vertical",
  draggable = true,
}: {
  scrollContainerId?: string;
  direction?: "vertical" | "horizontal";
  /** When true, drag horizontally on the indicator to seek scroll position. */
  draggable?: boolean;
}) {
  const pathname = usePathname();

  if (scrollContainerId) {
    return (
      <ScrollIndicator key={pathname} scrollContainerId={scrollContainerId} direction={direction} draggable={draggable} />
    );
  }

  return <ScrollIndicatorBars key={pathname} containerElement={null} direction={direction} draggable={draggable} />;
}
