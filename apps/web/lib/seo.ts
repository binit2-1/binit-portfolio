import type { Metadata } from "next";
import { CONTACT_EMAIL } from "./social-links";
import { absoluteUrl, getSiteUrl, SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, siteImages } from "./site";

/**
 * SEO helpers: one place for page metadata (title, description, canonical, Open Graph,
 * Twitter) and schema.org JSON-LD. Every page builds its metadata with `pageMetadata` so
 * the canonical URL, og:url and og:type can't drift apart.
 */

const OG_IMAGE = { url: siteImages.og, width: 1200, height: 630, alt: `${SITE_NAME}, full-stack developer` };

/** Google shows ~155-160 characters; cut longer copy at a word boundary. */
export function clampDescription(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  absoluteTitle = false,
  images,
}: {
  /** Page title; the layout template adds " | Binit Gupta" unless `absoluteTitle`. */
  title: string;
  description: string;
  path: string;
  type?: "website" | "profile" | "article";
  absoluteTitle?: boolean;
  images?: NonNullable<Metadata["openGraph"]>["images"];
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const desc = clampDescription(description);
  const ogImages = images ?? [OG_IMAGE];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: desc,
      siteName: SITE_NAME,
      locale: "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      creator: SITE_AUTHOR.twitter,
      images: ogImages,
    },
  };
}

/* schema.org JSON-LD. Stable @ids let every page point at the same Person and WebSite. */

export const PERSON_ID = `${getSiteUrl()}/#person`;
export const WEBSITE_ID = `${getSiteUrl()}/#website`;

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_AUTHOR.name,
    givenName: SITE_AUTHOR.givenName,
    familyName: SITE_AUTHOR.familyName,
    alternateName: ["Binit", "binit2-1"],
    url: getSiteUrl(),
    image: absoluteUrl(siteImages.logo),
    email: `mailto:${CONTACT_EMAIL}`,
    jobTitle: SITE_AUTHOR.jobTitle,
    description: SITE_DESCRIPTION,
    knowsAbout: SITE_AUTHOR.knowsAbout,
    address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressRegion: "Karnataka", addressCountry: "IN" },
    sameAs: SITE_AUTHOR.sameAs,
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: ["binitt.dev", "Binit Gupta Portfolio", "Binit"],
    url: getSiteUrl(),
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

/** Home > ... > current page. `trail` excludes Home. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Serialise a @graph for a <script type="application/ld+json">; escapes "<" so content can't close the tag. */
export function jsonLd(...nodes: object[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}
