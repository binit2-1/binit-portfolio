import { SOCIAL_LINKS } from "./social-links";

export const SITE_NAME = "Binit Gupta";
export const SITE_TITLE = "Binit Gupta | Full-Stack Developer Portfolio";
export const SITE_DESCRIPTION =
  "Binit Gupta is a full-stack developer in Bangalore, India, building fast web apps with React, Next.js, Node.js and Go. Projects, writing and freelance work.";
/** Ignored by Google, still read by some engines; the real signals are titles, headings and structured data. */
export const SITE_KEYWORDS = [
  "Binit",
  "Binit Gupta",
  "Binit portfolio",
  "Binit Gupta portfolio",
  "Binit Gupta developer",
  "binitt.dev",
  "full-stack developer",
  "full-stack developer Bangalore",
  "freelance web developer India",
  "Next.js developer",
  "React developer",
  "Go developer",
];

export const SITE_AUTHOR = {
  name: "Binit Gupta",
  givenName: "Binit",
  familyName: "Gupta",
  jobTitle: "Full-Stack Developer",
  location: "Bangalore, India",
  twitter: "@BinitGupta21",
  sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.peerlist, SOCIAL_LINKS.x],
  knowsAbout: ["Web development", "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express", "Go", "PostgreSQL", "Authentication"],
};

export const SITE_URL = "https://binitt.dev";

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;

  return envUrl.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export const siteImages = {
  logo: "/images/logo/logo.png",
  og: "/images/logo/og-image.png",
  icon: "/icon.png",
  appleIcon: "/apple-icon.png",
};
