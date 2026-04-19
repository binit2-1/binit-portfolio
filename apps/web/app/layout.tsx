import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { FloatingThemeToggle } from "@/components/floating-theme-toggle";
import { LenisProvider } from "@/components/lenis-provider";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { basteleur, helveticaNeue } from "@/lib/fonts";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Binit | Portfolio",
    template: "%s | Binit",
  },
  description: "Developer portfolio and blog",
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
  return (
    <html
      lang="en"
      className={`${helveticaNeue.variable} ${basteleur.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${helveticaNeue.className} ${geistMono.variable} min-h-dvh bg-background font-sans font-light antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider>
            <div className="flex min-h-dvh w-full min-w-0 flex-col overflow-x-hidden">
              <Navbar />
              {/* Reserve height: fixed nav is out of flow */}
              <div className="h-[var(--site-nav-h)] shrink-0" aria-hidden />
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
