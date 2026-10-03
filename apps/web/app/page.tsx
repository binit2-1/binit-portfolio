import type { ReactNode } from "react";
import { AppIcon, type AppIconTone } from "@/components/app-icon";
import { Linkedin, PeerlistSolid, X } from "@/components/icons";
import { GithubGraph } from "@/components/unlumen-ui/github-graph";
import { PROJECTS } from "@/lib/projects";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { getWritingPreviews } from "@/lib/writings";

const GITHUB_USERNAME = "binit2-1";

const SOCIAL_ITEMS: { href: string; label: string; tone: AppIconTone; Icon: typeof X }[] = [
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", tone: "blue", Icon: Linkedin },
  { href: SOCIAL_LINKS.peerlist, label: "Peerlist", tone: "green", Icon: PeerlistSolid },
  { href: SOCIAL_LINKS.x, label: "X", tone: "black", Icon: X },
];

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 transition-colors hover:decoration-foreground"
    >
      {children}
    </a>
  );
}

function Divider() {
  return (
    <hr className="my-10 h-px border-0 bg-[linear-gradient(to_right,var(--muted-foreground)_50%,transparent_0)] bg-size-[4px_1px] opacity-40 mask-x-from-80% sm:my-14" />
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="mb-5 text-sm tracking-[0.08em] text-muted-foreground uppercase sm:mb-6 sm:text-[0.9375rem]"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function HomePage() {
  const writings = getWritingPreviews();

  return (
    <>
      <header>
        <h1 className="text-3xl leading-tight font-normal tracking-[-0.02em] sm:text-4xl">
          Binit Gupta
        </h1>
        <ul className="mt-4 flex items-center gap-3">
          {SOCIAL_ITEMS.map(({ href, label, tone, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="block rounded-sm transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <AppIcon tone={tone}>
                  <Icon className="size-4" />
                </AppIcon>
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-8 max-w-[62ch] space-y-4 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
        <p>
          I am a <span className="text-foreground">full-stack developer</span> currently studying
          computer science as an undergraduate.
        </p>
        <p>
          I build interfaces with <InlineLink href="https://react.dev">React</InlineLink> and{" "}
          <InlineLink href="https://nextjs.org">Next.js</InlineLink>. I handle backend logic using{" "}
          <InlineLink href="https://nodejs.org">Node.js</InlineLink>,{" "}
          <InlineLink href="https://expressjs.com">Express.js</InlineLink>, and manage data with{" "}
          <InlineLink href="https://www.postgresql.org">PostgreSQL</InlineLink>.
        </p>
      </div>

      <div aria-label="GitHub contributions" className="mt-10 sm:mt-12">
        <GithubGraph
          account={GITHUB_USERNAME}
          months={12}
          cellSize={10}
          cellGap={2}
          cellRadius={2}
          showAccount={false}
          ambientIntensity={0.4}
        />
      </div>

      <Divider />

      <Section id="things-i-made" title="Things I made">
        <ul className="space-y-5 sm:space-y-4">
          {PROJECTS.map(({ name, description, href, tone, icon: Icon }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4"
              >
                <AppIcon tone={tone}>
                  <Icon className="size-4" weight="bold" />
                </AppIcon>
                <span className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="text-foreground underline-offset-4 group-hover:underline group-hover:decoration-dotted">
                    {name}
                  </span>
                  <span className="text-[0.9375rem] text-muted-foreground sm:text-base">
                    {description}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Divider />

      <Section id="writing" title="Writing">
        <ul className="space-y-6">
          {writings.map(({ slug, href, title, subtitle }) => (
            <li key={slug}>
              <a href={href} className="group block">
                <span className="text-foreground underline-offset-4 group-hover:underline sm:text-lg">
                  {title}
                </span>
                <p className="mt-1 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
                  {subtitle}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
