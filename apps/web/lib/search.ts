import { primaryProjectUrl, PROJECTS } from "@/lib/projects";
import { createHeadingIdFactory } from "@/lib/writing-headings";
import { getAllWritings } from "@/lib/writings";

export type SearchEntry = {
  type: "page" | "project" | "writing";
  title: string;
  /** Short line under the title, e.g. the post title for a section hit. */
  subtitle?: string;
  href: string;
  external?: boolean;
  /** Plain text searched word by word and used for snippets. */
  body: string;
};

const PAGES: SearchEntry[] = [
  { type: "page", title: "Home", href: "/", body: "Binit Gupta full-stack developer portfolio" },
  { type: "page", title: "Works", href: "/works", body: "Projects things I made" },
  { type: "page", title: "Writings", href: "/writings", body: "Articles blog posts writing" },
  { type: "page", title: "About", href: "/about", body: "About Binit Gupta stack profiles contact" },
  { type: "page", title: "Services", href: "/services", body: "Freelance hire landing pages websites web apps" },
];

/** Markdown to searchable prose: code blocks, links, images and markup removed. */
function toPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function writingEntries(): SearchEntry[] {
  return getAllWritings().flatMap(({ slug, frontmatter, content }) => {
    const href = `/writings/${slug}`;
    const getId = createHeadingIdFactory();
    const entries: SearchEntry[] = [
      {
        type: "writing",
        title: frontmatter.title,
        href,
        body: [frontmatter.subtitle, frontmatter.summary].filter(Boolean).join(" "),
      },
    ];

    // One entry per section so a hit deep in a post links to its heading.
    const parts = content.split(/^(#{2,4})\s+(.+)$/m);
    for (let i = 1; i < parts.length; i += 3) {
      const heading = parts[i + 1].trim();
      entries.push({
        type: "writing",
        title: toPlainText(heading),
        subtitle: frontmatter.title,
        href: `${href}#${getId(heading)}`,
        body: toPlainText(parts[i + 2] ?? ""),
      });
    }
    return entries;
  });
}

export function buildSearchIndex(): SearchEntry[] {
  const projects: SearchEntry[] = PROJECTS.map((project) => ({
    type: "project",
    title: project.name,
    href: primaryProjectUrl(project),
    external: true,
    body: project.description,
  }));

  return [...PAGES, ...projects, ...writingEntries()];
}
