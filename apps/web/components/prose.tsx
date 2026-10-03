import Link from "next/link";
import type { ReactNode } from "react";

/** Body link with the site's dotted underline. External URLs open in a new tab. */
export function InlineLink({ href, children, rel }: { href: string; children: ReactNode; rel?: string }) {
  const className =
    "text-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 transition-colors hover:decoration-foreground";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel={rel ?? "noopener noreferrer"} className={className}>
      {children}
    </a>
  );
}

/** Dotted section divider used between page sections. */
export function Divider() {
  return (
    <hr className="my-8 h-px border-0 bg-[linear-gradient(to_right,var(--muted-foreground)_50%,transparent_0)] bg-size-[4px_1px] opacity-40 mask-x-from-80% sm:my-10" />
  );
}

/** Page title block shared by Works, Writings, About and Services. */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header>
      <h1 className="text-3xl leading-tight font-normal tracking-[-0.02em] sm:text-4xl">{title}</h1>
      {children && (
        <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
          {children}
        </p>
      )}
    </header>
  );
}
