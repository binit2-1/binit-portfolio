"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";

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
}: {
  containerElement: HTMLElement | null;
  direction: "vertical" | "horizontal";
}) => {
  const ref = React.useRef<HTMLElement | null>(containerElement);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    ref.current = containerElement;
  }, [containerElement]);

  const opacityStops = resolvedTheme === "dark" ? OPACITY_STOPS.dark : OPACITY_STOPS.light;

  const { scrollXProgress, scrollYProgress } = useScroll(
    containerElement ? { container: ref } : undefined,
  );

  const scrollProgress = direction === "vertical" ? scrollYProgress : scrollXProgress;
  const left = useTransform(scrollProgress, [0, 1], [0, 100]);

  return (
    <div className="relative flex w-fit items-end justify-center gap-0.5 md:gap-1">
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
}: {
  scrollContainerId: string;
  direction: "vertical" | "horizontal";
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

  return <ScrollIndicatorBars containerElement={container} direction={direction} />;
};

export default function GlowingScrollIndicator({
  scrollContainerId,
  direction = "vertical",
}: {
  scrollContainerId?: string;
  direction?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();

  if (scrollContainerId) {
    return <ScrollIndicator key={pathname} scrollContainerId={scrollContainerId} direction={direction} />;
  }

  return <ScrollIndicatorBars key={pathname} containerElement={null} direction={direction} />;
}
