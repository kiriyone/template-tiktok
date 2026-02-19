import {AbsoluteFill, getStaticFiles, Img, OffthreadVideo, staticFile} from 'remotion';

export const Beat: React.FC<{
  file: string;
  time?: string;
  captions?: string[];
  durationInFrames?: number;
  fps?: number;
}> = ({file}) => {
  const lower = file.toLowerCase();
  const fileExists = getStaticFiles().some((asset) => asset.name === file);

  const isImage =
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp');

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {!fileExists ? null : isImage ? (
        <Img
          src={staticFile(file)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <OffthreadVideo
          src={staticFile(file)}
          muted
          volume={0}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
