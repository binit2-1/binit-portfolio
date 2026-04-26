"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type WorkProjectHeadingProps = {
  label: string;
  activeIndex: number;
};

export function WorkProjectHeading({ label, activeIndex }: WorkProjectHeadingProps) {
  const [direction, setDirection] = useState(1);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const previous = prevIndexRef.current;
    setDirection(activeIndex >= previous ? 1 : -1);
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <div className="relative flex h-full w-full items-end justify-end pb-2 pr-1 md:pb-3 md:pr-2">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${activeIndex}-${label}`}
          initial={{ opacity: 0, y: direction > 0 ? -28 : 28, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: direction > 0 ? 28 : -28, filter: "blur(14px)" }}
          transition={{ duration: 0.85, ease: EASE }}
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
