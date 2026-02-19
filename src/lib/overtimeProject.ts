import {getVideoMetadata} from "@remotion/media-utils";
import {getStaticFiles, staticFile} from "remotion";

export type BeatInput = {
  file: string;
  time: string;
};

export type CaptionsInput = Record<string, string | string[]>;

export type OvertimeBeat = {
  file: string;
  time: string;
  durationInFrames: number;
  captionChunks: string[];
};

const DEFAULT_FPS = 30;
const FALLBACK_DURATION_IN_SECONDS = 6;

const hasStaticFile = (relativePath: string) => {
  const staticFiles = getStaticFiles();
  const normalized = `/${relativePath}`;
  return staticFiles.some((file) => file.src === normalized || file.name === relativePath);
};

const loadJson = async <T>(relativePath: string): Promise<T> => {
  const res = await fetch(staticFile(relativePath));
  if (!res.ok) {
    throw new Error(`Could not load ${relativePath}`);
  }

  return (await res.json()) as T;
};

const wrapLines = (text: string, maxCharsPerLine: number): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length === 0) {
      current = word;
      continue;
    }

    const next = `${current} ${word}`;
    if (next.length <= maxCharsPerLine) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines;
};

export const splitCaptionIntoChunks = ({
  text,
  maxCharsPerLine,
  maxLines,
}: {
  text: string;
  maxCharsPerLine: number;
  maxLines: number;
}): string[] => {
  const lines = wrapLines(text, maxCharsPerLine);
  const chunks: string[] = [];

  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines).join("\n"));
  }

  return chunks.length > 0 ? chunks : [""];
};

const resolveCaptionChunks = (
  raw: string | string[] | undefined,
  maxCharsPerLine: number,
  maxLines: number,
): string[] => {
  if (typeof raw === "string") {
    return splitCaptionIntoChunks({text: raw, maxCharsPerLine, maxLines});
  }

  if (Array.isArray(raw)) {
    const chunks = raw.flatMap((line) => {
      return splitCaptionIntoChunks({text: line, maxCharsPerLine, maxLines});
    });
    return chunks.length > 0 ? chunks : [""];
  }

  return [""];
};

const getBeatDurationInFrames = async (file: string, fps: number): Promise<number> => {
  const relativePath = `projects/dallas_001/${file}`;
  if (!hasStaticFile(relativePath)) {
    return Math.floor(FALLBACK_DURATION_IN_SECONDS * fps);
  }

  const metadata = await getVideoMetadata(staticFile(relativePath));
  return Math.max(1, Math.floor(metadata.durationInSeconds * fps));
};

export const loadOvertimeBeats = async ({
  fps = DEFAULT_FPS,
  maxCharsPerLine = 28,
  maxLines = 2,
}: {
  fps?: number;
  maxCharsPerLine?: number;
  maxLines?: number;
}): Promise<OvertimeBeat[]> => {
  const beats = await loadJson<BeatInput[]>("projects/dallas_001/beats.json");
  const captions = await loadJson<CaptionsInput>("projects/dallas_001/captions.json");

  const resolved = await Promise.all(
    beats.map(async (beat) => {
      const durationInFrames = await getBeatDurationInFrames(beat.file, fps);
      const captionChunks = resolveCaptionChunks(captions[beat.file], maxCharsPerLine, maxLines);

      return {
        file: beat.file,
        time: beat.time,
        durationInFrames,
        captionChunks,
      };
    }),
  );

  return resolved;
};

export const fileExistsInPublic = hasStaticFile;
