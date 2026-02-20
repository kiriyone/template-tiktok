import {AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, staticFile} from "remotion";
import {z} from "zod";
import {BeatSegment} from "./overtime/BeatSegment";
import {fileExistsInPublic, loadOvertimeBeats} from "./lib/overtimeProject";

export const overtimeVlogSchema = z.object({
  beats: z
    .array(
      z.object({
        file: z.string(),
        time: z.string(),
        translateYPercent: z.number(),
        durationInFrames: z.number(),
        captionChunks: z.array(z.string()),
      }),
    )
    .optional(),
});

export const calculateOvertimeVlogMetadata: CalculateMetadataFunction<
  z.infer<typeof overtimeVlogSchema>
> = async () => {
  const fps = 30;
  const beats = await loadOvertimeBeats({fps, maxCharsPerLine: 28, maxLines: 2});
  const durationInFrames = beats.reduce((sum, beat) => sum + beat.durationInFrames, 0);

  return {
    fps,
    durationInFrames,
    props: {
      beats,
    },
  };
};

export const OvertimeVlogHorizontal: React.FC<z.infer<typeof overtimeVlogSchema>> = ({
  beats = [],
}) => {
  const hasBgm = fileExistsInPublic("projects/dallas_001/bgm.mp3");
  const hasClockBeep = fileExistsInPublic("clock-beep.mp3");

  let cursor = 0;
  const items = beats.map((beat) => {
    const from = cursor;
    cursor += beat.durationInFrames;
    return {from, beat};
  });

  return (
    <AbsoluteFill>
      {hasBgm ? <Audio src={staticFile("projects/dallas_001/bgm.mp3")} volume={0.15} /> : null}

      {hasClockBeep
        ? items.map((item) => {
            return (
              <Sequence key={`beep-${item.from}`} from={item.from} durationInFrames={1}>
                <Audio src={staticFile("clock-beep.mp3")} volume={0.5} />
              </Sequence>
            );
          })
        : null}

      {items.map(({from, beat}) => {
        const clipPath = `projects/dallas_001/${beat.file}`;
        const srcPath = fileExistsInPublic(clipPath) ? clipPath : null;

        return (
          <Sequence key={`${from}-${beat.file}`} from={from} durationInFrames={beat.durationInFrames}>
            <BeatSegment
              srcPath={srcPath}
              time={beat.time}
              captions={beat.captionChunks}
              durationInFrames={beat.durationInFrames}
              translateYPercent={beat.translateYPercent}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
