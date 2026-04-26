"use client";

import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Play, Plus } from "lucide-react";
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

export const Skiper67 = ({ src, type, poster, className }: Skiper67Props) => {
  const [showVideoPopOver, setShowVideoPopOver] = useState(false);
  const resolvedSrc = src?.trim() || DEFAULT_SKIPER_VIDEO;
  const resolvedType = type?.trim() || "video/mp4";
  const youTubeId = getYouTubeId(resolvedSrc);
  const previewYouTubeEmbedSrc = youTubeId
    ? getYouTubeEmbedUrl(youTubeId, { muted: true, controls: false, loop: true })
    : null;
  const modalYouTubeEmbedSrc = youTubeId
    ? getYouTubeEmbedUrl(youTubeId, { muted: false, controls: true })
    : null;
  const previewPoster = poster || (youTubeId ? getYouTubeThumbnailUrl(youTubeId) : undefined);

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

  const previewFrameClassName = "w-28 aspect-video md:w-32";
  const previewMediaClassName = "h-full w-full object-cover";

  return (
    <section className={cn("relative flex h-full w-full items-center justify-center bg-[#f5f4f3]", className)}>
      <AnimatePresence>
        {showVideoPopOver && (
          <VideoPopOver
            setShowVideoPopOver={setShowVideoPopOver}
            src={resolvedSrc}
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
        onClick={() => setShowVideoPopOver(true)}
        className={previewFrameClassName}
      >
        <motion.div
          style={{ x, y, opacity }}
          className="relative z-20 flex w-fit select-none items-center justify-center gap-2 p-2 text-sm text-white mix-blend-exclusion"
        >
          <Play className="size-4 fill-white" /> Play
        </motion.div>
        {youTubeId ? (
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
          >
            <source src={resolvedSrc} type={resolvedType} />
          </video>
        )}
      </div>
    </section>
  );
};

const VideoPopOver = ({
  setShowVideoPopOver,
  src,
  type,
  youTubeEmbedSrc,
  poster,
}: {
  setShowVideoPopOver: (showVideoPopOver: boolean) => void;
  src: string;
  type: string;
  youTubeEmbedSrc: string | null;
  poster?: string;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowVideoPopOver(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setShowVideoPopOver]);

  useEffect(() => {
    if (youTubeEmbedSrc) return;

    const video = modalRef.current?.querySelector("video");
    if (!video) return;

    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;
    void video.play().catch(() => {});
  }, [youTubeEmbedSrc]);

  const modalFrameClassName =
    "relative aspect-video max-h-[72vh] w-[min(84vw,620px)] overflow-hidden rounded-2xl bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:w-[min(42vw,620px)]";
  const mediaClassName = "h-full w-full object-cover";

  return (
    <div className="fixed inset-0 z-[101]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-background/90 absolute inset-0 h-full w-full backdrop-blur-lg"
        onClick={() => setShowVideoPopOver(false)}
      ></motion.div>
      <div className="absolute inset-0 grid place-items-center px-4 py-8">
        <motion.div
          ref={modalRef}
          initial={{ clipPath: "inset(43.5% 43.5% 33.5% 43.5% )", opacity: 0 }}
          animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
          exit={{
            clipPath: "inset(43.5% 43.5% 33.5% 43.5% )",
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
                style={{ width: "100%", height: "100%" }}
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
          <span
            onClick={() => setShowVideoPopOver(false)}
            className="absolute right-2 top-2 z-10 cursor-pointer rounded-full p-1 transition-colors"
          >
            <Plus className="size-5 rotate-45 text-white" />
          </span>
        </motion.div>
      </div>
    </div>
  );
};
