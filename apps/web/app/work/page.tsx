import type { Metadata } from "next";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Work</h1>
      <p className="text-muted-foreground">
        Selected projects and work — coming soon.
      </p>
    </section>
  );
}
