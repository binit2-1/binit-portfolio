import { cn } from "@repo/ui/lib/utils";
import { HireMeButton } from "@/components/hire-me";

/** Excalifont subset (just the "hire me" glyphs), as exported by Excalidraw with the drawing. */
const EXCALIFONT = `@font-face { font-family: Excalifont; src: url(data:font/woff2;base64,d09GMgABAAAAAAUIAA4AAAAACKwAAAS1AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYbgSQcNAZgAFQRCAqHNIVXCxAAATYCJAMcBCAFgxgHIBvOBlGUUE4J2cdh45jaSJIjbQmM4otHjhmEmzWbhAIVDWkbKmmd1qFqSs+V3jk5VaH34goP9rf3tx9odxEFEmZ5MghKOFDdxDX1o7SCU3StGgUSdd4lUmLTAa61iorHu51vwD7fW3+IHSK9Dpmk0+KZTIdP/KeDAMwBAEAhKCYIAjAVIgFzZOSVga/J2j7wj7a9F/zXPG4APAaAf6PqbdcOQAZVxKCMhAwl7MOAAgloJkAZv+VmWZB2MyEyKRKExA2k3UwPAlQ8Vk1tziUMICJoMhNlZAUkZKGjqgDk6jDkhtrf4EismXZlFuAaBNqc8L+OJCeQCQKwFQDI7zNNIANQABrApvVYjCSAORkKQ9CuWz9tG2FBut5q/Kg3Gzca1xn1ICHkbgQgTQCwHA1kB0gBF7Z8IEBe5zIqNpV3yguv3DGWOlZpv1dx+7Xb9ldpu0x1Od7rsP115ulcn72Zex1xKczzVcSrCkPlbjNR3D06arb3qnJjjrfu3D5fh2ad9xEDb/De9WjfK/ZQlN5UF7SGzN4we6391rEdBn6nwcNjzVoIomgmLqN4XTbrtTBWuddsVHX5tdtrp1l6TKjV73nA7dmi3HjRS1wrYkWFGC9uYqt2+R3g1hgM3AblxnDRcdbm9dsVszatA3HM8lP8mg2EbDQb3a9wXOd20/Ugf9FrdyAOjimP+pxWHS9ft3mzYr2Dfhe3Z6toy5odZIOpfh8iLBvH6mH07K493BpCTNewr8r0tSdjr2bejd6PWew+U90ezvSUr+8hVl+StzmK6/Xr9DXJVHeFr9iS/2rKjT5rdytEEbPKfSpueXb0JBTnOfxc14aLE72Z4mqaU2j63r9vubclb67d7LvvpGq93NmPFxRxxYVMiirNo+briZKR35JNnanSTzXLhhXsQ3XndvykkHm/8tfaW6V+eVHVG5bdZWFuMLNf5A6asQjWhFC5tnQtxVn+q7KTRKWsbDpG0E8k/Ezml0Rpc0bNUImG49yyWNeqrU5VfiTSNn0Yy69//JezYLpnTrOdTVGJmLRIPcVjMom2qbRZ6PBoFyycldIiaZWUd/7K+/ZTRf/gy0CZezChglU9mGJXk+cW6pcYznxlbWP4pn8+qVKd+42NHLGLL/3ozVF9zjVZNam86rzR23yiVjfKjAOHdIHTqFZ5aGnaJJvNhZs1ed+tpt5NrDQboUIRcWoaR7HcY7VlGis57m5ur3G3IDu32e9eUjunkZXI+aVZrPm+zOmLTe28dNCuFkuiY3d/9Dzeks6mOSoNAAACIPD1Qo2h0SruN5kZ/SUAfDTZLw0APt7xzVTjvP+nMl8z0QBkKABA4AkDi61B/Pdv+4e5ljRbkD5WANQGZUQi3K+sYy3ixiaEIgCpMZgICZAuIImdogaNTDmAPi+mQrCuKBRLxxSanwUKw1OLIpHA8xYmPAHpJmnVrE+3DoMGjBOoRLtO4/VpplWhndaIbitTECpISFsuVqY+kw3pMkKgEUStTt8BqgdHUrmbEFrdRk9TKlOBWKpVOpvjUg0aMplWt05dh37tq5WKQC2EWhhBi8kE9ptttJpNFESQrE8fgXePLM52BdudEySjTRAaFOP/JFoAAA==); }`;

/**
 * Hand-drawn "hire me" + arrow (Excalidraw) pointing at the name on Home; opens the hire dialog.
 * Place it inside a `relative` box around the name: the arrow tip sits just after the name's
 * right edge, vertically centred. `.hire-note` (globals.css) wiggles it now and then, pivoting
 * on the tip so the arrow keeps pointing at the name.
 */
export function HireMeNote({ className }: { className?: string }) {
  return (
    <HireMeButton
      aria-label="Hire me"
      className={cn(
        // Tip sits at 7.4% / 90.5% of the drawing: (8, 59)px at 104px wide, (9, 69)px at 122px,
        // so these offsets park it ~6px after the name, level with its middle.
        "hire-note absolute top-[calc(50%-59px)] left-[calc(100%-2px)] w-[104px] sm:top-[calc(50%-69px)] sm:left-[calc(100%-3px)] sm:w-[122px] cursor-pointer rounded-md text-hire focus-visible:ring-2 focus-visible:ring-hire/50 focus-visible:outline-none",
        className,
      )}
    >
      <svg viewBox="0 0 185.8274668790673 116.12412930659048" className="block h-auto w-full" aria-hidden>
        <defs>
          <style>{EXCALIFONT}</style>
        </defs>
        <g transform="translate(38.101541719361194 15.347365220870415) rotate(355.4216702729149 67.98209622004833 24.78835515660103)">
          <text
            x="0"
            y="34.9416654287448"
            fontFamily="Excalifont, Xiaolai, sans-serif, Segoe UI Emoji"
            fontSize="39.66136825056163px"
            fill="currentColor"
            textAnchor="start"
            style={{ whiteSpace: "pre" }}
            direction="ltr"
            dominantBaseline="alphabetic"
          >
            hire me
          </text>
        </g>
        <g strokeLinecap="round">
          <g transform="translate(96.7063846170422 61.95293954684894) rotate(0 -43.248826818517045 21.818144322893204)">
            <path
              d="M0.21 1.25 C-2.96 7.37, -1.78 32, -16.26 38.6 C-30.75 45.2, -75.1 40.23, -86.71 40.85 M-3.12 -0.53 C-7.01 4.51, -6.07 26.49, -19.08 33.94 C-32.09 41.39, -70.01 43.61, -81.19 44.17"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g transform="translate(96.7063846170422 61.95293954684894) rotate(0 -43.248826818517045 21.818144322893204)">
            <path
              d="M-82.96 43.17 L-68.94 37.09 L-68.46 50.6 L-82 44.74"
              stroke="none"
              strokeWidth="0"
              fill="currentColor"
              fillRule="evenodd"
            />
            <path
              d="M-80.52 43.6 C-75.66 39.99, -70.57 37.55, -67.05 36.58 M-81.92 44.63 C-76.9 41.28, -72.35 39.62, -67.82 37.64 M-69.3 38.03 C-68.77 42.8, -66.72 46.8, -67.98 48.53 M-68.13 36.33 C-68.39 41.55, -67.35 45.02, -67.41 49.88 M-66.99 49.62 C-71.51 49.3, -74.8 46.8, -81.32 44.73 M-67.69 50.17 C-72.59 47.43, -77.72 45.13, -81.07 44.62 M-81.19 44.17 C-81.19 44.17, -81.19 44.17, -81.19 44.17 M-81.19 44.17 C-81.19 44.17, -81.19 44.17, -81.19 44.17"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </HireMeButton>
  );
}
