"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writings", label: "Writings" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      data-site-navbar="true"
      className="fixed inset-x-0 top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] supports-[backdrop-filter]:bg-background/70"
    >
      <div className="mx-auto flex w-full max-w-(--site-max-width) min-w-0 items-center justify-center px-4 py-4 sm:px-6">
        <ul className="flex min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-6 md:gap-x-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "whitespace-nowrap text-xs font-normal transition-colors hover:text-foreground sm:text-sm",
                  pathname === href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
