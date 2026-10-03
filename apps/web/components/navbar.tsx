"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@repo/ui/lib/utils";
import { AnimatedThemeToggler } from "@repo/ui/components/ruixen/animated-theme-toggler";
import { SiteSearch } from "@/components/search/site-search";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/writings", label: "Writings" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);

  // Phones: the links scroll sideways when they don't fit. Fade the right edge only while
  // something is cut off, and bring the current page's link into view.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[aria-current="page"]');
    if (active && active.offsetLeft + active.offsetWidth > list.clientWidth) {
      list.scrollLeft = active.offsetLeft + active.offsetWidth - list.clientWidth;
    }
    const update = () => {
      list.dataset.fade = String(list.scrollWidth - list.clientWidth - list.scrollLeft > 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    list.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", update);
    };
  }, [pathname]);

  return (
    <nav aria-label="Primary" className="flex items-center justify-between gap-3 pt-6 pb-8 sm:gap-4 sm:pt-8 sm:pb-10">
      <ul
        ref={listRef}
        className="flex min-w-0 items-center gap-3 overflow-x-auto overscroll-x-contain py-1 text-sm [scrollbar-width:none] data-[fade=true]:mask-r-from-[calc(100%-1.5rem)] sm:gap-8 sm:overflow-visible sm:text-base sm:data-[fade=true]:mask-none [&::-webkit-scrollbar]:hidden"
      >
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActive(pathname, href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap underline-offset-[6px] transition-colors hover:text-foreground",
                  active
                    ? "text-foreground underline decoration-muted-foreground/60 decoration-dotted"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      {/* Theme toggle lives here so it's on every page (next-themes persists the choice). */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
        <SiteSearch />
        <AnimatedThemeToggler className="-mr-1.5" />
      </div>
    </nav>
  );
}
