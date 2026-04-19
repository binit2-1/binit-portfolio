import localFont from "next/font/local";

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
