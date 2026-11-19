# Optional person-occlusion preparation

Mac only; existing Swift/Vision + FFmpeg/ffprobe. No model download. These are preparation commands, NOT executed package tests. Confirm rights and native upright SDR dimensions first. HDR/rotation sources need a separately reviewed conform; never strip metadata and assume colors are correct.

For a chosen small source interval, create a paired CFR30 clip with its first local PTS0; replace START, LENGTH, NATIVE_W/NATIVE_H and FRAME_COUNT with values from the real input/probe. Paths below belong to the private customer working project.

```sh
mkdir -p public/matte/example/alpha outputs/matte-pgm
ffmpeg -ss START -i public/input/raw.mp4 -t LENGTH -an -vf "fps=30,setpts=PTS-STARTPTS" -c:v libx264 -crf 0 -pix_fmt yuv420p public/matte/example/source-clock.mp4
swiftc -parse-as-library scripts/SubjectMatte.swift -o outputs/SubjectMatte -framework Vision -framework AVFoundation -framework CoreVideo
outputs/SubjectMatte public/matte/example/source-clock.mp4 outputs/matte-pgm
ffmpeg -framerate 30 -start_number 0 -i outputs/matte-pgm/%06d.pgm -f lavfi -i color=white:s=NATIVE_WxNATIVE_H:r=30 -filter_complex "[0:v]scale=NATIVE_W:NATIVE_H:flags=bicubic,format=gray[mask];[1:v][mask]alphamerge" -frames:v FRAME_COUNT -start_number 0 public/matte/example/alpha/%06d.png
python3 scripts/matte-manifest.py --public-dir public --clip matte/example/source-clock.mp4 --alpha-dir matte/example/alpha --source-sha256 ACTUAL_RAW_SHA256 --output public/matte/example/manifest.json
```

The alpha sequence starts000000, one PNG per decoded paired clip frame. Frame count must match the clip and is capped1800; short windows are preferred. Do not reuse an original-source frame index blindly with a different source fps. The renderer uses paired RGB and alpha at the same source clock, common projection and sourceTransformOrigin. Keep original fullframe base visible; person mask does not guarantee props or fast low hands. Text goes behind the head only in reviewed safe bands, with readable introduction and transformed viewport bounds. Review hair/ears/shoulders/native edges before approval. A manifest proves PTS/count/hash only, not clean extraction.
