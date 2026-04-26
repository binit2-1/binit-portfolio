export type WorkProjectVideoSource = {
  src: string;
  type?: string;
  poster?: string;
  orientation?: "landscape" | "portrait";
};

export type WorkProject = {
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  spotlightLabel?: string;
  video?: WorkProjectVideoSource;
};
