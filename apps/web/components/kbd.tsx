import type { ComponentProps } from "react";
import { cn } from "@repo/ui/lib/utils";

export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-sans text-[0.6875rem] leading-none font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
