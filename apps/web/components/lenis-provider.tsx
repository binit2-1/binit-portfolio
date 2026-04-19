"use client";

import Lenis from "lenis";
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
function shouldUseLenis(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    let instance: Lenis | null = null;

    const stop = () => {
      if (instance) {
        instance.destroy();
        instance = null;
      }
      root.classList.remove("lenis");
      queueMicrotask(() => {
        setLenis(null);
      });
    };

    const start = () => {
      stop();
      if (!shouldUseLenis()) return;

      root.classList.add("lenis");
      instance = new Lenis({
        autoRaf: true,
        smoothWheel: true,
      });
      queueMicrotask(() => {
        setLenis(instance);
      });
    };

    start();

    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => start();
    coarse.addEventListener("change", onChange);
    reduced.addEventListener("change", onChange);

    return () => {
      coarse.removeEventListener("change", onChange);
      reduced.removeEventListener("change", onChange);
      if (instance) {
        instance.destroy();
        root.classList.remove("lenis");
      }
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
