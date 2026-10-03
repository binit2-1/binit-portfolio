"use client";

import { CheckIcon, CopyIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@repo/ui/lib/utils";

type CopyState = "idle" | "copied" | "failed";

const ICONS = { idle: CopyIcon, copied: CheckIcon, failed: XIcon } as const;
const LABELS = { idle: "Copy", copied: "Copied", failed: "Copy failed" } as const;

/** Icon-only copy button; the icon swaps to a check (or a cross on failure) for a moment. */
export function CopyButton({
  text,
  className,
  onCopied,
}: {
  text: string;
  className?: string;
  onCopied?: (text: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timeout = window.setTimeout(() => setState("idle"), 1500);
    return () => window.clearTimeout(timeout);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      onCopied?.(text);
    } catch {
      setState("failed");
    }
  };

  const Icon = ICONS[state];

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={LABELS[state]}
      title={LABELS[state]}
      className={cn(
        "grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          className="grid place-items-center"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        >
          <Icon aria-hidden className="size-3.5" weight={state === "idle" ? "regular" : "bold"} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
