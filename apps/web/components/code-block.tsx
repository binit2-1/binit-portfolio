import { FileCodeIcon, TerminalWindowIcon } from "@phosphor-icons/react/ssr";
import { codeToHtml } from "shiki";
import { cn } from "@repo/ui/lib/utils";
import { CopyButton } from "@/components/copy-button";

const SHELL_LANGUAGES = new Set(["bash", "sh", "shell", "zsh", "terminal", "console"]);
const LANGUAGE_ALIASES: Record<string, string> = { env: "dotenv", terminal: "bash", console: "bash" };

export function isShellLanguage(language: string) {
  return SHELL_LANGUAGES.has(language.toLowerCase());
}

/** Shiki output with both themes as CSS variables; `.shiki` rules in globals.css pick one. */
async function highlight(code: string, language: string) {
  const lang = LANGUAGE_ALIASES[language] ?? language;
  const options = {
    themes: { light: "github-light-default", dark: "github-dark-default" },
    defaultColor: false,
  } as const;

  try {
    return await codeToHtml(code, { ...options, lang });
  } catch {
    return codeToHtml(code, { ...options, lang: "text" });
  }
}

/**
 * Server-rendered code block: header (language or "Terminal") + copy button, highlighted body.
 * Shell blocks prefix every line with a `$` prompt that isn't selected or copied.
 */
export async function CodeBlock({
  code,
  language = "text",
  title,
  className,
}: {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}) {
  const shell = isShellLanguage(language);
  const html = await highlight(code, language);
  const Icon = shell ? TerminalWindowIcon : FileCodeIcon;

  return (
    <figure
      data-code-block
      className={cn("my-6 overflow-hidden rounded-xl bg-code inset-ring-1 inset-ring-border", className)}
    >
      <figcaption className="flex h-10 items-center gap-2 pr-1.5 pl-4 text-[0.8125rem] text-muted-foreground shadow-[inset_0_-1px_0_0] shadow-border">
        <Icon aria-hidden className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate font-mono">{title ?? (shell ? "Terminal" : language)}</span>
        <CopyButton text={code} />
      </figcaption>
      <div
        data-shell={shell || undefined}
        className="code-block-body overflow-x-auto overscroll-x-contain py-4 font-mono text-[0.8125rem] leading-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
