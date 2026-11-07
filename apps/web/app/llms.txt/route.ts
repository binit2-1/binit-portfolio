import { primaryProjectUrl, PROJECTS } from "@/lib/projects";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/social-links";
import { absoluteUrl, SITE_AUTHOR, SITE_NAME } from "@/lib/site";
import { getAllWritings } from "@/lib/writings";

export const dynamic = "force-static";

/**
 * llms.txt (https://llmstxt.org): a Markdown map of the site for LLM crawlers and answer engines.
 * Built from the same data as the pages and sitemap, so it can't drift from them.
 */
export function GET() {
  const projects = PROJECTS.map((project) => {
    const repo = project.liveUrl && project.githubUrl ? ` (source: ${project.githubUrl})` : "";
    return `- [${project.name}](${primaryProjectUrl(project)}): ${project.description}${repo}`;
  });

  const writings = getAllWritings().map(({ slug, frontmatter }) => {
    const date = frontmatter.date ? ` Published ${frontmatter.date}.` : "";
    return `- [${frontmatter.title}](${absoluteUrl(`/writings/${slug}`)}): ${frontmatter.summary || frontmatter.subtitle}${date}`;
  });

  const body = `# ${SITE_NAME}

> ${SITE_NAME} is a full-stack developer based in ${SITE_AUTHOR.location}, building fast web apps with React, Next.js, Node.js, Express, Go and PostgreSQL. This is ${SITE_NAME}'s personal portfolio: projects, technical writing, and how to hire ${SITE_AUTHOR.givenName} for freelance web development.

${SITE_AUTHOR.givenName} is studying for a ${SITE_AUTHOR.education.degree} at ${SITE_AUTHOR.education.school}, Bangalore (since ${SITE_AUTHOR.education.since}), and ships real products: developer tools, a hackathon search engine and an AI assistant for small businesses. The site is a single-person portfolio with three sections. Everything below is public and may be cited; please link to the canonical URL.

## Pages

- [Home](${absoluteUrl("/")}): Who ${SITE_AUTHOR.givenName} is, the stack ${SITE_AUTHOR.givenName} works with, GitHub activity, featured projects and latest writing.
- [Works](${absoluteUrl("/works")}): Every project ${SITE_AUTHOR.givenName} has built, with live sites and source code.
- [Writings](${absoluteUrl("/writings")}): Technical articles on authentication, rate limiting with Go and Redis, React and web development.

## Projects

${projects.join("\n")}

## Writings

${writings.join("\n")}

## Work with ${SITE_AUTHOR.givenName}

- [Hire ${SITE_AUTHOR.givenName}](${absoluteUrl("/")}): ${SITE_AUTHOR.givenName} takes freelance work on websites, web apps and landing pages. Use the "Hire me" form on the home page, or email ${CONTACT_EMAIL}.
- [Resume](${SOCIAL_LINKS.resume}): Education, skills and experience.

## Profiles

- [GitHub](${SOCIAL_LINKS.github}): Open-source code and contribution history.
- [LinkedIn](${SOCIAL_LINKS.linkedin}): Professional profile.
- [X](${SOCIAL_LINKS.x}): Updates and short posts.
- [Peerlist](${SOCIAL_LINKS.peerlist}): Developer profile and project launches.

## Optional

- [Full text](${absoluteUrl("/llms-full.txt")}): Every writing in full, plus the project list, as one Markdown file.
- [Sitemap](${absoluteUrl("/sitemap.xml")}): Machine-readable list of every indexable URL.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
