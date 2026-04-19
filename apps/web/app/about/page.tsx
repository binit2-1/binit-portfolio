import type { Metadata } from "next";
import { AboutPageContent } from "./about-page-content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <AboutPageContent />;
}
