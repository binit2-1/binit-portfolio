import { basteleur } from "@/lib/fonts";
import { getAgeOnDate } from "@/lib/birthday";

/** Recompute age on each request so it stays correct around your birthday (17 Nov). */
export const dynamic = "force-dynamic";

export default function HomePage() {
  const age = getAgeOnDate();

  return (
    <section className="mx-auto flex min-h-[68vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
      <p className="font-sans font-light text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Bangalore, {age}
      </p>
      <h1
        className={`${basteleur.className} text-balance text-5xl font-bold uppercase leading-[1.05] tracking-tight md:text-6xl`}
      >
        Yo, I&apos;m Binit and I build web experiences.
      </h1>
      <p className="font-sans font-light max-w-md text-sm text-muted-foreground md:text-base">
        Design engineer and full-stack developer focused on performant interfaces.
      </p>
    </section>
  );
}
