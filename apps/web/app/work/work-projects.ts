import type { WorkProject } from "./work-project-types";

// Add new projects here.
// `video.src` accepts both local public paths (e.g. "/videos/work/demo.mp4")
// and remote URLs (e.g. "https://cdn.example.com/demo.mp4").
export const WORK_PROJECTS: WorkProject[] = [
  {
    title: "Composter",
    description: "Component vault for React teams.",
    githubUrl: "https://github.com/binit2-1/Composter",
    liveUrl: "https://composter.vercel.app",
    spotlightLabel: "COMPOSTER",
    video: {
      src: "/videos/work/composter.mp4",
      type: "video/mp4",
      orientation: "landscape",
    },
  },
  {
    title: "Hackersquare",
    description: "Hackathon discovery and tracking app.",
    githubUrl: "https://github.com/binit2-1/hackersquare",
    liveUrl: "https://hackersquare.vercel.app",
    spotlightLabel: "HACKERSQUARE",
    video: {
      src: "/videos/work/hackerquare.mp4",
      type: "video/mp4",
      orientation: "landscape",
    },
  },
  {
    title: "Munshi",
    description: "AI assistant for local shop workflows.",
    githubUrl: "https://github.com/binit2-1/munshi",
    liveUrl: "https://github.com/binit2-1/munshi",
    spotlightLabel: "MUNSHI",
    video: {
      src: "/videos/work/munshi.mp4",
      type: "video/mp4",
      orientation: "portrait",
    },
  },
];
