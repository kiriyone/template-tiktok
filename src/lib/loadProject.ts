import beatsDallas001 from '../../projects/dallas_001/beats.json';

export type BeatInput = {
  file: string;
  time: string;
  captions: string[];
  duration?: number;
};

export type BeatResolved = {
  file: string;
  time: string;
  captions: string[];
  durationInSeconds: number;
};

export type ProjectData = {
  beats: BeatResolved[];
};

const DEFAULT_BEAT_DURATION_IN_SECONDS = 6;

const projectRegistry: Record<string, BeatInput[]> = {
  dallas_001: beatsDallas001 as BeatInput[],
};

export const loadProject = (projectId: string): ProjectData => {
  const beats = projectRegistry[projectId];

  if (!beats) {
    throw new Error(`Unknown projectId: ${projectId}`);
  }

  return {
    beats: beats.map((beat) => {
      return {
        file: beat.file,
        time: beat.time,
        captions: beat.captions,
        durationInSeconds: beat.duration ?? DEFAULT_BEAT_DURATION_IN_SECONDS,
      };
    }),
  };
};
