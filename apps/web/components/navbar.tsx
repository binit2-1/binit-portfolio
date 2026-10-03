"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writings", label: "Writing" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="pt-8 pb-10 sm:pt-12 sm:pb-14">
      <ul className="flex items-center gap-6 text-[0.9375rem] sm:gap-8 sm:text-base">
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActive(pathname, href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "underline-offset-[6px] transition-colors hover:text-foreground",
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
    </nav>
  );
}
