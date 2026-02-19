const MIN_CAPTION_SECONDS = 1.2;

const getCaptionWeight = (caption: string): number => {
  const trimmed = caption.trim();
  if (trimmed.length === 0) {
    return 1;
  }

  const words = trimmed.split(/\s+/).filter(Boolean).length;
  return Math.max(trimmed.length, words * 4, 1);
};

export const allocateCaptionDurations = ({
  captions,
  beatDurationInFrames,
  fps,
}: {
  captions: string[];
  beatDurationInFrames: number;
  fps: number;
}): number[] => {
  if (captions.length === 0) {
    return [];
  }

  const minFrames = Math.max(1, Math.floor(MIN_CAPTION_SECONDS * fps));

  if (captions.length * minFrames >= beatDurationInFrames) {
    const base = Math.floor(beatDurationInFrames / captions.length);
    const durations = captions.map(() => Math.max(1, base));
    let remainder = beatDurationInFrames - durations.reduce((acc, value) => acc + value, 0);

    for (let i = 0; i < durations.length && remainder > 0; i++) {
      durations[i] += 1;
      remainder -= 1;
    }

    return durations;
  }

  const weights = captions.map(getCaptionWeight);
  const weightSum = weights.reduce((acc, weight) => acc + weight, 0);
  const remainingFrames = beatDurationInFrames - captions.length * minFrames;

  const durations = weights.map((weight) => {
    return minFrames + Math.floor((weight / weightSum) * remainingFrames);
  });

  let assignedFrames = durations.reduce((acc, value) => acc + value, 0);
  let remainder = beatDurationInFrames - assignedFrames;

  let index = 0;
  while (remainder > 0) {
    durations[index % durations.length] += 1;
    remainder -= 1;
    index += 1;
  }

  assignedFrames = durations.reduce((acc, value) => acc + value, 0);
  if (assignedFrames !== beatDurationInFrames) {
    durations[durations.length - 1] += beatDurationInFrames - assignedFrames;
  }

  return durations;
};
