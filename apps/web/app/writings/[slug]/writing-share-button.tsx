"use client";

import { Check, Copy, Share2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type WritingShareButtonProps = {
  title: string;
  shareUrl: string;
};

function openShareWindow(url: string) {
  const width = 680;
  const height = 720;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

  window.open(
    url,
    "share-writing",
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`,
  );
}

export function WritingShareButton({ title, shareUrl }: WritingShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(shareUrl);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const xShareUrl = useMemo(() => {
    const params = new URLSearchParams({
      text: `Check out: ${title}`,
      url: currentUrl,
    });

    return `https://x.com/intent/post?${params.toString()}`;
  }, [currentUrl, title]);

  const linkedInShareUrl = useMemo(() => {
    const params = new URLSearchParams({
      url: currentUrl,
    });

    return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
  }, [currentUrl]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function openDialog() {
    setCurrentUrl(window.location.href);
    setIsOpen(true);
  }

  function openIntent(url: string) {
    openShareWindow(url);
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={openDialog}
      >
        <Share2 className="size-3.5" aria-hidden="true" />
        Share
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="writing-share-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4 py-6 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-xl border border-border bg-background p-5 text-foreground shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close share dialog"
              className="absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="pr-10">
              <h2 id="writing-share-title" className="text-sm font-medium text-foreground">
                Share this post
              </h2>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                &ldquo;{title}&rdquo;
              </p>
            </div>

            <div className="mt-5">
              <label htmlFor="writing-share-url" className="text-xs font-medium text-foreground">
                Copy link
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="writing-share-url"
                  readOnly
                  value={currentUrl}
                  className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-foreground/40"
                  onFocus={(event) => event.currentTarget.select()}
                />
                <button
                  type="button"
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  aria-label={copied ? "Copied link" : "Copy link"}
                  onClick={copyLink}
                >
                  {copied ? (
                    <Check className="size-4 text-foreground" aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-medium text-foreground">Share on</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  onClick={() => openIntent(xShareUrl)}
                >
                  <span className="text-base font-semibold leading-none" aria-hidden="true">
                    X
                  </span>
                  Twitter / X
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  onClick={() => openIntent(linkedInShareUrl)}
                >
                  <span
                    className="grid size-4 place-items-center rounded-[3px] bg-foreground text-[10px] font-bold leading-none text-background"
                    aria-hidden="true"
                  >
                    in
                  </span>
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
