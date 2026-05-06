import type { Metadata } from "next";
import { getWritingPreviews } from "@/lib/writings";
import { WritingsPageContent } from "./writings-page-content";

export const metadata: Metadata = { title: "Writings" };

export default function WritingsPage() {
  const writings = getWritingPreviews();

  return (
    <>
      <WritingsPageContent writings={writings} />

      <div
        className="pointer-events-none fixed inset-x-0"
        style={{ top: "var(--about-fixed-line-top, 20vh)", zIndex: 80 }}
        aria-hidden
      >
        <div
          className="w-full bg-[#FF5800]"
          style={{ height: "1px", transform: "scaleY(0.5)", transformOrigin: "center" }}
        />
      </div>
    </>
  );
}
