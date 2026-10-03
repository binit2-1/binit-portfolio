import type { Metadata } from "next";
import { HireMeButton } from "@/components/hire-me";
import { JsonLd } from "@/components/json-ld";
import { SectionHeader } from "@/components/list-rows";
import { Divider, InlineLink, PageHeader } from "@/components/prose";
import { PROJECTS, primaryProjectUrl } from "@/lib/projects";
import { breadcrumbSchema, pageMetadata, PERSON_ID } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/social-links";

export const metadata: Metadata = pageMetadata({
  title: "About Binit Gupta | Full-Stack Developer in Bangalore",
  absoluteTitle: true,
  description:
    "About Binit Gupta, a full-stack developer and computer science student in Bangalore, India: the stack he works with, what he builds, and where to find him.",
  path: "/about",
  type: "profile",
});

const STACK: { area: string; tools: string[] }[] = [
  { area: "Frontend", tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { area: "Backend", tools: ["Node.js", "Express", "Go"] },
  { area: "Data", tools: ["PostgreSQL"] },
];

const PROFILES: { label: string; handle: string; href: string }[] = [
  { label: "GitHub", handle: "binit2-1", href: SOCIAL_LINKS.github },
  { label: "LinkedIn", handle: "binitgupta", href: SOCIAL_LINKS.linkedin },
  { label: "X", handle: "@BinitGupta21", href: SOCIAL_LINKS.x },
  { label: "Peerlist", handle: "binitgupta1711", href: SOCIAL_LINKS.peerlist },
  { label: "Email", handle: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

const rowClass = "flex items-baseline gap-3 py-2 text-[0.9375rem] sm:text-base";
const leaderClass = "min-w-4 flex-1 border-t border-dashed border-border";

export default function AboutPage() {
  const project = (slug: string) => PROJECTS.find((item) => item.slug === slug);
  const authingo = project("authingo");
  const composter = project("composter");
  const hackersquare = project("hackersquare");

  return (
    <>
      <JsonLd
        nodes={[
          {
            "@type": "ProfilePage",
            "@id": `${absoluteUrl("/about")}#page`,
            url: absoluteUrl("/about"),
            name: "About Binit Gupta",
            mainEntity: { "@id": PERSON_ID },
          },
          breadcrumbSchema([{ name: "About", path: "/about" }]),
        ]}
      />

      <PageHeader title="About">Full-stack developer in Bangalore, India.</PageHeader>

      <div className="mt-6 max-w-[62ch] space-y-4 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
        <p>
          I&apos;m <span className="text-foreground">Binit Gupta</span>, a full-stack developer based in
          Bangalore, currently studying computer science as an undergraduate.
        </p>
        <p>
          I build and ship with Next.js, React and Tailwind CSS on the frontend, Express and Go on the
          backend, and PostgreSQL for data. I like making things and putting them out into the world.
        </p>
        <p>
          Things I&apos;ve built include{" "}
          {authingo && <InlineLink href={primaryProjectUrl(authingo)}>Authingo</InlineLink>}, headless
          authentication for React and Go apps,{" "}
          {composter && <InlineLink href={primaryProjectUrl(composter)}>Composter</InlineLink>}, a component
          vault for React teams, and{" "}
          {hackersquare && <InlineLink href={primaryProjectUrl(hackersquare)}>Hackersquare</InlineLink>}, a
          search engine for hackathons. More on the <InlineLink href="/works">works</InlineLink> page, and I{" "}
          <InlineLink href="/writings">write</InlineLink> about what I learn along the way.
        </p>
      </div>

      <Divider />

      <section aria-labelledby="stack">
        <SectionHeader id="stack" title="Stack" />
        <dl>
          {STACK.map(({ area, tools }) => (
            <div key={area} className={rowClass}>
              <dt className="shrink-0 text-muted-foreground">{area}</dt>
              <span aria-hidden className={leaderClass} />
              <dd className="text-right text-foreground/85">{tools.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Divider />

      <section aria-labelledby="elsewhere">
        <SectionHeader id="elsewhere" title="Elsewhere" />
        <ul>
          {PROFILES.map(({ label, handle, href }) => (
            <li key={label} className={rowClass}>
              <span className="shrink-0 text-muted-foreground">{label}</span>
              <span aria-hidden className={leaderClass} />
              <InlineLink href={href} rel={href.startsWith("mailto:") ? undefined : "me noopener noreferrer"}>
                {handle}
              </InlineLink>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      <section aria-labelledby="work-with-me">
        <SectionHeader id="work-with-me" title="Work with me" href="/services" linkLabel="Services" />
        <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
          I take on freelance projects: landing pages, websites and full-stack web apps.{" "}
          <HireMeButton className="cursor-pointer text-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 transition-colors hover:decoration-foreground">
            Hire me
          </HireMeButton>{" "}
          and tell me what you&apos;re building.
        </p>
      </section>
    </>
  );
}
