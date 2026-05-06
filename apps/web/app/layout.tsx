import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { FloatingThemeToggle } from "@/components/floating-theme-toggle";
import { LenisProvider } from "@/components/lenis-provider";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { basteleur, helveticaNeue, helveticaOblique } from "@/lib/fonts";
import { absoluteUrl, getSiteUrl, SITE_AUTHOR, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, siteImages } from "@/lib/site";
import "./globals.css";
import Script from "next/script";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_TITLE,
    template: "%s | Binit",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR.name, url: getSiteUrl() }],
  creator: SITE_AUTHOR.name,
  publisher: SITE_AUTHOR.name,
  keywords: SITE_KEYWORDS,
  category: "portfolio",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: siteImages.icon, type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: siteImages.appleIcon, sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: siteImages.logo,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [siteImages.logo],
    creator: "@BinitGupta21",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/** Mobile: pin to device width, avoid accidental mini-viewport quirks; `viewport-fit` for notched screens. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: getSiteUrl(),
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
    },
  };
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_AUTHOR.name,
    url: getSiteUrl(),
    image: absoluteUrl(siteImages.logo),
    jobTitle: "Web Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressCountry: "IN",
    },
    sameAs: SITE_AUTHOR.sameAs,
  };

  return (
    <html
      lang="en"
      className={`${helveticaNeue.variable} ${basteleur.variable} ${helveticaOblique.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${helveticaNeue.className} ${geistMono.variable} min-h-dvh bg-background font-sans font-light antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="3cf97a47-6679-49e2-a850-be8089109f53"></Script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider>
            <div className="flex min-h-dvh w-full min-w-0 flex-col overflow-x-hidden">
              <Navbar />
              {/* Reserve height: fixed nav is out of flow */}
              <div className="h-(--site-nav-h) shrink-0" aria-hidden />
              <div className="site-shell mx-auto flex w-full min-w-0 max-w-(--site-max-width) flex-1 flex-col px-4 pb-16 sm:px-6">
                <main className="min-w-0 flex-1 pt-0">{children}</main>
              </div>
              <FloatingThemeToggle />
            </div>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
