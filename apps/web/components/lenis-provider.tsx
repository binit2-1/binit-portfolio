"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";

import "lenis/dist/lenis.css";

const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("lenis");

    const instance = new Lenis({
      autoRaf: true,
      smoothWheel: true,
    });
    queueMicrotask(() => {
      setLenis(instance);
    });

    return () => {
      instance.destroy();
      root.classList.remove("lenis");
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
