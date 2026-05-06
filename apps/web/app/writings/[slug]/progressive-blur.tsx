import type { CSSProperties } from "react";

type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
};

export function ProgressiveBlur({
  className = "",
  backgroundColor = "var(--background)",
  position = "top",
  height = "150px",
  blurAmount = "5px",
}: ProgressiveBlurProps) {
  const isTop = position === "top";
  const style = {
    [isTop ? "top" : "bottom"]: 0,
    height,
    background: isTop
      ? `linear-gradient(to bottom, ${backgroundColor}, transparent)`
      : `linear-gradient(to top, ${backgroundColor}, transparent)`,
    maskImage: isTop ? "linear-gradient(to bottom, black 55%, transparent)" : "linear-gradient(to top, black 55%, transparent)",
    WebkitMaskImage: isTop
      ? "linear-gradient(to bottom, black 55%, transparent)"
      : "linear-gradient(to top, black 55%, transparent)",
    WebkitBackdropFilter: `blur(${blurAmount})`,
    backdropFilter: `blur(${blurAmount})`,
    WebkitUserSelect: "none",
    userSelect: "none",
  } as CSSProperties;

  return (
    <div
      className={`pointer-events-none fixed left-0 z-40 w-full select-none ${className}`}
      style={style}
      aria-hidden
    />
  );
}
