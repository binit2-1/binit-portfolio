"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@repo/ui/lib/utils";

export function ThemeToggleButton({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    if ("startViewTransition" in document) {
      // Keep transitions smooth when the browser supports View Transitions.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (document as any).startViewTransition(() => setTheme(nextTheme));
      return;
    }

    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={cn(
        "relative flex h-9 w-16 items-center rounded-full border border-border/70 bg-background/70 p-1 transition-colors",
        className
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 550, damping: 32 }}
        className="absolute left-1 top-1 h-7 w-7 rounded-full bg-foreground/90"
        animate={{ x: isDark ? 28 : 0 }}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1">
        <Sun className={cn("h-3.5 w-3.5", isDark ? "text-muted-foreground" : "text-background")} />
        <Moon className={cn("h-3.5 w-3.5", isDark ? "text-background" : "text-muted-foreground")} />
      </span>
    </button>
  );
}
