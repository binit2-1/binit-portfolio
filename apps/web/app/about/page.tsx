import type { Metadata } from "next";
import { absoluteUrl, SITE_AUTHOR } from "@/lib/site";
import { AboutPageContent } from "./about-page-content";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_AUTHOR.name}, a web developer in Bangalore building polished web experiences.`,
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: `About ${SITE_AUTHOR.name}`,
    description: `About ${SITE_AUTHOR.name}, a web developer in Bangalore building polished web experiences.`,
    url: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
