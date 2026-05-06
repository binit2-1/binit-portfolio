import fs from "node:fs";
import path from "node:path";

export type WritingFrontmatter = {
  title: string;
  subtitle: string;
  summary: string;
  date: string;
  thumbnail?: string;
  label: string;
};

export type WritingPost = {
  slug: string;
  frontmatter: WritingFrontmatter;
  content: string;
};

export type WritingPreview = {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  thumbnail?: string;
  label: string;
};

const WRITINGS_DIR = path.join(process.cwd(), "content", "writings");

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unquote(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);

  if (!match) {
    return { data: {} as Record<string, string>, content: source.trim() };
  }

  const data = match[1].split("\n").reduce<Record<string, string>>((acc, line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return acc;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);

    if (key) {
      acc[key] = unquote(value);
    }

    return acc;
  }, {});

  return {
    data,
    content: source.slice(match[0].length).trim(),
  };
}

function readWriting(fileName: string): WritingPost {
  const source = fs.readFileSync(path.join(WRITINGS_DIR, fileName), "utf8");
  const { data, content } = parseFrontmatter(source);
  const fileSlug = path.basename(fileName, path.extname(fileName));
  const slug = slugify(data.slug || fileSlug);
  const title = data.title || titleFromSlug(slug);
  const subtitle = data.subtitle || data.summary || "";
  const summary = data.summary || subtitle;

  return {
    slug,
    frontmatter: {
      title,
      subtitle,
      summary,
      date: data.date || "",
      thumbnail: data.thumbnail || undefined,
      label: data.label || title.toUpperCase(),
    },
    content,
  };
}

export function getAllWritings() {
  if (!fs.existsSync(WRITINGS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(WRITINGS_DIR)
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map(readWriting)
    .sort((a, b) => {
      const aTime = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const bTime = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      return bTime - aTime;
    });
}

export function getWritingPreviews(): WritingPreview[] {
  return getAllWritings().map(({ slug, frontmatter }) => ({
    slug,
    href: `/writings/${slug}`,
    title: frontmatter.title,
    subtitle: frontmatter.subtitle,
    description: frontmatter.summary || frontmatter.subtitle,
    date: frontmatter.date,
    thumbnail: frontmatter.thumbnail,
    label: frontmatter.label,
  }));
}

export function getWritingBySlug(slug: string) {
  const writing = getAllWritings().find((post) => post.slug === slug);

  if (!writing) {
    throw new Error(`Writing not found: ${slug}`);
  }

  return writing;
}
