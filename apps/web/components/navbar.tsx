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
    <header className="fixed inset-x-0 top-4 z-50">
      <nav className="mx-auto flex w-fit items-center gap-5 rounded-full border border-border/40 bg-background/65 px-4 py-2 backdrop-blur-xl">
        <ul className="flex items-center gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "text-xs tracking-wide transition-colors hover:text-foreground",
                  pathname === href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeToggleButton variant="circle" start="center" blur className="size-8" />
      </nav>
    </header>
  );
}
