"use client";

import { Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type WritingVideoSource = {
  src: string;
  type: string;
  media?: string;
};

type WritingVideoPlayerProps = {
  sources: WritingVideoSource[];
  alt: string;
  poster?: string;
  autoPlay: boolean;
  loop: boolean;
  muted: boolean;
};

function VideoSources({ sources }: { sources: WritingVideoSource[] }) {
  return (
    <>
      {sources.map((source) => (
        <source
          key={`${source.media || "default"}:${source.src}`}
          src={source.src}
          type={source.type}
          media={source.media}
        />
      ))}
    </>
  );
}

export function WritingVideoPlayer({
  sources,
  alt,
  poster,
  autoPlay,
  loop,
  muted,
}: WritingVideoPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const hasSources = sources.length > 0;

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;

    const video = modalVideoRef.current;
    if (!video) return;

    void video.play().catch(() => {});
  }, [isExpanded]);

  if (!hasSources) return null;

  return (
    <>
      <button
        type="button"
        aria-label={alt ? `Open video larger: ${alt}` : "Open video larger"}
        onClick={() => setIsExpanded(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-md border border-border/55 bg-black text-left shadow-[0_16px_50px_rgba(0,0,0,0.14)] transition-transform duration-300 hover:scale-[1.006] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5800] focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/8"
      >
        <video
          autoPlay={autoPlay}
          muted={muted || autoPlay}
          loop={loop}
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          className="h-full w-full bg-black object-contain"
        >
          <VideoSources sources={sources} />
        </video>
        <span className="pointer-events-none absolute right-2 top-2 grid size-8 place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors group-hover:bg-black/65">
          <Maximize2 className="size-3.5" aria-hidden="true" />
        </span>
      </button>

      {isExpanded ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt ? `Expanded video: ${alt}` : "Expanded video"}
          className="fixed inset-0 z-1000 flex items-center justify-center overflow-hidden bg-background/92 px-3 py-7 backdrop-blur-xl sm:px-6 sm:py-8"
          onClick={() => setIsExpanded(false)}
        >
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setIsExpanded(false)}
            className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full border border-border/60 bg-background/85 text-foreground shadow-[0_12px_36px_rgba(0,0,0,0.22)] backdrop-blur-md transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5800]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>

          <div
            className="relative flex w-full max-w-5xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <video
              ref={modalVideoRef}
              controls
              autoPlay
              muted={muted && autoPlay}
              loop={loop}
              playsInline
              preload="metadata"
              poster={poster}
              aria-label={alt || undefined}
              className="aspect-video max-h-[calc(100dvh-4.5rem)] w-full rounded-md bg-black object-contain shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:max-h-[82dvh]"
            >
              <VideoSources sources={sources} />
            </video>
          </div>
        </div>
      ) : null}
    </>
  );
}
