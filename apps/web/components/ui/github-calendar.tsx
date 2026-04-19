"use client";

import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

/** Peak activity — lower levels are lighter tints of the same hue. */
const ACCENT = "#FF5800";

const LEVEL_BG: Record<
  "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE",
  string
> = {
  NONE: "transparent",
  FIRST_QUARTILE: "#FFE8DC",
  SECOND_QUARTILE: "#FFC299",
  THIRD_QUARTILE: "#FF8F40",
  FOURTH_QUARTILE: ACCENT,
};

interface ContributionDay {
  color: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
}

interface GithubContributionData {
  contributions: ContributionDay[][];
  totalContributions: number;
}

export interface GithubCalendarProps {
  username: string;
  variant?: "default" | "city-lights" | "minimal";
  shape?: "square" | "rounded" | "circle" | "squircle";
  glowIntensity?: number;
  className?: string;
  showTotal?: boolean;
  colorSchema?: "green" | "blue" | "purple" | "orange" | "gray";
}

function getShapeClass(shape: string) {
  switch (shape) {
    case "circle":
      return "rounded-full";
    case "square":
      return "rounded-none";
    case "squircle":
      return "rounded-sm";
    case "rounded":
    default:
      return "rounded-[2px]";
  }
}

function cellBackground(
  level: ContributionDay["contributionLevel"],
  colorSchema: GithubCalendarProps["colorSchema"],
): { className?: string; style?: React.CSSProperties } {
  if (colorSchema === "orange") {
    if (level === "NONE") {
      return { className: "bg-zinc-100 dark:bg-zinc-900/80" };
    }
    return { style: { backgroundColor: LEVEL_BG[level] } };
  }
  return { className: legacyLevelClass(level, colorSchema ?? "gray") };
}

/** Preset schemas when not using brand orange. */
function legacyLevelClass(
  level: ContributionDay["contributionLevel"],
  schema: NonNullable<GithubCalendarProps["colorSchema"]>,
): string {
  const schemas = {
    gray: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-zinc-300 dark:bg-zinc-800",
      SECOND_QUARTILE: "bg-zinc-400 dark:bg-zinc-700",
      THIRD_QUARTILE: "bg-zinc-600 dark:bg-zinc-500",
      FOURTH_QUARTILE: "bg-zinc-800 dark:bg-zinc-300",
    },
    green: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-emerald-200 dark:bg-emerald-900",
      SECOND_QUARTILE: "bg-emerald-300 dark:bg-emerald-700",
      THIRD_QUARTILE: "bg-emerald-400 dark:bg-emerald-500",
      FOURTH_QUARTILE: "bg-emerald-500 dark:bg-emerald-400",
    },
    blue: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-blue-200 dark:bg-blue-900",
      SECOND_QUARTILE: "bg-blue-300 dark:bg-blue-700",
      THIRD_QUARTILE: "bg-blue-400 dark:bg-blue-500",
      FOURTH_QUARTILE: "bg-blue-500 dark:bg-blue-400",
    },
    purple: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-purple-200 dark:bg-purple-900",
      SECOND_QUARTILE: "bg-purple-300 dark:bg-purple-700",
      THIRD_QUARTILE: "bg-purple-400 dark:bg-purple-500",
      FOURTH_QUARTILE: "bg-purple-500 dark:bg-purple-400",
    },
    orange: {
      NONE: "bg-zinc-100 dark:bg-zinc-900",
      FIRST_QUARTILE: "bg-orange-200 dark:bg-orange-900",
      SECOND_QUARTILE: "bg-orange-300 dark:bg-orange-700",
      THIRD_QUARTILE: "bg-orange-400 dark:bg-orange-500",
      FOURTH_QUARTILE: "bg-orange-500 dark:bg-orange-400",
    },
  } as const;
  return schemas[schema][level];
}

export function GithubCalendar({
  username,
  variant = "default",
  shape = "rounded",
  glowIntensity = 5,
  className,
  showTotal = true,
  colorSchema = "orange",
}: GithubCalendarProps) {
  const [data, setData] = React.useState<GithubContributionData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }
        const jsonData = (await response.json()) as GithubContributionData;
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      void fetchData();
    }
  }, [username]);

  if (error) {
    return (
      <p className="text-center text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }

  if (loading) {
    return (
      <div
        className={cn("flex w-full max-w-full justify-center gap-px overflow-x-hidden", className)}
        aria-busy
        aria-label="Loading contribution calendar"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-px sm:gap-1">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="size-[5px] rounded-[2px] bg-muted sm:size-2.5" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const weeks = data?.contributions ?? [];
  const useBrandOrange = colorSchema === "orange";
  const shapeClass = getShapeClass(shape);

  return (
    <div className={cn("flex w-full min-w-0 max-w-full flex-col gap-3", className)}>
      {showTotal && (
        <p className="break-words text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">@{username}</span> — {data?.totalContributions ?? 0}{" "}
          contributions in the last year
        </p>
      )}

      <div className="flex w-full min-w-0 max-w-full justify-center gap-px overflow-x-hidden pb-1 sm:gap-[3px] md:gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-px sm:gap-[3px] md:gap-1">
            {week.map((day) => {
              const isGlowing = variant === "city-lights" && day.contributionCount > 0;
              const isMinimal = variant === "minimal";
              const bg = cellBackground(day.contributionLevel, colorSchema);

              return (
                <div
                  key={day.date}
                  title={`${day.contributionCount} contributions on ${day.date}`}
                  className={cn(
                    "aspect-square w-[5px] shrink-0 transition-colors duration-200 sm:w-2.5 md:w-3",
                    bg.className,
                    shapeClass,
                    isMinimal && "scale-75 rounded-full",
                    isGlowing && "z-10",
                  )}
                  style={{
                    ...bg.style,
                    ...(isGlowing && day.contributionLevel !== "NONE"
                      ? {
                          boxShadow: `0 0 ${
                            day.contributionCount > 3 ? glowIntensity * 1.5 : glowIntensity
                          }px ${useBrandOrange ? ACCENT : "#f97316"}`,
                        }
                      : undefined),
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
