import Image from "next/image";
import type { CSSProperties } from "react";

type WritingThumbnailProps = {
  title: string;
  thumbnail?: string;
  index?: number;
  className?: string;
  viewTransitionName?: string;
};

export function WritingThumbnail({
  title,
  thumbnail,
  index = 0,
  className = "",
  viewTransitionName,
}: WritingThumbnailProps) {
  const style = viewTransitionName ? ({ viewTransitionName } as CSSProperties) : undefined;
  const thumbnailSrc = thumbnail?.trim();
  const hasThumbnail = Boolean(thumbnailSrc);
  const isRemoteThumbnail = thumbnailSrc?.startsWith("http://") || thumbnailSrc?.startsWith("https://");

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-sm border border-white/10 bg-[#171717] shadow-[0_10px_40px_rgba(0,0,0,0.32)] ${className}`}
      style={style}
    >
      {hasThumbnail ? (
        <Image
          src={thumbnailSrc || ""}
          alt={title}
          fill
          priority={index === 0}
          sizes="(min-width: 768px) 44rem, calc(100vw - 2rem)"
          className="object-cover"
          unoptimized={isRemoteThumbnail}
        />
      ) : (
        <div className="relative h-full w-full bg-[linear-gradient(135deg,rgba(255,88,0,0.22),transparent_36%),repeating-linear-gradient(0deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_8px),repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_12px)]">
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5800]" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
          <div className="absolute bottom-3 left-3 max-w-[70%] truncate font-mono text-[10px] tracking-[0.16em] text-white/45 uppercase">
            {title}
          </div>
          <div className="absolute right-3 bottom-3 font-mono text-[10px] tracking-[0.16em] text-white/38">
            DRAFT {String(index + 1).padStart(2, "0")}
          </div>
        </div>
      )}
    </div>
  );
}
