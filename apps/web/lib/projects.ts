import type { Icon } from "@phosphor-icons/react";
import { CubeIcon, KeyIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import type { AppIconTone } from "@/components/app-icon";

export type Project = {
  name: string;
  description: string;
  href: string;
  tone: AppIconTone;
  /** Placeholder glyph until the real project logos land. */
  icon: Icon;
};

export const PROJECTS: Project[] = [
  {
    name: "Composter",
    description: "Component vault for React teams.",
    href: "https://composter.vercel.app",
    tone: "purple",
    icon: CubeIcon,
  },
  {
    name: "Authingo",
    description: "Headless auth for React and Go apps.",
    href: "https://authingo.binitt.dev",
    tone: "blue",
    icon: KeyIcon,
  },
  {
    name: "Hackersquare",
    description: "Hackathon discovery search engine.",
    href: "https://hackersquare.vercel.app",
    tone: "black",
    icon: MagnifyingGlassIcon,
  },
];
