import type { Metadata } from "next";
import { HireMeButton } from "@/components/hire-me";
import { JsonLd } from "@/components/json-ld";
import { SectionHeader } from "@/components/list-rows";
import { Divider, InlineLink, PageHeader } from "@/components/prose";
import { breadcrumbSchema, pageMetadata, PERSON_ID } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { CONTACT_EMAIL } from "@/lib/social-links";

export const metadata: Metadata = pageMetadata({
  title: "Freelance Web Development Services | Binit Gupta",
  absoluteTitle: true,
  description:
    "Hire Binit Gupta for freelance web development: landing pages, websites and full-stack web apps built with Next.js, React, Node.js, Go and PostgreSQL.",
  path: "/services",
});

const SERVICES: { name: string; description: string }[] = [
  {
    name: "Landing pages",
    description:
      "A fast, responsive page for a launch, product or event. Built with Next.js, set up for search engines and quick to load on any device.",
  },
  {
    name: "Websites",
    description:
      "Multi-page sites for businesses, studios and portfolios, with clean structure, solid SEO foundations and room to add pages later.",
  },
  {
    name: "Full-stack web apps",
    description:
      "Dashboards, internal tools and SaaS products: React and Next.js on the frontend, APIs in Node.js or Go, and PostgreSQL for data.",
  },
  {
    name: "Authentication and backends",
    description:
      "Sign-up, sign-in and sessions done properly, with HttpOnly cookies and a real database. I built Authingo, an open-source auth library for React and Go.",
  },
];

const PROCESS: { name: string; description: string }[] = [
  { name: "Brief", description: "Tell me what you're building, who it's for and when you need it." },
  { name: "Plan", description: "I reply with questions, a suggested approach and an estimate." },
  { name: "Build", description: "I share progress as I go, so you can give feedback early." },
  { name: "Launch", description: "I deploy it, walk you through it and hand everything over." },
];

const FAQ: { question: string; answer: string }[] = [
  {
    question: "Is Binit Gupta available for freelance work?",
    answer:
      "Yes. I take on freelance web development projects alongside my studies. Send a message through the Hire me form and I'll reply by email.",
  },
  {
    question: "What technologies do you work with?",
    answer:
      "Next.js, React, TypeScript and Tailwind CSS on the frontend; Node.js, Express or Go on the backend; and PostgreSQL for data.",
  },
  {
    question: "Where are you based?",
    answer: "Bangalore, India. Projects run online, over email and calls.",
  },
  {
    question: "How do I start a project?",
    answer: `Use the Hire me button on this page to send a short brief, or email ${CONTACT_EMAIL}.`,
  },
];

const textClass = "text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base";

export default function ServicesPage() {
  const url = absoluteUrl("/services");

  return (
    <>
      <JsonLd
        nodes={[
          {
            "@type": "WebPage",
            "@id": `${url}#page`,
            url,
            name: "Freelance Web Development Services by Binit Gupta",
            about: { "@id": PERSON_ID },
          },
          ...SERVICES.map((service) => ({
            "@type": "Service",
            name: service.name,
            description: service.description,
            serviceType: "Web development",
            provider: { "@id": PERSON_ID },
            url,
          })),
          {
            "@type": "FAQPage",
            mainEntity: FAQ.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          },
          breadcrumbSchema([{ name: "Services", path: "/services" }]),
        ]}
      />

      <PageHeader title="Services">
        Freelance web development, from a single landing page to a full-stack app.
      </PageHeader>

      <p className={`mt-6 max-w-[62ch] ${textClass}`}>
        I work with founders, small businesses and teams who need something built well and shipped. You
        work directly with me, from the first message to launch. Curious what that looks like? See{" "}
        <InlineLink href="/works">things I&apos;ve built</InlineLink>.
      </p>

      <Divider />

      <section aria-labelledby="what-i-build">
        <SectionHeader id="what-i-build" title="What I build" />
        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {SERVICES.map(({ name, description }) => (
            <li key={name}>
              <h3 className="text-base text-foreground sm:text-[1.0625rem]">{name}</h3>
              <p className={`mt-1 ${textClass}`}>{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      <section aria-labelledby="how-it-works">
        <SectionHeader id="how-it-works" title="How it works" />
        <ol>
          {PROCESS.map(({ name, description }) => (
            <li key={name} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-6">
              <span className="w-20 shrink-0 text-foreground">{name}</span>
              <span className={textClass}>{description}</span>
            </li>
          ))}
        </ol>
      </section>

      <Divider />

      <section aria-labelledby="questions">
        <SectionHeader id="questions" title="Questions" />
        <div className="space-y-5">
          {FAQ.map(({ question, answer }) => (
            <div key={question}>
              <h3 className="text-base text-foreground sm:text-[1.0625rem]">{question}</h3>
              <p className={`mt-1 max-w-[62ch] ${textClass}`}>{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section aria-labelledby="start" className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="start" className="text-xl tracking-[-0.01em] text-foreground">
            Have a project in mind?
          </h2>
          <p className={`mt-1 ${textClass}`}>Tell me about it. I reply to every message.</p>
        </div>
        <HireMeButton className="h-10 shrink-0 cursor-pointer rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-[opacity,transform] hover:opacity-90 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none" />
      </section>
    </>
  );
}
