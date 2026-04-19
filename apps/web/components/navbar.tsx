"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { ThemeToggleButton } from "@repo/ui/components/ui/skiper-ui/skiper26";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writings", label: "Writings" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full shrink-0 border-b border-border/40 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex w-full max-w-(--site-max-width) items-center justify-center px-6 py-4">
        <ul className="flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "font-normal text-sm transition-colors hover:text-foreground",
                  pathname === href ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </Link>
            </li>
          ))}
          <ThemeToggleButton variant="circle" start="center" blur className="size-6" />
        </ul>
      </div>
    </nav>
  );
}
