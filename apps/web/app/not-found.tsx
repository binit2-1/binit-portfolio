import type { Metadata } from "next";
import { InlineLink, PageHeader } from "@/components/prose";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found">That page doesn&apos;t exist, or it moved.</PageHeader>
      <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
        Try the <InlineLink href="/">home page</InlineLink>, browse{" "}
        <InlineLink href="/works">works</InlineLink> and <InlineLink href="/writings">writings</InlineLink>, or
        search with <kbd className="font-sans text-foreground">/</kbd>.
      </p>
    </>
  );
}
