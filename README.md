# Overtime Vlog Horizontal (Remotion)

A simple horizontal vlog template that stitches multiple beats in order and overlays time + subtitles.

## Composition

- ID: `OvertimeVlogHorizontal`
- Resolution: `1920x1080`
- FPS: `30`
- Input clips are muted by default
- Optional BGM: `public/projects/dallas_001/bgm.mp3` at volume `0.15`
- Optional SFX: `public/clock-beep.mp3` plays at each beat boundary

## Asset placement

Put your files here (do not commit big binaries to GitHub unless using Git LFS):

```text
public/
  projects/
    dallas_001/
      beats.json
      captions.json
      01_wake.mp4 (or .jpg/.png)
      02_commute.mp4 (or .jpg/.png)
      03_work.mp4 (or .jpg/.png)
      04_afterwork.mp4
      05_food.mp4
      06_sleep.mp4
      bgm.mp3        (optional)
  clock-beep.mp3     (optional)
```

## beats.json format

`public/projects/dallas_001/beats.json`

```json
[
  {"file": "01_wake.mp4", "time": "5:30 am", "translateYPercent": -8},
  {"file": "02_commute.mp4", "time": "7:10 am"}
]
```

- `file`: media filename inside `public/projects/dallas_001/` (`.mp4` or `.jpg/.jpeg/.png/.webp`)
- `time`: shown top-right in large text
- `translateYPercent` (optional): vertical crop offset for cover layout. Example: `-8` moves media upward.
- image files are also supported and will display for a default 6 seconds each

## captions.json format

`public/projects/dallas_001/captions.json`

```json
{
  "01_wake.mp4": ["I don't want to wake up.", "My body feels heavy."],
  "02_commute.mp4": "Another long day begins and the train is already packed."
}
```

- Supports **array of lines** or **single long string** per beat.
- Long strings are auto-wrapped/split using:
  - `maxCharsPerLine = 28`
  - `maxLines = 2`
- Caption chunks are shown sequentially with equal time within each beat.

## Run

```bash
npm i
npm run dev
```

## Render

```bash
npx remotion render src/index.ts OvertimeVlogHorizontal out/video.mp4
```
