import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="mx-auto flex min-h-[62vh] max-w-2xl flex-col justify-center gap-5">
      <h1 className="text-4xl font-semibold tracking-tight">About</h1>
      <p className="text-base leading-7 text-muted-foreground">
        I build modern web products with React, Next.js, and design systems. This page will hold my story,
        principles, and current focus.
      </p>
    </section>
  );
}
