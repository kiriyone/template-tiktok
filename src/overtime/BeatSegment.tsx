import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from "remotion";

const getCaptionIndex = (frame: number, totalFrames: number, count: number) => {
  if (count <= 1) {
    return 0;
  }

  const base = Math.floor(totalFrames / count);
  const remainder = totalFrames % count;

  let cursor = 0;
  for (let i = 0; i < count; i++) {
    const slot = base + (i < remainder ? 1 : 0);
    cursor += slot;
    if (frame < cursor) {
      return i;
    }
  }

  return count - 1;
};

const isImageFile = (srcPath: string) => {
  const lower = srcPath.toLowerCase();
  return (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".webp")
  );
};

export const BeatSegment: React.FC<{
  srcPath: string | null;
  time: string;
  captions: string[];
  durationInFrames: number;
  translateYPercent?: number;
}> = ({srcPath, time, captions, durationInFrames, translateYPercent = 0}) => {
  const frame = useCurrentFrame();
  const captionIndex = getCaptionIndex(frame, durationInFrames, captions.length);
  const caption = captions[captionIndex] ?? "";

  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    transform: `translateY(${translateYPercent}%)`,
  };

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{overflow: "hidden"}}>
        {srcPath ? (
          isImageFile(srcPath) ? (
            <Img src={staticFile(srcPath)} style={mediaStyle} />
          ) : (
            <OffthreadVideo src={staticFile(srcPath)} volume={1} style={mediaStyle} />
          )
        ) : (
          <AbsoluteFill style={{backgroundColor: "black"}} />
        )}
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: 60,
          right: 60,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 96,
          fontWeight: 700,
          color: "white",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
          textAlign: "right",
        }}
      >
        {time}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 48,
          textAlign: "center",
          padding: "0 40px",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 72,
          fontWeight: 700,
          color: "white",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
          lineHeight: 1.2,
          whiteSpace: "pre-line",
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};
