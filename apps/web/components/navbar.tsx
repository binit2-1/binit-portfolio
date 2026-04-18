"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";

const NAV_LINKS = [
  { href: "/",        label: "Home"     },
  { href: "/about",   label: "About"    },
  { href: "/work",    label: "Work"     },
  { href: "/writings",label: "Writings" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          binit.dev
        </Link>
        <ul className="flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  pathname === href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
