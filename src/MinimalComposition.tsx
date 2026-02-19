import {getAudioDurationInSeconds, getVideoMetadata} from '@remotion/media-utils';
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  OffthreadVideo,
  Sequence,
  staticFile,
} from 'remotion';
import {z} from 'zod';

const BGM_TRACKS = ['bgm1.mp3', 'bgm2.mp3', 'bgm3.mp3'] as const;

type BgmSegment = {
  src: string;
  from: number;
  durationInFrames: number;
};

export const minimalCompositionSchema = z.object({
  src: z.string(),
  bgmSegments: z
    .array(
      z.object({
        src: z.string(),
        from: z.number(),
        durationInFrames: z.number(),
      }),
    )
    .optional(),
});

const buildBgmSegments = ({
  durationInFrames,
  trackDurationsInFrames,
}: {
  durationInFrames: number;
  trackDurationsInFrames: number[];
}): BgmSegment[] => {
  const segments: BgmSegment[] = [];
  let cursor = 0;
  let index = 0;

  while (cursor < durationInFrames) {
    const trackDuration = trackDurationsInFrames[index % trackDurationsInFrames.length];
    const duration = Math.min(trackDuration, durationInFrames - cursor);

    segments.push({
      src: BGM_TRACKS[index % BGM_TRACKS.length],
      from: cursor,
      durationInFrames: duration,
    });

    cursor += duration;
    index += 1;
  }

  return segments;
};

export const calculateMinimalCompositionMetadata: CalculateMetadataFunction<
  z.infer<typeof minimalCompositionSchema>
> = async ({props}) => {
  const fps = 30;
  const metadata = await getVideoMetadata(props.src);
  const durationInFrames = Math.floor(metadata.durationInSeconds * fps);

  const trackDurationsInFrames = await Promise.all(
    BGM_TRACKS.map(async (track) => {
      const durationInSeconds = await getAudioDurationInSeconds(staticFile(track));
      return Math.max(1, Math.floor(durationInSeconds * fps));
    }),
  );

  return {
    fps,
    durationInFrames,
    props: {
      ...props,
      bgmSegments: buildBgmSegments({
        durationInFrames,
        trackDurationsInFrames,
      }),
    },
  };
};

const textShadow = '0 2px 6px rgba(0, 0, 0, 0.7)';

export const MinimalComposition: React.FC<z.infer<typeof minimalCompositionSchema>> = ({
  src,
  bgmSegments = [],
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <OffthreadVideo
        src={src}
        muted
        volume={0}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {bgmSegments.map((segment) => {
        return (
          <Sequence
            key={`${segment.from}-${segment.src}`}
            from={segment.from}
            durationInFrames={segment.durationInFrames}
          >
            <Audio src={staticFile(segment.src)} volume={0.12} />
          </Sequence>
        );
      })}

      <div
        style={{
          position: 'absolute',
          top: 44,
          left: 44,
          color: 'white',
          fontSize: 56,
          fontFamily: 'sans-serif',
          fontWeight: 700,
          textShadow,
        }}
      >
        1:42 am
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '18px 40px 28px',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 54,
            lineHeight: 1.2,
            fontFamily: 'sans-serif',
            fontWeight: 600,
            textShadow,
          }}
        >
          I&apos;m tired.
        </div>
      </div>
    </AbsoluteFill>
  );
};
