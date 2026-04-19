"use client";

/**
 * About scroll mask: opaque panels + center “window”. Includes a full-bleed strip
 * under the navbar (z-39) so copy cannot show through between measured `--site-nav-h`
 * and the real sticky bar height; main content stays z-10.
 */
export function AboutViewportMask({
  onHoleRef,
}: {
  onHoleRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <>
      {/* Blocks bleed in the band directly under the nav (height mismatch / subpixels). */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-39 bg-background"
        style={{ height: "calc(var(--site-nav-h) + var(--about-mask-belt))" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed right-0 bottom-0 left-0 z-38 grid grid-cols-[min(1.5rem,5vw)_1fr_min(1.5rem,5vw)] grid-rows-[1fr_min(60dvh,min(560px,85dvh))_1fr]"
        style={{ top: "calc(var(--site-nav-h) + var(--about-mask-belt))" }}
        aria-hidden
      >
        <div className="pointer-events-none col-span-3 row-start-1 bg-background" />
        <div className="pointer-events-none row-start-2 col-start-1 bg-background" />
        {/* No overlays here: gradient “feather” layers sat above z-10 copy and showed the next
            section through semi-transparent areas — reads as a dark ghost band under the hero. */}
        <div ref={onHoleRef} className="relative row-start-2 col-start-2 min-h-0 min-w-0" />
        <div className="pointer-events-none row-start-2 col-start-3 bg-background" />
        <div className="pointer-events-none col-span-3 row-start-3 bg-background" />
      </div>
    </>
  );
}
