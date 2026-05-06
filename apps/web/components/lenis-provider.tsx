"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import "lenis/dist/lenis.css";

const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Lenis smooth scroll is disabled on touch-primary devices (phones) and for
 * `prefers-reduced-motion` — native scrolling avoids mobile rubber-banding,
 * wrong scroll limits, and “whole page” overscroll glitches common with JS scroll.
 */
function shouldUseLenis(pathname: string): boolean {
  // Production reliability first: native scroll avoids Chromium-specific lockups
  // reported only on deployed builds.
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const isWritingArticle = /^\/writings\/[^/]+/.test(pathname);
  if (isWritingArticle) return true;
  if (process.env.NODE_ENV === "production") return false;
  // Temporary fallback: Chromium has shown intermittent scroll lock with our
  // current layout/mask stack; prefer native scrolling there for reliability.
  const ua = window.navigator.userAgent;
  if (/(Chrome|Chromium|CriOS|Edg|OPR)\/\d+/.test(ua)) return false;
  return true;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldUseLenis(pathname)) return;

    const instance = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      gestureOrientation: "vertical",
    });
    queueMicrotask(() => {
      setLenis(instance);
    });

    return () => {
      instance.destroy();
      queueMicrotask(() => {
        setLenis(null);
      });
    };
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
