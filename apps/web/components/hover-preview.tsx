"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useRef, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import type { PreviewMedia } from "@/lib/previews";

/** Preview card size: w-56 at 16:9. Kept in sync with the classes below. */
const CARD_HEIGHT = 126;

type ActiveRow = { id: string; center: number };

/**
 * Designer-dada-style hover preview. Rows stay server-rendered; any descendant
 * with `data-preview-id` shows its media in the left gutter, aligned to the row.
 * Only on wide screens with a real pointer, where the gutter can hold the card.
 */
export function HoverPreviewList({
  media,
  className,
  children,
}: {
  media: Record<string, PreviewMedia>;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<ActiveRow | null>(null);
  const [visible, setVisible] = useState(false);

  const activate = (target: EventTarget | null) => {
    const container = ref.current;
    const row = target instanceof Element ? target.closest<HTMLElement>("[data-preview-id]") : null;
    if (!container || !row || !container.contains(row)) return;

    const id = row.dataset.previewId!;
    if (!media[id]) return;
    const rowBox = row.getBoundingClientRect();
    const box = container.getBoundingClientRect();
    setActive({ id, center: rowBox.top - box.top + rowBox.height / 2 });
    setVisible(true);
  };

  const item = active ? media[active.id] : undefined;
  const spring = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.6 };

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onPointerOver={(event) => event.pointerType === "mouse" && activate(event.target)}
      onPointerLeave={() => setVisible(false)}
      onFocus={(event) => activate(event.target)}
      onBlur={(event) => {
        if (!ref.current?.contains(event.relatedTarget as Node | null)) setVisible(false);
      }}
    >
      {children}

      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-full z-(--focus-z) mr-8 hidden w-56 xl:block [@media(hover:none)]:hidden"
      >
        <motion.div
          initial={false}
          animate={{
            opacity: visible && item ? 1 : 0,
            scale: visible && item ? 1 : 0.94,
            y: (active?.center ?? 0) - CARD_HEIGHT / 2,
          }}
          transition={{ ...spring, opacity: { duration: 0.15 } }}
          className="relative aspect-video w-56 overflow-hidden rounded-xl bg-muted shadow-xl ring-1 ring-foreground/10"
        >
          <AnimatePresence initial={false}>
            {active && item && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.18 }}
                className="absolute inset-0"
              >
                {item.kind === "video" ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="size-full object-cover"
                  />
                ) : (
                  // Remote og:images vary by host; a plain img avoids per-host config.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.src} alt="" className="size-full object-cover" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
