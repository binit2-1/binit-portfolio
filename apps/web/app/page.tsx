import { basteleur } from "@/lib/fonts";
import { getAgeOnDate } from "@/lib/birthday";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { Github, Linkedin, PeerlistSolid, X } from "@/components/icons";

/** Recompute age on each request so it stays correct around your birthday (17 Nov). */
export const dynamic = "force-dynamic";

const SOCIAL_ITEMS = [
  { href: SOCIAL_LINKS.peerlist, label: "Peerlist", Icon: PeerlistSolid },
  { href: SOCIAL_LINKS.x, label: "X", Icon: X },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: SOCIAL_LINKS.github, label: "GitHub", Icon: Github },
] as const;

export default function HomePage() {
  const age = getAgeOnDate();

  return (
    <section className="social-hover-focus mx-auto flex min-h-[68vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-3 text-center sm:px-4">
      <p className="font-sans font-light text-xs uppercase select-none tracking-[0.28em] text-muted-foreground">
        Bangalore, {age}
      </p>
      <h1
        className={`${basteleur.className} w-full max-w-[min(100%,36rem)] text-balance text-3xl font-bold uppercase leading-[1.12] tracking-tight selection:bg-[#FF5800] selection:text-white sm:text-4xl sm:leading-[1.08] md:text-5xl md:leading-[1.05] lg:text-6xl`}
      >
        Yo, I&apos;m Binit and I build web experiences.
      </h1>
      <div className="social-links font-sans font-light flex max-w-md flex-wrap items-center justify-center gap-3 text-muted-foreground md:gap-5">
        {SOCIAL_ITEMS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`${basteleur.className} inline-flex origin-center cursor-pointer items-center gap-0.5 rounded-sm text-xl font-bold transition-transform duration-300 ease-out hover:scale-[1.5] focus-visible:scale-[1.5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
          >
            <span aria-hidden="true">[</span>
            <Icon className="size-5 shrink-0" aria-hidden />
            <span aria-hidden="true">]</span>
          </a>
        ))}
      </div>
    </section>
  );
}
