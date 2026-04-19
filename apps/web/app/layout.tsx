import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
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
        className={`${helveticaNeue.className} ${geistMono.variable} min-h-screen bg-background font-sans font-light antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <div className="site-shell mx-auto flex w-full max-w-(--site-max-width) flex-1 flex-col px-6 pb-16">
                <main className="flex-1 pt-0">{children}</main>
              </div>
            </div>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
