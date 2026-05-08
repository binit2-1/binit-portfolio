"use client";

import { Check, ClipboardText } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type WritingCopyButtonProps = {
  value: string;
};

export function WritingCopyButton({ value }: WritingCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const Icon = copied ? Check : ClipboardText;

  return (
    <button
      type="button"
      aria-label={copied ? "Code copied" : "Copy code"}
      title={copied ? "Copied" : "Copy"}
      onClick={copyCode}
      className="absolute right-3 top-3 grid size-8 place-items-center rounded-sm text-muted-foreground/75 transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Icon className="size-4" aria-hidden="true" weight={copied ? "bold" : "regular"} />
    </button>
  );
}
