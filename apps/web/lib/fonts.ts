import { Google_Sans_Flex, Instrument_Sans, JetBrains_Mono } from "next/font/google";

/** Site-wide sans (v2 redesign). Variable font, so any weight 100–1000 works. */
export const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-google-sans-flex",
  display: "swap",
});

/** Writing pages only (typography after ui.nexvyn.dev): body + headings, and code. */
export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
