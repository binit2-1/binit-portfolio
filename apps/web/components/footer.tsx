import { HireMe } from "@/components/hire-me";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/social-links";

const linkClass =
  "text-muted-foreground underline-offset-[6px] transition-colors hover:text-foreground";

const EXTERNAL_LINKS = [
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
  { href: SOCIAL_LINKS.x, label: "X" },
  { href: SOCIAL_LINKS.github, label: "GitHub" },
];

/** Site footer: contact links. "Hire me" is the only client island (opens the enquiry dialog). */
export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24">
      <hr className="mb-8 h-px border-0 bg-[linear-gradient(to_right,var(--muted-foreground)_50%,transparent_0)] bg-size-[4px_1px] opacity-40 mask-x-from-80%" />
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem] sm:gap-x-8 sm:text-base">
        <li>
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            Email
          </a>
        </li>
        <li>
          <HireMe
            email={CONTACT_EMAIL}
            className="cursor-pointer text-foreground underline decoration-muted-foreground/60 decoration-dotted underline-offset-[6px] transition-colors hover:decoration-foreground"
          />
        </li>
        {EXTERNAL_LINKS.map(({ href, label }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
