import { primaryProjectUrl, PROJECTS } from "@/lib/projects";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/social-links";
import { absoluteUrl, SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { getAllWritings } from "@/lib/writings";

export const dynamic = "force-static";

/** Each post sits under its own `##` title, so its headings move down one level (outside code fences). */
function demoteHeadings(content: string) {
  let inFence = false;
  return content
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      return !inFence && /^#{1,5} /.test(line) ? `#${line}` : line;
    })
    .join("\n");
}

/** Site-relative links and media in post Markdown become absolute; media options like `{autoplay loop}` are dropped. */
function toPlainMarkdown(content: string) {
  return demoteHeadings(content)
    .replace(/^(!\[[^\]]*\]\([^)]*\))\s*\{[^}]*\}\s*$/gm, "$1")
    .replace(/^\s*(?:\{\/\*|<!--)\s*media:?[\s\S]*?(?:\*\/\}|-->)\s*$/gm, "")
    .replace(/\]\((\/[^)\s]*)/g, (_, path: string) => `](${absoluteUrl(path)}`);
}

/**
 * llms-full.txt: the whole site as one Markdown file, so an LLM can read every post
 * without crawling. Built from the same data as the pages, so it can't drift from them.
 */
export function GET() {
  const { education } = SITE_AUTHOR;

  const projects = PROJECTS.map((project) => {
    const links = [
      project.liveUrl && `Live: ${project.liveUrl}`,
      project.githubUrl && `Source: ${project.githubUrl}`,
    ].filter(Boolean);
    return `### ${project.name}\n\n${project.description} Built by ${SITE_NAME}.\n\n${links.map((link) => `- ${link}`).join("\n") || `- ${primaryProjectUrl(project)}`}`;
  });

  const writings = getAllWritings().map(({ slug, frontmatter, content }) => {
    const meta = [
      `URL: ${absoluteUrl(`/writings/${slug}`)}`,
      `Author: ${SITE_NAME}`,
      frontmatter.date && `Published: ${frontmatter.date}`,
      frontmatter.keywords.length > 0 && `Topics: ${frontmatter.keywords.join(", ")}`,
    ].filter(Boolean);

    return `## ${frontmatter.title}\n\n${meta.join("\n")}\n\n> ${frontmatter.summary || frontmatter.subtitle}\n\n${toPlainMarkdown(content)}`;
  });

  const body = `# ${SITE_NAME}: full site content

> ${SITE_DESCRIPTION}

This file has the full text of every writing on ${absoluteUrl("/")}, plus the project list. The short index is at ${absoluteUrl("/llms.txt")}. Everything here is public and may be cited; please link to the canonical URL of each section.

## About ${SITE_NAME}

${SITE_NAME} (${SITE_AUTHOR.givenName}) is a ${SITE_AUTHOR.jobTitle.toLowerCase()} based in ${SITE_AUTHOR.location}. ${SITE_AUTHOR.givenName} is studying for a ${education.degree} at ${education.school}, Bangalore (since ${education.since}), and builds with ${SITE_AUTHOR.knowsAbout.join(", ")}.

- Website: ${absoluteUrl("/")}
- Email: ${CONTACT_EMAIL}
- GitHub: ${SOCIAL_LINKS.github}
- LinkedIn: ${SOCIAL_LINKS.linkedin}
- X: ${SOCIAL_LINKS.x}
- Peerlist: ${SOCIAL_LINKS.peerlist}
- Resume: ${SOCIAL_LINKS.resume}

${SITE_AUTHOR.givenName} takes freelance work on websites, web apps and landing pages. Use the "Hire me" form on ${absoluteUrl("/")} or email ${CONTACT_EMAIL}.

## Projects

All projects: ${absoluteUrl("/works")}

${projects.join("\n\n")}

# Writings

All writings: ${absoluteUrl("/writings")}

${writings.join("\n\n---\n\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
