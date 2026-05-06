import type { ReactNode } from "react";
import { createHeadingIdFactory } from "@/lib/writing-headings";

type MarkdownBlock =
  | { type: "heading"; depth: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "rule" };

const blockStartPattern = /^(#{2,4}\s|```|-\s|>\s|---\s*$)/;
const codeTokenPattern =
  /(\/\/.*$|#.*$|"[^"]*"|'[^']*'|`[^`]*`|\b(?:async|await|break|case|class|const|continue|default|else|export|false|for|from|function|if|import|interface|let|new|null|return|string|true|type|undefined|while)\b|\b\d+(?:\.\d+)?\b|<\/?[A-Za-z][^>\s]*|[{}()[\].,:;=<>])/g;
const inlineTokenPattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

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
        <code key={`${token}-${match.index}`} className="rounded bg-foreground/8 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground/85">
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
            className="text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground/55"
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

function highlightCodeLine(line: string, lineIndex: number) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(codeTokenPattern)) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const token = match[0];
    let className = "text-foreground/80";

    if (token.startsWith("//") || token.startsWith("#")) {
      className = "text-foreground/35";
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
      className = "text-foreground/62";
    } else if (/^\d/.test(token)) {
      className = "text-foreground/58";
    } else if (/^<\/?[A-Za-z]/.test(token)) {
      className = "text-foreground/88";
    } else if (/^[{}()[\].,:;=<>]$/.test(token)) {
      className = "text-foreground/40";
    } else {
      className = "text-foreground/78";
    }

    nodes.push(
      <span key={`${lineIndex}-${match.index}-${token}`} className={className}>
        {token}
      </span>,
    );

    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const lines = code.split("\n");

  return (
    <figure className="my-7 overflow-hidden rounded-md border border-border/55 bg-foreground/[0.04] shadow-[0_16px_50px_rgba(0,0,0,0.10)] dark:border-white/8 dark:bg-white/[0.045]">
      <pre className="overflow-x-auto px-5 py-5 text-[13px] leading-6 sm:px-6">
        <code className="font-mono" data-language={language}>
          {lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block min-w-0 whitespace-pre">
              {highlightCodeLine(line, lineIndex)}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

export function WritingMdxContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  const getHeadingId = createHeadingIdFactory();

  return (
    <div className="mt-9 text-[15px] leading-7 text-foreground/78 sm:text-base sm:leading-8">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = `h${block.depth}` as "h2" | "h3" | "h4";
          const className =
            block.depth === 2
              ? "mt-11 mb-3 font-display text-2xl leading-tight text-foreground"
              : "mt-8 mb-2 font-sans text-lg font-medium leading-tight text-foreground";
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
          return <CodeBlock key={index} language={block.language} code={block.code} />;
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="my-5 space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item} className="list-disc marker:text-foreground/45">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote key={index} className="my-6 border-l border-border pl-4 text-foreground/72">
              {renderInline(block.text)}
            </blockquote>
          );
        }

        return <hr key={index} className="my-8 border-0 border-t border-white/10" />;
      })}
    </div>
  );
}
