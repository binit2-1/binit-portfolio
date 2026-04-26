export type WorkProjectVideoSource = {
  src: string;
  type?: string;
  poster?: string;
};

export type WorkProject = {
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  spotlightLabel?: string;
  video?: WorkProjectVideoSource;
};
