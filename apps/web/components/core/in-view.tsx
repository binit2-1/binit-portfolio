"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useInView,
  type Transition,
  type Variant,
} from "framer-motion";

export type InViewProps = {
  children: ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  /** Passed to `useInView` (e.g. margin, amount, once). */
  viewOptions?: Parameters<typeof useInView>[1];
  /** Wrapper element for the motion root. */
  as?: "div" | "section";
  /** When true, content stays visible after first reveal (even if scrolled away). */
  once?: boolean;
  className?: string;
};

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  as = "div",
  once = false,
  className,
}: InViewProps) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    ...viewOptions,
    once: viewOptions?.once ?? once,
  });

  const animate = isInView ? "visible" : "hidden";

  const motionProps = {
    ref,
    className,
    initial: "hidden" as const,
    animate,
    variants,
    transition,
    children,
  };

  return as === "section" ? (
    <motion.section {...motionProps} />
  ) : (
    <motion.div {...motionProps} />
  );
}
