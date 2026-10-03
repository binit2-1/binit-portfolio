import type { Metadata } from "next";
import { AppIcon, type AppIconTone } from "@/components/app-icon";
import { Linkedin, PeerlistSolid, X } from "@/components/icons";
import { HireMeNote } from "@/components/hire-me-note";
import { HoverPreviewList } from "@/components/hover-preview";
import { Divider, InlineLink } from "@/components/prose";
import { ProjectRow, SectionHeader, WritingRow } from "@/components/list-rows";
import { GithubGraph } from "@/components/unlumen-ui/github-graph";
import { getProjectPreviews, getWritingPreviewMedia } from "@/lib/previews";
import { pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
import { FEATURED_PROJECTS } from "@/lib/projects";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { getWritingPreviews } from "@/lib/writings";

export const metadata: Metadata = pageMetadata({
  title: SITE_TITLE,
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
  type: "profile",
});

const GITHUB_USERNAME = "binit2-1";
const HOME_WRITING_COUNT = 3;

const SOCIAL_ITEMS: { href: string; label: string; tone: AppIconTone; Icon: typeof X }[] = [
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", tone: "blue", Icon: Linkedin },
  { href: SOCIAL_LINKS.peerlist, label: "Peerlist", tone: "green", Icon: PeerlistSolid },
  { href: SOCIAL_LINKS.x, label: "X", tone: "black", Icon: X },
];

export default async function HomePage() {
  const writings = getWritingPreviews().slice(0, HOME_WRITING_COUNT);
  const projectMedia = await getProjectPreviews(FEATURED_PROJECTS);

  return (
    <>
      {/* Extra top room on phones for the hand-drawn note above the name. */}
      <header className="mt-4 sm:mt-0">
        <div className="relative w-fit">
          <h1 className="text-3xl leading-tight font-normal tracking-[-0.02em] sm:text-4xl">Binit Gupta</h1>
          <HireMeNote />
        </div>
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

      <div className="mt-6 max-w-[62ch] space-y-4 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
        <p>
          I&apos;m Binit, a <span className="text-foreground">full-stack developer</span> based in
          Bangalore, currently studying computer science as an undergraduate.
        </p>
        <p>
          I build interfaces with <InlineLink href="https://react.dev">React</InlineLink> and{" "}
          <InlineLink href="https://nextjs.org">Next.js</InlineLink>. I handle backend logic using{" "}
          <InlineLink href="https://nodejs.org">Node.js</InlineLink>,{" "}
          <InlineLink href="https://expressjs.com">Express.js</InlineLink>, and manage data with{" "}
          <InlineLink href="https://www.postgresql.org">PostgreSQL</InlineLink>.
        </p>
      </div>

      <section aria-label="GitHub contributions" className="mt-8">
        <GithubGraph
          account={GITHUB_USERNAME}
          months={12}
          compactMonths={6}
          cellSize={10}
          cellGap={2}
          cellRadius={2}
          showAccount={false}
          ambientIntensity={0.4}
        />
      </section>

      <Divider />

      <section aria-labelledby="things-i-made">
        <SectionHeader id="things-i-made" title="Things I made" href="/works" linkLabel="All projects" />
        <HoverPreviewList media={projectMedia}>
          <ul>
            {FEATURED_PROJECTS.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </ul>
        </HoverPreviewList>
      </section>

      <Divider />

      <section aria-labelledby="writing">
        <SectionHeader id="writing" title="Writings" href="/writings" linkLabel="All writing" />
        <HoverPreviewList media={getWritingPreviewMedia(writings)}>
          <ul>
            {writings.map((writing) => (
              <WritingRow key={writing.slug} writing={writing} />
            ))}
          </ul>
        </HoverPreviewList>
      </section>
    </>
  );
}
