import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Sequence,
  getStaticFiles,
  staticFile,
} from 'remotion';
import {z} from 'zod';
import {Beat} from './Beat';
import {loadProject} from './lib/loadProject';

const compositionFps = 30;

const beatSchema = z.object({
  file: z.string(),
  time: z.string(),
  captions: z.array(z.string()),
  durationInSeconds: z.number(),
});

export const mainCompositionSchema = z.object({
  projectId: z.string(),
  beats: z.array(beatSchema).optional(),
});

export const calculateMainCompositionMetadata: CalculateMetadataFunction<
  z.infer<typeof mainCompositionSchema>
> = async ({props}) => {
  const project = loadProject(props.projectId);

  const durationInFrames = project.beats.reduce((acc, beat) => {
    return acc + Math.max(1, Math.floor(beat.durationInSeconds * compositionFps));
  }, 0);

  return {
    fps: compositionFps,
    durationInFrames,
    props: {
      ...props,
      beats: project.beats,
    },
  };
};

export const MainComposition: React.FC<z.infer<typeof mainCompositionSchema>> = ({beats = []}) => {
  let cursor = 0;

  const sequences = beats.map((beat) => {
    const durationInFrames = Math.max(1, Math.floor(beat.durationInSeconds * compositionFps));
    const from = cursor;
    cursor += durationInFrames;

    return {
      beat,
      from,
      durationInFrames,
    };
  });

  const hasBgm = getStaticFiles().some((file) => file.name === 'bgm.mp3');

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {hasBgm ? <Audio src={staticFile('bgm.mp3')} volume={0.1} loop /> : null}

      {sequences.map(({beat, from, durationInFrames}) => {
        return (
          <Sequence key={`${from}-${beat.file}`} from={from} durationInFrames={durationInFrames}>
            <Beat
              file={beat.file}
              time={beat.time}
              captions={beat.captions}
              durationInFrames={durationInFrames}
              fps={compositionFps}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
