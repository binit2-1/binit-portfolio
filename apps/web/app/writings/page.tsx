import type { Metadata } from "next";

export const metadata: Metadata = { title: "Writings" };

export default function WritingsPage() {
  return (
    <section className="mx-auto flex min-h-[62vh] max-w-2xl flex-col justify-center gap-5 pt-28">
      <h1 className="text-4xl font-semibold tracking-tight">Writings</h1>
      <p className="text-base leading-7 text-muted-foreground">
        Essays and notes on engineering, product thinking, and interface craft are coming here soon.
      </p>
    </section>
  );
}
