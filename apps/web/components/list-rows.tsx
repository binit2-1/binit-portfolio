import { ArrowRightIcon, GithubLogoIcon, GlobeIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppIcon } from "@/components/app-icon";
import { primaryProjectUrl, type Project } from "@/lib/projects";
import type { WritingPreview } from "@/lib/writings";

/**
 * Rows have no hover box: the title brightens and underlines while the rest of the
 * page blurs (see "Hover focus" in app/globals.css). `data-focus-row` opts a row in.
 * Rows touch (padding, no margins) so moving between them doesn't flicker the blur.
 * The whole row is clickable via the title's ::after overlay; secondary links sit above it.
 */
const rowClass = "group";
const overlayLinkClass =
  "text-foreground/85 decoration-current/40 underline-offset-4 transition-colors duration-200 group-hover:text-foreground group-hover:underline after:absolute after:inset-0 after:rounded-md focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring";
const mutedTextClass = "text-muted-foreground transition-colors duration-200 group-hover:text-foreground/75";

export function SectionHeader({
  id,
  title,
  href,
  linkLabel,
}: {
  id: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2
        id={id}
        className="text-sm tracking-[0.08em] text-muted-foreground uppercase sm:text-[0.9375rem]"
      >
        {title}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="group/link inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {linkLabel}
          <ArrowRightIcon
            aria-hidden
            className="size-3.5 transition-transform group-hover/link:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}

function ProjectMark({ project }: { project: Project }) {
  const { logo, icon: Icon, tone } = project;

  return (
    <AppIcon tone={tone}>
      {logo ? (
        <Image src={logo.src} alt="" width={logo.width} height={logo.height} className={logo.className} />
      ) : Icon ? (
        <Icon className="size-4" weight="bold" />
      ) : null}
    </AppIcon>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </a>
  );
}

export function ProjectRow({ project }: { project: Project }) {
  const { slug, name, description, liveUrl, githubUrl } = project;

  return (
    <li data-preview-id={slug} data-focus-row className={`${rowClass} flex items-center gap-3 py-2.5`}>
      <ProjectMark project={project} />
      <div className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-3">
        <a
          href={primaryProjectUrl(project)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${overlayLinkClass} shrink-0`}
        >
          {name}
        </a>
        <span className={`${mutedTextClass} text-[0.9375rem] sm:truncate sm:text-base`}>
          {description}
        </span>
      </div>
      <span
        aria-hidden
        className="hidden min-w-4 flex-1 border-t border-dashed border-border transition-colors group-hover:border-foreground/20 sm:block"
      />
      <div className="relative z-10 ml-auto flex shrink-0 items-center sm:ml-0">
        {liveUrl && (
          <IconLink href={liveUrl} label={`${name} live site`}>
            <GlobeIcon className="size-4" />
          </IconLink>
        )}
        {githubUrl && (
          <IconLink href={githubUrl} label={`${name} on GitHub`}>
            <GithubLogoIcon className="size-4" />
          </IconLink>
        )}
      </div>
    </li>
  );
}

export function WritingRow({ writing }: { writing: WritingPreview }) {
  return (
    <li data-preview-id={writing.slug} data-focus-row className={`${rowClass} py-3`}>
      <Link href={writing.href} className={`${overlayLinkClass} sm:text-lg`}>
        {writing.title}
      </Link>
      <p className={`${mutedTextClass} mt-1 max-w-[62ch] text-[0.9375rem] leading-relaxed sm:text-base`}>
        {writing.subtitle}
      </p>
    </li>
  );
}

const dateFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Compact Kartik-style row for the Writing index: title, hairline, date. */
export function WritingListRow({ writing }: { writing: WritingPreview }) {
  const date = writing.date ? new Date(writing.date) : null;

  return (
    <li data-preview-id={writing.slug} data-focus-row className={`${rowClass} flex items-center gap-3 py-2.5`}>
      <Link href={writing.href} className={`${overlayLinkClass} min-w-0`}>
        {writing.title}
      </Link>
      <span
        aria-hidden
        className="hidden min-w-4 flex-1 border-t border-dashed border-border transition-colors group-hover:border-foreground/20 sm:block"
      />
      {date && (
        <time
          dateTime={writing.date}
          className={`${mutedTextClass} ml-auto shrink-0 text-sm tabular-nums sm:ml-0`}
        >
          {dateFormat.format(date)}
        </time>
      )}
    </li>
  );
}
