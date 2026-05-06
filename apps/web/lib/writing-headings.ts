export type WritingSection = {
  id: string;
  title: string;
  depth: 1 | 2 | 3 | 4;
};

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`*_~[\]()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createHeadingIdFactory() {
  const seen = new Map<string, number>();

  return (title: string) => {
    const base = slugifyHeading(title) || "section";
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);

    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export function getWritingSections(content: string): WritingSection[] {
  const getId = createHeadingIdFactory();
  const headingPattern = /^(#{2,4})\s+(.+)$/gm;
  const sections: WritingSection[] = [];

  for (const match of content.matchAll(headingPattern)) {
    const depth = match[1].length as 2 | 3 | 4;
    const title = match[2].trim();

    sections.push({
      id: getId(title),
      title,
      depth,
    });
  }

  return sections;
}
