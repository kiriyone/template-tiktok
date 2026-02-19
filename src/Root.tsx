import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import {
  calculateMinimalCompositionMetadata,
  MinimalComposition,
  minimalCompositionSchema,
} from "./MinimalComposition";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MinimalHorizontal"
        component={MinimalComposition}
        calculateMetadata={calculateMinimalCompositionMetadata}
        schema={minimalCompositionSchema}
        width={1920}
        height={1080}
        defaultProps={{
          src: staticFile("input.mp4"),
        }}
      />
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
    </>
  );
};
