import type { Metadata } from "next";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <section className="mx-auto flex min-h-[62vh] max-w-2xl flex-col justify-center gap-5">
      <h1 className="text-4xl font-semibold tracking-tight">Work</h1>
      <p className="text-base leading-7 text-muted-foreground">
        Selected projects, experiments, and product builds will be listed here with concise case studies.
      </p>
    </section>
  );
}
