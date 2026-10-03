import type { Project } from "@/lib/projects";
import { siteImages } from "@/lib/site";
import type { WritingPreview } from "@/lib/writings";

export type PreviewMedia =
  | { kind: "video"; src: string; poster?: string }
  | { kind: "image"; src: string };

const META_TAG = /<meta\s[^>]*>/gi;

function readAttr(tag: string, name: string) {
  return tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1];
}

/** Reads a page's og:image. Cached for a day; any failure just means "no image". */
export async function getOgImage(pageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(pageUrl, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const html = await response.text();
    for (const tag of html.match(META_TAG) ?? []) {
      const key = readAttr(tag, "property") ?? readAttr(tag, "name");
      const content = readAttr(tag, "content");
      if (content && (key === "og:image" || key === "twitter:image")) {
        return new URL(content, pageUrl).toString();
      }
    }
    return null;
  } catch {
    return null;
  }
}

/** Video, then image, then the live site's og:image, then this site's OG. */
export async function getProjectPreview(project: Project): Promise<PreviewMedia> {
  if (project.video) return { kind: "video", ...project.video };
  if (project.image) return { kind: "image", src: project.image };

  const og = project.liveUrl ? await getOgImage(project.liveUrl) : null;
  return { kind: "image", src: og ?? siteImages.og };
}

export async function getProjectPreviews(projects: Project[]) {
  const entries = await Promise.all(
    projects.map(async (project) => [project.slug, await getProjectPreview(project)] as const),
  );
  return Object.fromEntries(entries);
}

export function getWritingPreviewMedia(writings: WritingPreview[]) {
  return Object.fromEntries(
    writings.map(
      (writing) =>
        [writing.slug, { kind: "image", src: writing.thumbnail ?? siteImages.og }] as const,
    ),
  ) satisfies Record<string, PreviewMedia>;
}
