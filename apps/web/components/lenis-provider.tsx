"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import "lenis/dist/lenis.css";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("lenis");

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
    });

    return () => {
      lenis.destroy();
      root.classList.remove("lenis");
    };
  }, []);

  return <>{children}</>;
}
