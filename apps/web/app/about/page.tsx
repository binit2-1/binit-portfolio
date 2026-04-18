import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <p className="text-muted-foreground">
        A little bit about me — coming soon.
      </p>
    </section>
  );
}
