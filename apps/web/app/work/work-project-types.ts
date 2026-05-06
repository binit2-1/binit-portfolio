export type WorkProjectVideoSource = {
  src: string;
  mobileSrc?: string;
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
