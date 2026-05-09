import { SOCIAL_LINKS } from "./social-links";

export const SITE_NAME = "Binit Gupta";
export const SITE_TITLE = "Binit Gupta | Portfolio";
export const SITE_DESCRIPTION =
  "Portfolio and writing by Binit Gupta, a web developer building expressive, fast, and polished web experiences.";
export const SITE_KEYWORDS = [
  "Binit Gupta",
  "Binit portfolio",
  "Binit developer",
  "Binit web developer",
  "portfolio",
  "frontend developer",
  "web experiences",
];

export const SITE_AUTHOR = {
  name: "Binit Gupta",
  location: "Bangalore, India",
  sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.peerlist, SOCIAL_LINKS.x],
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
