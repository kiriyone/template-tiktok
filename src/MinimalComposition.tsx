import {getVideoMetadata} from '@remotion/media-utils';
import {AbsoluteFill, CalculateMetadataFunction, OffthreadVideo} from 'remotion';
import {z} from 'zod';

export const minimalCompositionSchema = z.object({
  src: z.string(),
});

export const calculateMinimalCompositionMetadata: CalculateMetadataFunction<
  z.infer<typeof minimalCompositionSchema>
> = async ({props}) => {
  const fps = 30;
  const metadata = await getVideoMetadata(props.src);

  return {
    fps,
    durationInFrames: Math.floor(metadata.durationInSeconds * fps),
  };
};

const textShadow = '0 2px 6px rgba(0, 0, 0, 0.7)';

export const MinimalComposition: React.FC<{src: string}> = ({src}) => {
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
