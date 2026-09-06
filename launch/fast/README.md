# Doorman — Faster launch cuts

[Watch the three new films](https://tiago520.github.io/doorman-website-preview/launch/fast/) with sound, switch between landscape and vertical, and download the finished MP4s. [Download the complete faster launch kit](https://tiago520.github.io/doorman-website-preview/launch/fast/doorman-fast-launch-kit.zip). The [original three directions](https://tiago520.github.io/doorman-website-preview/launch/) remain available for comparison.

| Film | Duration | Music | Direction |
|---|---:|---|---|
| **04 / Velocity** | 24 seconds | 140 BPM electro groove | Full-frame type, abrupt scale changes, tight product close-ups. Recommended starting point. |
| **05 / Assembly** | 26.67 seconds | 144 BPM syncopated bass groove | Follow a request through tools, routing, boundaries and recorded spend. |
| **06 / Overdrive** | 20 seconds | 168 BPM broken beat | One-word opening hits, the shortest holds and a fast social launch rhythm. |

These are new edits and musical arrangements. Timelines contain 16–20 main shots, with shorter internal cuts in the closing montage. Most shots last 0.7–1.7 seconds; the final brand message gets a longer musical resolution. The instrumental music starts on the first downbeat. The story is carried by on-screen type, with no voiceover.

## Reference and identity

The creative reference was the product film on [Apple’s Mac Studio page](https://www.apple.com/mac-studio/), reviewed on September 6, 2026. Its large type, quick changes in scale, precise close-ups and beat-driven editing informed the pacing. The Doorman films use original compositions, original synthesized music and Doorman product imagery. Apple footage and audio are not included.

The [approved Switch identity](assets/brand-guide.md) supplies the exact two-gate mark, wordmark outlines, Inter typography and brand palette: yellow `#ffe600`, ink `#18201b`, paper `#f7f7f3`, white `#ffffff`, muted `#69746c` and stage `#e9ece7`. Logo proportions and geometry are preserved. The bundled Inter font is licensed under the [SIL Open Font License](assets/OFL.txt).

Product close-ups use the existing Doorman sample console captures. They are uniformly cropped and labeled **Sample console · example data**. Copy describes the gateway, routing, budgets, data rules, agent permissions and recorded spend for supported tools and traffic. Numeric values visible in sample captures are examples.

All three scores and transition sounds are synthesized from the editable arrangements in this kit. No stock recordings or Apple music are used. The [asset manifest](assets/manifest.json) records the included assets and their hashes.

## Deliverables and verification

- Six full-resolution MP4s: 1920 × 1080 landscape and 1080 × 1920 vertical, 60 fps, H.264 High, AAC stereo, Rec.709, optimized for progressive playback.
- Three separate 48 kHz stereo scores, mastered to approximately −14 LUFS.
- Timed SRT story text, cover images and storyboards extracted from the encoded MP4s.
- Smaller 720p VP9/Opus WebM files for browser playback where H.264 is unavailable.
- Editable scene renderer, musical arrangements and repeatable export scripts in the ZIP.

The [media verification report](exports/verification.json) records complete decoding of all six films, frame counts, duration, resolution, audio, brand-color samples and SHA-256 checksums. The [gallery check](exports/gallery-verification.json) covers desktop and phone playback, format selection, matching downloads, keyboard operation, font loading and overflow. Audience reach and conversion have not been measured.

Both aspect ratios have their own layouts. Use the full-resolution vertical MP4 for vertical placements and the landscape MP4 for horizontal placements. The gallery respects explicit playback: press play and enable sound.

## Edit and reproduce

Requires Node.js 20+ and Python 3.12+. The scene renderer is `film.mjs`; musical arrangements are in `scripts/score.py`, with synthesis helpers in `scripts/synthesis.py`. Keep `films.json`, the gallery transcript and SRTs aligned after script changes.

```sh
npm ci
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python scripts/score.py
PYTHON=.venv/bin/python node scripts/render.mjs --audio-only
PYTHON=.venv/bin/python npm run render
.venv/bin/python scripts/previews.py
.venv/bin/python scripts/verify.py
.venv/bin/python scripts/package.py
```

To render one film, use `--film 0`, `--film 1` or `--film 2`. Add `--format landscape` or `--format vertical` to select a composition. `--posters` exports scene stills. FFmpeg is supplied by `imageio-ffmpeg`; an existing build can be selected with `FFMPEG`.

`npm run serve` serves the editable gallery for development. The delivered `index.html` also uses relative media links and a plain script for offline review. With Playwright installed, run `scripts/check-gallery.mjs`, setting `PLAYWRIGHT_MODULE` to its module path and `PREVIEW_URL` to the gallery being checked. Rebuild the kit after changing delivery files.
