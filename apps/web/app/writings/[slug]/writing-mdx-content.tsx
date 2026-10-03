import Image from "next/image";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { CodeBlockCommand } from "@/components/code-block-command";
import { convertNpmCommand, isPackageManagerCommand } from "@/lib/package-managers";
import { createHeadingIdFactory } from "@/lib/writing-headings";
import { WritingVideoPlayer, type WritingVideoSource } from "./writing-video-player";

type MarkdownBlock =
  | { type: "heading"; depth: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string }
  | {
      type: "media";
      kind: "image" | "video";
      src: string;
      alt: string;
      title?: string;
      attrs: Record<string, string>;
    }
  | { type: "rule" };

const blockStartPattern = /^(?:#{2,4}\s|```|-\s|>\s|---\s*$|!\[[^\]]*\]\(|\|)/;
const inlineTokenPattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const mediaBlockPattern = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*(?:\{([^}]*)\})?\s*$/;
const mediaOptionsCommentPattern = /^(?:\{\/\*|<!--)\s*media:?\s*([\s\S]*?)\s*(?:\*\/\}|-->)\s*$/;
const videoExtensionPattern = /\.(mp4|webm|ogv|ogg|mov|m4v)(?:[?#].*)?$/i;
const imageExtensionPattern = /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;

function parseMediaAttributes(source?: string): Record<string, string> {
  if (!source) return {};

  const attrs: Record<string, string> = {};
  const attributePattern = /([A-Za-z][\w-]*)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g;

  for (const match of source.matchAll(attributePattern)) {
    attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? "true";
  }

  return attrs;
}

function getMediaAttribute(attrs: Record<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const exactValue = attrs[key];
    if (exactValue !== undefined) return exactValue;
  }

  const normalizedKeys = keys.map((key) => key.toLowerCase());
  const match = Object.entries(attrs).find(([key]) => normalizedKeys.includes(key.toLowerCase()));

  return match?.[1];
}

function isVideoSource(src: string, attrs: Record<string, string>) {
  const explicitType = getMediaAttribute(attrs, "type")?.toLowerCase();

  if (explicitType === "video") return true;
  if (explicitType === "image") return false;

  return videoExtensionPattern.test(src);
}

function isSupportedMediaSource(src: string) {
  return videoExtensionPattern.test(src) || imageExtensionPattern.test(src);
}

function splitTableRow(line: string) {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells: string[] = [];
  let cell = "";
  let inCode = false;

  for (let index = 0; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    const nextChar = trimmed[index + 1];

    if (char === "\\" && nextChar === "|") {
      cell += "|";
      index += 1;
      continue;
    }

    if (char === "`") {
      inCode = !inCode;
      cell += char;
      continue;
    }

    if (char === "|" && !inCode) {
      cells.push(cell.trim());
      cell = "";
      continue;
    }

    cell += char;
  }

  cells.push(cell.trim());

  return cells;
}

function isTableDivider(line: string) {
  if (!line.includes("|")) return false;

  const cells = splitTableRow(line);

  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function parseBlocks(content: string): MarkdownBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const codeFence = line.match(/^```(\S*)\s*$/);
    if (codeFence) {
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({
        type: "code",
        language: codeFence[1] || "text",
        code: codeLines.join("\n"),
      });
      index += 1;
      continue;
    }

    if (/^---\s*$/.test(line)) {
      blocks.push({ type: "rule" });
      index += 1;
      continue;
    }

    const media = line.match(mediaBlockPattern);
    if (media && isSupportedMediaSource(media[2])) {
      const nextLine = lines[index + 1]?.trim();
      const mediaOptionsComment = nextLine?.match(mediaOptionsCommentPattern);
      const attrs = parseMediaAttributes(
        [media[4], mediaOptionsComment?.[1]].filter(Boolean).join(" "),
      );

      blocks.push({
        type: "media",
        kind: isVideoSource(media[2], attrs) ? "video" : "image",
        src: media[2],
        alt: media[1].trim(),
        title: media[3]?.trim(),
        attrs,
      });
      index += mediaOptionsComment ? 2 : 1;
      continue;
    }

    if (mediaOptionsCommentPattern.test(line.trim())) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        depth: heading[1].length as 2 | 3 | 4,
        text: heading[2].trim(),
      });
      index += 1;
      continue;
    }

    const nextLine = lines[index + 1];
    if (line.includes("|") && nextLine?.includes("|") && isTableDivider(nextLine)) {
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].trim() && lines[index].includes("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      blocks.push({ type: "table", headers, rows });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2).trim());
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].startsWith("> ")) {
        quoteLines.push(lines[index].slice(2).trim());
        index += 1;
      }

      blocks.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && lines[index].trim() && !blockStartPattern.test(lines[index])) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    if (paragraphLines.length === 0) {
      paragraphLines.push(line.trim());
      index += 1;
    }

    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function renderInline(text: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(inlineTokenPattern)) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("`")) {
      nodes.push(
        <code key={`${token}-${match.index}`} className="rounded-md bg-code px-1.5 py-0.5 font-mono text-[0.875em] text-foreground inset-ring-1 inset-ring-border">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${token}-${match.index}`} className="font-medium text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          <a
            key={`${token}-${match.index}`}
            href={link[2]}
            className="text-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 transition-colors hover:decoration-foreground"
            target={link[2].startsWith("http") ? "_blank" : undefined}
            rel={link[2].startsWith("http") ? "noreferrer" : undefined}
          >
            {link[1]}
          </a>,
        );
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function getMediaCaption(alt: string, title?: string, attrs?: Record<string, string>) {
  const caption = attrs ? getMediaAttribute(attrs, "caption") : undefined;

  if (caption && ["false", "0", "no", "off"].includes(caption.toLowerCase())) {
    return "";
  }

  return caption ?? title ?? alt;
}

function isTruthyAttribute(
  attrs: Record<string, string>,
  key: string,
  defaultValue = false,
) {
  const value = getMediaAttribute(attrs, key);

  if (value === undefined) return defaultValue;

  return !["false", "0", "no", "off"].includes(value.toLowerCase());
}

function isFullWidthMedia(attrs: Record<string, string>) {
  return (
    isTruthyAttribute(attrs, "fullWidth") ||
    isTruthyAttribute(attrs, "fullwidth") ||
    isTruthyAttribute(attrs, "full-width")
  );
}

function getVideoType(src: string) {
  const normalizedSrc = src.split(/[?#]/)[0].toLowerCase();

  if (normalizedSrc.endsWith(".webm")) return "video/webm";
  if (normalizedSrc.endsWith(".ogv") || normalizedSrc.endsWith(".ogg")) return "video/ogg";
  if (normalizedSrc.endsWith(".mov")) return "video/quicktime";

  return "video/mp4";
}

function addVideoSource(
  sources: WritingVideoSource[],
  seenSources: Set<string>,
  src: string | undefined,
  media?: string,
) {
  if (!src) return;

  const key = `${media || "default"}:${src}`;
  if (seenSources.has(key)) return;

  sources.push({
    src,
    type: getVideoType(src),
    media,
  });
  seenSources.add(key);
}

function getVideoSources(src: string, attrs: Record<string, string>) {
  const sources: WritingVideoSource[] = [];
  const seenSources = new Set<string>();
  const mobileMedia = "(max-width: 640px)";
  const mobileWebm = getMediaAttribute(attrs, "mobileWebm", "mobile-webm");
  const mobileSrc = getMediaAttribute(attrs, "mobile", "mobileSrc", "mobile-src");
  const mobileFallback = getMediaAttribute(
    attrs,
    "mobileMp4",
    "mobile-mp4",
    "mobileFallback",
    "mobile-fallback",
  );
  const webm = getMediaAttribute(attrs, "webm");
  const fallback = getMediaAttribute(attrs, "fallback", "mp4");

  addVideoSource(sources, seenSources, mobileWebm, mobileMedia);
  addVideoSource(sources, seenSources, mobileSrc, mobileMedia);
  addVideoSource(sources, seenSources, mobileFallback, mobileMedia);
  addVideoSource(sources, seenSources, webm);
  addVideoSource(sources, seenSources, src);
  addVideoSource(sources, seenSources, fallback);

  return sources;
}

function getImageLoadingStrategy(src: string) {
  const normalizedSrc = src.split(/[?#]/)[0].toLowerCase();

  return {
    shouldUseNativeImage:
      normalizedSrc.endsWith(".gif") ||
      normalizedSrc.endsWith(".svg") ||
      src.startsWith("http://") ||
      src.startsWith("https://"),
    shouldSkipOptimization: normalizedSrc.endsWith(".gif") || normalizedSrc.endsWith(".svg"),
  };
}

function WritingTableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl inset-ring-1 inset-ring-border">
      <table className="min-w-[34rem] w-full border-collapse text-left text-sm leading-6">
        <thead>
          <tr className="border-b border-border bg-code">
            {headers.map((header, headerIndex) => (
              <th
                key={`${header}-${headerIndex}`}
                scope="col"
                className="px-4 py-3 font-medium text-foreground"
              >
                {renderInline(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border last:border-b-0"
            >
              {headers.map((_, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {renderInline(row[cellIndex] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WritingImageBlock({
  src,
  alt,
  title,
  attrs,
}: {
  src: string;
  alt: string;
  title?: string;
  attrs: Record<string, string>;
}) {
  const caption = getMediaCaption(alt, title, attrs);
  const { shouldUseNativeImage, shouldSkipOptimization } = getImageLoadingStrategy(src);
  const isFullWidth = isFullWidthMedia(attrs);
  const containerClassName = isFullWidth
    ? "relative w-full overflow-hidden rounded-xl border border-border bg-code"
    : "relative aspect-video overflow-hidden rounded-xl border border-border bg-code";
  const imageClassName = isFullWidth ? "h-auto w-full" : "h-full w-full object-contain";
  const imageSizes = isFullWidth ? "100vw" : "(min-width: 768px) 44rem, calc(100vw - 2rem)";

  return (
    <figure className="my-6">
      <div className={containerClassName}>
        {shouldUseNativeImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- GIF/SVG/remote article media should preserve source behavior.
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={imageClassName}
          />
        ) : isFullWidth ? (
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={900}
            sizes={imageSizes}
            className={imageClassName}
            unoptimized={shouldSkipOptimization}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={imageSizes}
            className="object-contain"
            unoptimized={shouldSkipOptimization}
          />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs leading-5 text-muted-foreground">
          {renderInline(caption)}
        </figcaption>
      ) : null}
    </figure>
  );
}

function WritingVideoBlock({
  src,
  alt,
  title,
  attrs,
}: {
  src: string;
  alt: string;
  title?: string;
  attrs: Record<string, string>;
}) {
  const poster = getMediaAttribute(attrs, "poster");
  const autoPlay = isTruthyAttribute(attrs, "autoplay") || isTruthyAttribute(attrs, "autoPlay");
  const loop = isTruthyAttribute(attrs, "loop");
  const muted = autoPlay || isTruthyAttribute(attrs, "muted", autoPlay);
  const caption = getMediaCaption(alt, title, attrs);
  const sources = getVideoSources(src, attrs);
  const figureClassName = isFullWidthMedia(attrs) ? "my-6 sm:-mx-4 lg:-mx-6" : "my-6";

  return (
    <figure className={figureClassName}>
      <WritingVideoPlayer
        sources={sources}
        alt={alt}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs leading-5 text-muted-foreground">
          {renderInline(caption)}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function WritingMdxContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  const getHeadingId = createHeadingIdFactory();

  return (
    <div className="mt-10 text-base leading-[1.65] text-muted-foreground">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = `h${block.depth}` as "h2" | "h3" | "h4";
          const className =
            block.depth === 2
              ? "mt-12 mb-4 scroll-mt-24 border-b border-border pb-2 text-[1.375rem] leading-8 tracking-[-0.025em] text-foreground sm:text-2xl"
              : "mt-9 mb-2 scroll-mt-24 text-lg leading-snug tracking-[-0.015em] text-foreground";
          const id = getHeadingId(block.text);
          const sectionHeadingProps = {
            "data-writing-section-heading": "true",
            "data-writing-section-id": id,
          };

          return (
            <HeadingTag key={index} id={id} className={className} {...sectionHeadingProps}>
              {renderInline(block.text)}
            </HeadingTag>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={index} className="my-4">
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === "code") {
          if (isPackageManagerCommand(block.code)) {
            return <CodeBlockCommand key={index} {...convertNpmCommand(block.code)} />;
          }
          return <CodeBlock key={index} language={block.language} code={block.code} />;
        }

        if (block.type === "table") {
          return <WritingTableBlock key={index} headers={block.headers} rows={block.rows} />;
        }

        if (block.type === "media") {
          if (block.kind === "video") {
            return (
              <WritingVideoBlock
                key={index}
                src={block.src}
                alt={block.alt}
                title={block.title}
                attrs={block.attrs}
              />
            );
          }

          return (
            <WritingImageBlock
              key={index}
              src={block.src}
              alt={block.alt}
              title={block.title}
              attrs={block.attrs}
            />
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="my-5 space-y-1.5 pl-5">
              {block.items.map((item) => (
                <li key={item} className="list-disc pl-1 marker:text-muted-foreground/60">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote key={index} className="my-6 border-l-2 border-border pl-4 text-muted-foreground">
              {renderInline(block.text)}
            </blockquote>
          );
        }

        return (
          <hr
            key={index}
            className="my-10 h-px border-0 bg-[linear-gradient(to_right,var(--muted-foreground)_50%,transparent_0)] bg-size-[4px_1px] opacity-40"
          />
        );
      })}
    </div>
  );
}
