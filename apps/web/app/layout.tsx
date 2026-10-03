import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { HireMeDialog } from "@/components/hire-me";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { googleSansFlex } from "@/lib/fonts";
import { JsonLd } from "@/components/json-ld";
import { personSchema, websiteSchema } from "@/lib/seo";
import { getSiteUrl, SITE_AUTHOR, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, siteImages } from "@/lib/site";
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
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR.name, url: getSiteUrl() }],
  creator: SITE_AUTHOR.name,
  publisher: SITE_AUTHOR.name,
  keywords: SITE_KEYWORDS,
  category: "technology",
  // Canonical URLs are per page (lib/seo.ts `pageMetadata`), so error pages don't claim to be Home.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: siteImages.icon, type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: siteImages.appleIcon, sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: siteImages.og, width: 1200, height: 630, alt: SITE_NAME }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [siteImages.og],
    creator: SITE_AUTHOR.twitter,
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
  // Google Search Console "HTML tag" verification: set GOOGLE_SITE_VERIFICATION to the token.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

/** Mobile: pin to device width, avoid accidental mini-viewport quirks; `viewport-fit` for notched screens. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#111113" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={googleSansFlex.variable}
      suppressHydrationWarning
    >
      <body
        className={`${geistMono.variable} min-h-dvh bg-background font-sans text-foreground antialiased`}
      >
        <JsonLd nodes={[websiteSchema(), personSchema()]} />
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="3cf97a47-6679-49e2-a850-be8089109f53"></Script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Column fills the viewport, so on short pages the footer rests at the bottom. */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
          >
            Skip to content
          </a>
          <div className="mx-auto flex min-h-svh w-full max-w-[44rem] flex-col px-5 pb-10 sm:px-6 sm:pb-12">
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <HireMeDialog />
          {/* Page blur behind a hovered row; tune it under "HOVER FOCUS" in globals.css. */}
          <div aria-hidden className="focus-overlay" />
        </ThemeProvider>
      </body>
    </html>
  );
}
