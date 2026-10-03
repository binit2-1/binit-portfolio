import { Google_Sans_Flex } from "next/font/google";
import localFont from "next/font/local";

/** Site-wide sans (v2 redesign). Variable font, so any weight 100–1000 works. */
export const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-google-sans-flex",
  display: "swap",
});

export const helveticaNeue = localFont({
  src: [
    {
      path: "../app/fonts/HelveticaNeueLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../app/fonts/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-helvetica-neue",
  display: "swap",
});

export const basteleur = localFont({
  src: [
    {
      path: "../app/fonts/Basteleur-Moonlight.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/Basteleur-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-basteleur",
  display: "swap",
});

export const helveticaOblique = localFont({
  src: [
    {
      path: "../app/fonts/Helvetica-Oblique.ttf",
      weight: "400",
      style: "oblique",
    },
  ],
  variable: "--font-helvetica-oblique",
  display: "swap",
});
