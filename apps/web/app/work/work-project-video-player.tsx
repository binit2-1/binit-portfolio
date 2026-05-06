"use client";

import { Skiper67 } from "@repo/ui/components/ui/skiper-ui/skiper67";
import { cn } from "@repo/ui/lib/utils";
import type { WorkProjectVideoSource } from "./work-project-types";

type WorkProjectVideoPlayerProps = {
  video?: WorkProjectVideoSource;
  className?: string;
};

function normalizeVideo(video?: WorkProjectVideoSource) {
  const fallbackSrc = "/videos/work/composter.mp4";
  const src = video?.src?.trim() || fallbackSrc;

  return {
    src,
    mobileSrc: video?.mobileSrc,
    poster: video?.poster,
    type: video?.type || "video/mp4",
  };
}

export function WorkProjectVideoPlayer({ video, className }: WorkProjectVideoPlayerProps) {
  const source = normalizeVideo(video);
  const wrapperClassName = "w-full max-w-[12rem] self-end md:max-w-[13rem]";

  return (
    <div className={cn(wrapperClassName, className)}>
      <Skiper67
        key={source.src}
        src={source.src}
        mobileSrc={source.mobileSrc}
        type={source.type}
        poster={source.poster}
      />
    </div>
  );
}
