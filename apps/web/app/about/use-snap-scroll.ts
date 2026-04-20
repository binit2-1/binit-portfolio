"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

/**
 * Full-page snap scroll hook powered by GSAP ScrollToPlugin.
 *
 * Hijacks wheel / touch / keyboard events and smoothly animates between
 * full-viewport sections using GSAP's ScrollToPlugin for buttery-smooth,
 * physics-based scroll animations with configurable easing.
 *
 * Unlike CSS scroll-snap or plain framer-motion animate, GSAP delivers:
 * - Precise, configurable easing curves (power2, elastic, expo, etc.)
 * - Consistent cross-browser behavior
 * - No gaps or dead zones between sections
 * - Clean cancellation and overwrite of in-flight animations
 *
 * @param sectionCount    Total number of full-height sections.
 * @param duration        Scroll animation duration in seconds.
 * @param ease            GSAP ease string for the scroll animation.
 * @param swipeThreshold  Min vertical swipe distance (px) to trigger snap on touch.
 */
export function useSnapScroll({
  sectionCount,
  duration = 0.85,
  ease = "power3.inOut",
  swipeThreshold = 50,
}: {
  sectionCount: number;
  duration?: number;
  ease?: string;
  swipeThreshold?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const cooldownRef = useRef(false);

  const scrollToSection = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), sectionCount - 1);
      if (clamped === activeRef.current && !animatingRef.current) return;

      animatingRef.current = true;
      activeRef.current = clamped;
      setActiveIndex(clamped);

      const targetY = clamped * window.innerHeight;

      // Kill any in-flight scroll tweens before starting a new one
      gsap.killTweensOf(window, "scrollTo");

      gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration,
        ease,
        overwrite: true,
        onComplete: () => {
          animatingRef.current = false;
          // Small cooldown to prevent rapid-fire micro-scrolls (trackpad inertia)
          cooldownRef.current = true;
          setTimeout(() => {
            cooldownRef.current = false;
          }, 100);
        },
      });
    },
    [sectionCount, duration, ease],
  );

  useEffect(() => {
    /* ── Wheel (desktop) ── */
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (animatingRef.current || cooldownRef.current) return;
      // Ignore micro-scrolls from trackpads
      if (Math.abs(e.deltaY) < 5) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      scrollToSection(activeRef.current + dir);
    }

    /* ── Touch (mobile) ── */
    function handleTouchStart(e: TouchEvent) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }

    function handleTouchMove(e: TouchEvent) {
      // Prevent native vertical scroll when swipe is primarily vertical
      const dx = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
      const dy = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
      if (dy > dx && dy > 10) {
        e.preventDefault();
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (animatingRef.current || cooldownRef.current) return;
      const dy = touchStartRef.current.y - e.changedTouches[0].clientY;
      if (Math.abs(dy) < swipeThreshold) return;
      const dir = dy > 0 ? 1 : -1;
      scrollToSection(activeRef.current + dir);
    }

    /* ── Keyboard ── */
    function handleKeyDown(e: KeyboardEvent) {
      if (animatingRef.current || cooldownRef.current) return;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          scrollToSection(activeRef.current + 1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          scrollToSection(activeRef.current - 1);
          break;
        case "Home":
          e.preventDefault();
          scrollToSection(0);
          break;
        case "End":
          e.preventDefault();
          scrollToSection(sectionCount - 1);
          break;
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    // Ensure we start at section 0
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      gsap.killTweensOf(window);
    };
  }, [scrollToSection, swipeThreshold, sectionCount]);

  return { activeIndex, scrollToSection };
}
