"use client";

import { AnimatePresence, motion, useSpring } from "framer-motion";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import { Play } from "lucide-react";
import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";
import type { ComponentProps } from "react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@repo/ui/lib/utils";

export type VideoPlayerProps = ComponentProps<typeof MediaController>;

export const VideoPlayer = ({ style, ...props }: VideoPlayerProps) => (
  <MediaController
    style={{
      ...style,
    }}
    {...props}
  />
);

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>;

export const VideoPlayerControlBar = (props: VideoPlayerControlBarProps) => (
  <MediaControlBar {...props} />
);

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>;

export const VideoPlayerTimeRange = ({
  className,
  ...props
}: VideoPlayerTimeRangeProps) => (
  <MediaTimeRange
    className={cn(
      "[--media-range-thumb-opacity:0] [--media-range-track-height:2px]",
      className,
    )}
    {...props}
  />
);

export type VideoPlayerTimeDisplayProps = ComponentProps<
  typeof MediaTimeDisplay
>;

export const VideoPlayerTimeDisplay = ({
  className,
  ...props
}: VideoPlayerTimeDisplayProps) => (
  <MediaTimeDisplay className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerVolumeRangeProps = ComponentProps<
  typeof MediaVolumeRange
>;

export const VideoPlayerVolumeRange = ({
  className,
  ...props
}: VideoPlayerVolumeRangeProps) => (
  <MediaVolumeRange className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>;

export const VideoPlayerPlayButton = ({
  className,
  ...props
}: VideoPlayerPlayButtonProps) => (
  <MediaPlayButton className={cn("", className)} {...props} />
);

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<
  typeof MediaSeekBackwardButton
>;

export const VideoPlayerSeekBackwardButton = ({
  className,
  ...props
}: VideoPlayerSeekBackwardButtonProps) => (
  <MediaSeekBackwardButton className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerSeekForwardButtonProps = ComponentProps<
  typeof MediaSeekForwardButton
>;

export const VideoPlayerSeekForwardButton = ({
  className,
  ...props
}: VideoPlayerSeekForwardButtonProps) => (
  <MediaSeekForwardButton className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>;

export const VideoPlayerMuteButton = ({
  className,
  ...props
}: VideoPlayerMuteButtonProps) => (
  <MediaMuteButton className={cn("", className)} {...props} />
);

export type VideoPlayerContentProps = ComponentProps<"video">;

export const VideoPlayerContent = ({
  className,
  ...props
}: VideoPlayerContentProps) => (
  <video className={cn("mb-0 mt-0", className)} {...props} />
);

export type Skiper67Props = {
  src?: string;
  mobileSrc?: string;
  type?: string;
  poster?: string;
  className?: string;
};

const DEFAULT_SKIPER_VIDEO = "/showreel/skiper-ui-showreel.mp4";

function getYouTubeId(input: string) {
  try {
    const url = new URL(input);
    const hostname = url.hostname.toLowerCase();

    if (hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.replace("/embed/", "").split("/")[0] || null;
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.replace("/shorts/", "").split("/")[0] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getYouTubeEmbedUrl(
  videoId: string,
  options: {
    muted: boolean;
    controls: boolean;
    loop?: boolean;
  },
) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: options.muted ? "1" : "0",
    controls: options.controls ? "1" : "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });

  if (options.loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function getYouTubeThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

const MODAL_EXIT_DURATION_MS = 1000;

export const Skiper67 = ({ src, mobileSrc, type, poster, className }: Skiper67Props) => {
  const [showVideoPopOver, setShowVideoPopOver] = useState(false);
  const [preferLightweightMedia, setPreferLightweightMedia] = useState(true);
  const resolvedSrc = src?.trim() || DEFAULT_SKIPER_VIDEO;
  const resolvedMobileSrc = mobileSrc?.trim();
  const resolvedType = type?.trim() || "video/mp4";
  const youTubeId = getYouTubeId(resolvedSrc);
  const previewYouTubeEmbedSrc = youTubeId
    ? getYouTubeEmbedUrl(youTubeId, { muted: true, controls: false, loop: true })
    : null;
  const modalYouTubeEmbedSrc = youTubeId
    ? getYouTubeEmbedUrl(youTubeId, { muted: false, controls: true })
    : null;
  const previewPoster = poster || (youTubeId ? getYouTubeThumbnailUrl(youTubeId) : undefined);
  const previewVideoSrc = resolvedMobileSrc || resolvedSrc;
  const modalVideoSrc = preferLightweightMedia && resolvedMobileSrc ? resolvedMobileSrc : resolvedSrc;
  const shouldUsePosterPreview = preferLightweightMedia && Boolean(previewPoster);

  const SPRING = {
    mass: 0.1,
  };

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const opacity = useSpring(0, SPRING);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    opacity.set(1);
    const bounds = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - bounds.left);
    y.set(e.clientY - bounds.top);
  };

  const openVideoPopOver = () => {
    document.body.setAttribute("data-work-video-modal-open", "true");
    setShowVideoPopOver(true);
  };

  const closeVideoPopOver = () => {
    setShowVideoPopOver(false);
  };

  const handlePreviewKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openVideoPopOver();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(pointer: coarse), (max-width: 640px), (prefers-reduced-motion: reduce)",
    );
    const syncPreference = () => setPreferLightweightMedia(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    if (showVideoPopOver) return;

    const timeout = window.setTimeout(() => {
      document.body.removeAttribute("data-work-video-modal-open");
    }, MODAL_EXIT_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [showVideoPopOver]);

  const previewFrameClassName = "w-28 aspect-video md:w-32";
  const previewMediaClassName = "h-full w-full object-cover";

  return (
    <section className={cn("relative flex w-full items-center justify-center bg-transparent", className)}>
      <AnimatePresence>
        {showVideoPopOver && (
          <VideoPopOver
            closeVideoPopOver={closeVideoPopOver}
            src={modalVideoSrc}
            type={resolvedType}
            youTubeEmbedSrc={modalYouTubeEmbedSrc}
            poster={poster}
          />
        )}
      </AnimatePresence>
      <div
        onMouseMove={handlePointerMove}
        onMouseLeave={() => {
          opacity.set(0);
        }}
        onClick={openVideoPopOver}
        onKeyDown={handlePreviewKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Open project video"
        className={previewFrameClassName}
      >
        <motion.div
          style={{ x, y, opacity }}
          className="relative z-20 flex w-fit select-none items-center justify-center gap-2 p-2 text-sm text-white mix-blend-exclusion"
        >
          <Play className="size-4 fill-white" /> Play
        </motion.div>
        {shouldUsePosterPreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- Static public posters prevent heavy preview video downloads on phones.
          <img
            src={previewPoster}
            alt=""
            className={previewMediaClassName}
            loading="eager"
            decoding="async"
          />
        ) : youTubeId ? (
          <div className="relative h-full w-full overflow-hidden">
            <iframe
              src={previewYouTubeEmbedSrc || undefined}
              allow="autoplay; encrypted-media; picture-in-picture"
              className="pointer-events-none h-full w-full scale-[1.12]"
              title="YouTube video preview"
              tabIndex={-1}
            />
          </div>
        ) : (
          <video
            autoPlay
            muted
            playsInline
            loop
            poster={previewPoster}
            className={previewMediaClassName}
            style={{ objectFit: "cover" }}
            preload={preferLightweightMedia && previewPoster ? "none" : "metadata"}
          >
            <source src={previewVideoSrc} type={resolvedType} />
          </video>
        )}
      </div>
    </section>
  );
};

const VideoPopOver = ({
  closeVideoPopOver,
  src,
  type,
  youTubeEmbedSrc,
  poster,
}: {
  closeVideoPopOver: () => void;
  src: string;
  type: string;
  youTubeEmbedSrc: string | null;
  poster?: string;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeVideoPopOver();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeVideoPopOver]);

  useEffect(() => {
    if (youTubeEmbedSrc) return;

    const video = modalRef.current?.querySelector("video");
    if (!video) return;

    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    void video.play().catch(() => {});
  }, [youTubeEmbedSrc]);

  const modalShellClassName =
    "relative h-[100dvh] w-full sm:h-auto sm:aspect-video sm:max-h-[72vh] sm:w-[min(84vw,620px)] md:w-[min(42vw,620px)]";
  const modalFrameClassName =
    "relative h-full w-full overflow-hidden bg-black sm:rounded-2xl sm:shadow-[0_20px_60px_rgba(0,0,0,0.45)]";
  const mediaClassName = "h-full w-full object-cover";

  if (!portalContainer) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] isolate" data-work-video-modal="true">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-background absolute inset-0 h-full w-full"
        onClick={closeVideoPopOver}
      ></motion.div>
      <div className="absolute inset-0 grid place-items-center px-0 py-0 sm:px-4 sm:py-8">
        <div className={modalShellClassName}>
          <button
            type="button"
            onClick={closeVideoPopOver}
            aria-label="Close video"
            className="absolute right-4  z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/80 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-3 sm:top-3"
          >
            <XIcon size={28} weight="bold" />
          </button>
          <motion.div
            ref={modalRef}
            initial={{ clipPath: "inset(43.5% 43.5% 33.5% 43.5%)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
            exit={{
              clipPath: "inset(43.5% 43.5% 33.5% 43.5%)",
              opacity: 0,
              transition: {
                duration: 1,
                type: "spring",
                stiffness: 100,
                damping: 20,
                opacity: { duration: 0.2, delay: 0.8 },
              },
            }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            className={modalFrameClassName}
          >
            {youTubeEmbedSrc ? (
              <iframe
                src={youTubeEmbedSrc}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
                title="YouTube video player"
              />
            ) : (
              <VideoPlayer style={{ width: "100%", height: "100%" }}>
                <VideoPlayerContent
                  src={src}
                  autoPlay
                  playsInline
                  slot="media"
                  className={mediaClassName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  poster={poster}
                >
                  <source src={src} type={type} />
                </VideoPlayerContent>
                <VideoPlayerControlBar className="absolute bottom-0 left-1/2 flex w-full max-w-7xl -translate-x-1/2 items-center justify-center px-5 mix-blend-exclusion md:px-10 md:py-5">
                  <VideoPlayerPlayButton className="h-4 bg-transparent" />
                  <VideoPlayerTimeRange className="bg-transparent" />
                  <VideoPlayerMuteButton className="size-4 bg-transparent" />
                </VideoPlayerControlBar>
              </VideoPlayer>
            )}
          </motion.div>
        </div>
      </div>
    </div>,
    portalContainer,
  );
};
