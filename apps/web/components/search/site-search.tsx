"use client";

import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  CompassIcon,
  MagnifyingGlassIcon,
  NotebookIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@repo/ui/lib/utils";
import { Kbd } from "@/components/kbd";
import type { SearchEntry } from "@/lib/search";

/* Index: fetched once, on first open. */

let indexPromise: Promise<SearchEntry[]> | null = null;
function loadIndex() {
  indexPromise ??= fetch("/api/search")
    .then((response) => (response.ok ? response.json() : []))
    .catch(() => {
      indexPromise = null;
      return [];
    });
  return indexPromise;
}

/* Matching: every word must appear somewhere; title hits rank highest. */

type Result = SearchEntry & { score: number; snippet?: string };

const GROUPS: { type: SearchEntry["type"]; label: string; Icon: typeof CompassIcon }[] = [
  { type: "page", label: "Pages", Icon: CompassIcon },
  { type: "project", label: "Projects", Icon: BriefcaseIcon },
  { type: "writing", label: "Writing", Icon: NotebookIcon },
];
const MAX_PER_GROUP = 6;

function toWords(query: string) {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function startsWord(text: string, word: string) {
  return text.startsWith(word) || text.includes(` ${word}`);
}

function makeSnippet(body: string, words: string[]) {
  const lower = body.toLowerCase();
  const hit = words.map((word) => lower.indexOf(word)).filter((i) => i >= 0);
  if (hit.length === 0) return undefined;
  const at = Math.min(...hit);
  const start = Math.max(0, body.lastIndexOf(" ", Math.max(0, at - 40)) + 1);
  const end = Math.min(body.length, at + 110);
  return `${start > 0 ? "…" : ""}${body.slice(start, end).trim()}${end < body.length ? "…" : ""}`;
}

function search(index: SearchEntry[], query: string): Result[] {
  const words = toWords(query);
  if (words.length === 0) {
    // Nothing typed: pages, projects and whole posts (not individual sections).
    return index.filter((entry) => !entry.subtitle).map((entry) => ({ ...entry, score: 0 }));
  }

  const results: Result[] = [];
  for (const entry of index) {
    const title = entry.title.toLowerCase();
    const subtitle = entry.subtitle?.toLowerCase() ?? "";
    const body = entry.body.toLowerCase();
    let score = 0;

    for (const word of words) {
      if (title.includes(word)) score += startsWord(title, word) ? 12 : 8;
      else if (subtitle.includes(word)) score += 4;
      else if (body.includes(word)) score += startsWord(body, word) ? 2 : 1;
      else {
        score = -1;
        break;
      }
    }
    if (score > 0) results.push({ ...entry, score, snippet: makeSnippet(entry.body, words) });
  }
  return results.sort((a, b) => b.score - a.score);
}

function Highlight({ text, words }: { text: string; words: string[] }) {
  if (words.length === 0) return <>{text}</>;
  const pattern = new RegExp(
    `(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-[2px] bg-yellow-200/70 text-foreground dark:bg-yellow-400/25">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/* Platform-aware shortcut label (⌘ on Apple, Ctrl elsewhere). */

const noopSubscribe = () => () => {};
function useModifierLabel() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl"),
    () => "⌘",
  );
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/* Component */

export function SiteSearch() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const modifier = useModifierLabel();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [selected, setSelected] = useState(0);

  const openSearch = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setSelected(0);
    setOpen(true);
    loadIndex().then(setIndex);
  };

  const closeSearch = () => {
    setOpen(false);
    returnFocusRef.current?.focus();
  };

  // Global shortcuts: ⌘K / Ctrl+K toggles, "/" opens when not typing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) closeSearch();
        else openSearch();
      } else if (event.key === "/" && !open && !isTypingTarget(event.target)) {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Lock page scroll while the palette is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [open]);

  const words = useMemo(() => toWords(query), [query]);
  const groups = useMemo(() => {
    const results = index ? search(index, query) : [];
    return GROUPS.map((group) => ({
      ...group,
      items: results.filter((result) => result.type === group.type).slice(0, MAX_PER_GROUP),
    })).filter((group) => group.items.length > 0);
  }, [index, query]);
  const flat = groups.flatMap((group) => group.items);
  const activeIndex = Math.min(selected, Math.max(0, flat.length - 1));

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const go = (entry: SearchEntry) => {
    setOpen(false);
    if (entry.external) window.open(entry.href, "_blank", "noopener,noreferrer");
    else router.push(entry.href);
  };

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((activeIndex + 1) % Math.max(1, flat.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((activeIndex - 1 + flat.length) % Math.max(1, flat.length));
    } else if (event.key === "Enter" && flat[activeIndex]) {
      event.preventDefault();
      go(flat[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    } else if (event.key === "Tab") {
      event.preventDefault(); // keep focus inside the dialog
    }
  };

  let running = -1;

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="hidden items-center gap-2 rounded-lg border border-border py-1 pr-1 pl-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground sm:inline-flex"
      >
        Search
        <span className="flex items-center gap-0.5">
          <Kbd>{modifier}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        className="-mr-1.5 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground sm:hidden"
      >
        <MagnifyingGlassIcon className="size-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-background/60 px-4 pt-[12dvh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            onMouseDown={(event) => event.target === event.currentTarget && closeSearch()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search the site"
              className="flex max-h-[min(32rem,76dvh)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }}
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <MagnifyingGlassIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  autoFocus
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setSelected(0);
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search pages, projects and writing"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={flat[activeIndex] ? `${listId}-${activeIndex}` : undefined}
                  aria-autocomplete="list"
                  className="h-12 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
                <Kbd className="hidden sm:inline-flex">Esc</Kbd>
              </div>

              <div ref={listRef} id={listId} role="listbox" className="overflow-y-auto p-2">
                {index === null ? (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading…</p>
                ) : groups.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Nothing matches “{query}”.
                  </p>
                ) : (
                  groups.map(({ type, label, Icon, items }) => (
                    <div key={type} role="group" aria-label={label} className="mb-1 last:mb-0">
                      <p className="px-3 pt-2 pb-1 text-xs text-muted-foreground">{label}</p>
                      {items.map((item) => {
                        running += 1;
                        const i = running;
                        return (
                          <ResultRow
                            key={item.href}
                            id={`${listId}-${i}`}
                            index={i}
                            active={i === activeIndex}
                            onHover={() => setSelected(i)}
                            onSelect={() => go(item)}
                            icon={<Icon className="size-4" />}
                            external={item.external}
                          >
                            <span className="block truncate text-foreground">
                              <Highlight text={item.title} words={words} />
                              {item.subtitle && (
                                <span className="text-muted-foreground"> · {item.subtitle}</span>
                              )}
                            </span>
                            {words.length > 0 && item.snippet && (
                              <span className="mt-0.5 line-clamp-2 text-[0.8125rem] leading-snug text-muted-foreground">
                                <Highlight text={item.snippet} words={words} />
                              </span>
                            )}
                          </ResultRow>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              <div className="hidden items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted-foreground sm:flex">
                <span className="flex items-center gap-1">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>↵</Kbd> open
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>Esc</Kbd> close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ResultRow({
  id,
  index,
  active,
  onHover,
  onSelect,
  icon,
  external,
  children,
}: {
  id: string;
  index: number;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
  icon: ReactNode;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      data-index={index}
      onMouseMove={onHover}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm",
        active && "bg-muted",
      )}
    >
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1">{children}</span>
      {external && <ArrowUpRightIcon aria-hidden className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />}
    </div>
  );
}
