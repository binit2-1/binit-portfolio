import type { ReactNode } from "react";
import { cn } from "@repo/ui/lib/utils";

/**
 * Glossy app-style tile (reference: manuarora.in). Pick a tone per brand; each tone also tints
 * the soft drop shadow under the tile so it reads on both light and dark backgrounds.
 */
const TONES = {
  blue: "from-blue-400 to-blue-600 ring-offset-blue-500 shadow-blue-600/35",
  purple: "from-fuchsia-400 to-purple-600 ring-offset-purple-500 shadow-purple-600/35",
  green: "from-emerald-400 to-emerald-600 ring-offset-emerald-500 shadow-emerald-600/35",
  orange: "from-orange-400 to-orange-600 ring-offset-orange-500 shadow-orange-600/35",
  red: "from-red-400 to-red-600 ring-offset-red-500 shadow-red-600/35",
  black: "from-neutral-600 to-neutral-900 ring-offset-neutral-800 shadow-neutral-950/40",
} as const;

export type AppIconTone = keyof typeof TONES;

export function AppIcon({
  tone = "blue",
  className,
  children,
}: {
  tone?: AppIconTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm bg-linear-to-b align-middle text-white shadow-[0_3px_8px_-2px] ring-1 ring-white/20 ring-offset-2 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
