import type { Icon } from "@phosphor-icons/react";
import { StorefrontIcon } from "@phosphor-icons/react/ssr";
import type { AppIconTone } from "@/components/app-icon";

export type ProjectLogo = {
  src: string;
  /** Intrinsic size of the SVG, used for the aspect ratio. */
  width: number;
  height: number;
  /** Rendered size inside the 32px tile; glyphs need different optical sizes. */
  className: string;
};

export type Project = {
  slug: string;
  name: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  tone: AppIconTone;
  /** Real logo when we have one, otherwise a Phosphor glyph inside the tile. */
  logo?: ProjectLogo;
  icon?: Icon;
  /** Hover preview. Without one, the live site's og:image (or the site OG) is used. */
  video?: { src: string; poster?: string };
  image?: string;
  /** Shown on the home page "Things I made" list. */
  featured?: boolean;
};

const GITHUB = "https://github.com/binit2-1";

// Add new projects here; order is the display order.
export const PROJECTS: Project[] = [
  {
    slug: "composter",
    name: "Composter",
    description: "Component vault for React teams.",
    liveUrl: "https://composter.vercel.app",
    githubUrl: `${GITHUB}/Composter`,
    tone: "purple",
    logo: { src: "/images/logo/composter.svg", width: 24, height: 27, className: "h-[18px] w-auto" },
    // Preview uses the small mobile encode (~2 MB) rather than the 8 MB+ desktop cut.
    video: { src: "/videos/work/mobile/composter.mp4", poster: "/images/work/composter.jpg" },
    featured: true,
  },
  {
    slug: "authingo",
    name: "Authingo",
    description: "Headless auth for React and Go apps.",
    liveUrl: "https://authingo.binitt.dev",
    githubUrl: `${GITHUB}/authingo`,
    tone: "blue",
    logo: { src: "/images/logo/authingo.svg", width: 27, height: 27, className: "size-7" },
    featured: true,
  },
  {
    slug: "hackersquare",
    name: "Hackersquare",
    description: "Hackathon discovery search engine.",
    liveUrl: "https://hackersquare.vercel.app",
    githubUrl: `${GITHUB}/hackersquare`,
    tone: "black",
    logo: { src: "/images/logo/hackersquare.svg", width: 22, height: 16, className: "h-3.5 w-auto" },
    video: { src: "/videos/work/mobile/hackersquare.mp4", poster: "/images/work/hackersquare.jpg" },
    featured: true,
  },
  {
    slug: "munshi",
    name: "Munshi",
    description: "AI manager for small businesses.",
    githubUrl: `${GITHUB}/munshi`,
    tone: "orange",
    icon: StorefrontIcon,
    video: { src: "/videos/work/mobile/munshi.mp4", poster: "/images/work/munshi.jpg" },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);

/** Where the project name itself links: the live site when there is one, else the repo. */
export function primaryProjectUrl(project: Project) {
  return project.liveUrl ?? project.githubUrl ?? "#";
}
