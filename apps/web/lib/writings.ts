type WritingFrontmatter = {
  title: string;
  summary: string;
  date: string;
};

type WritingPost = {
  slug: string;
  frontmatter: WritingFrontmatter;
  content: string;
};

const writings: WritingPost[] = [];

export function getAllWritings() {
  return writings;
}

export function getWritingBySlug(slug: string) {
  const writing = writings.find((post) => post.slug === slug);

  if (!writing) {
    throw new Error(`Writing not found: ${slug}`);
  }

  return writing;
}
