# Doorman launch films

Three finished motion-graphics films, each composed separately for landscape and vertical. Every film has an original instrumental score and tells the story through readable on-screen text. There is no voiceover.

Watch [the public comparison player](https://tiago520.github.io/doorman-website-preview/launch/), choose a style and format, then play with sound. [Download the complete launch kit](https://tiago520.github.io/doorman-website-preview/launch/doorman-launch-kit.zip). The MP4 downloads are the full-resolution delivery files. The gallery also includes smaller WebM playback fallbacks for browsers without H.264 support.

| Direction | Duration | Music | Intended placement |
|---|---:|---|---|
| **01 / The Switch** | 38.4 seconds | 100 BPM, warm electric keys, wide harmony, restrained electronic pulse | Brand introduction and website hero |
| **02 / In Motion** | 32 seconds | 120 BPM, plucked synths, syncopated bass, driving percussion | Recommended launch lead and social cut |
| **03 / Inside Doorman** | 40 seconds | 96 BPM, mallets, electric keys, precise downtempo percussion | Product explanation and follow-up |

**Launch recommendation:** start with *In Motion*. Its first phrase builds from “More tools. More agents. More AI.” into “Who’s in control?” The reveal answers that question, then explains the gateway, routing, boundaries and spend. *The Switch* gives the same product more room; *Inside Doorman* adds actual product close-ups and numbered chapters.

## Delivery

- `exports/*-landscape.mp4`: 1920 × 1080, 30 fps, H.264 High, AAC stereo, Rec.709.
- `exports/*-vertical.mp4`: 1080 × 1920, 30 fps, independent portrait layouts.
- `audio/*.m4a`: three original 48 kHz stereo scores, separately downloadable.
- `exports/*.srt`: editable, timed story text; the essential story is already visible in the films.
- `posters/*-landscape.jpg`, `*-vertical.jpg`: cover images.
- `posters/*-storyboard.jpg`: scene contact sheets extracted from the actual encoded videos.
- `previews/*.webm`: 720p VP9/Opus browser fallbacks; MP4 remains the download format.
- `exports/verification.json`: complete decode, dimensions, durations, frame counts, audio measurements, brand-color samples and SHA-256 checksums.
- `exports/gallery-verification.json`: browser playback and download verification.

Music phrases and scene changes meet every two bars. Each ending has a held CTA and a musical resolution. Scores are mastered to approximately −14 LUFS; the mastering stage targets −1 dBTP. The verification report measures the encoded audio separately. Portrait compositions keep primary messages and the CTA away from the extreme top and bottom; actual platform overlays depend on placement.

## Brand and product sources

The source of truth is [the approved Switch guide](assets/brand-guide.md), copied from `design/macos-switch/assets/brand-guide.md`. The supplied wordmark outlines and exact gate geometry are preserved. Palette: yellow `#ffe600`, ink `#18201b`, paper `#f7f7f3`, white `#ffffff`, muted `#69746c`, and stage `#e9ece7`. Inter is supplied locally under the [SIL Open Font License](assets/OFL.txt). `Inter.ttf` is a decompressed version of the same variable WOFF2, not a substitute family.

The visual approach also follows the current Switch and white-console amendments in the Doorman website design system. This is an isolated film project; it does not change the website, Mac app, helper, gateway or live settings.

Product copy was checked against the Doorman product copy briefs, website product explanation, and Mac app documentation. The films describe supported traffic through the gateway. They make no fixed-savings, universal-coverage, production-release, pricing, or certification claims. “Data rules” and “agent permissions” are deliberately scoped; the launch copy does not imply every possible secret or action is blocked.

The console images are the existing 3200 × 2200 sample captures from `doorman-site-complete/site/assets/img/console-hd/`. They are cropped uniformly around the relevant job and labeled **Sample console · example data** in the video. Values in the actual screenshots are examples, not launch performance claims.

The Mac image is the actual native preview capture from `site/assets/img/native-macos/popover-protected@2x.png`, labeled **Native preview build · example data**. Its [capture provenance](assets/native-provenance.json) records the native build and limitations. No installer availability is implied.

The [asset manifest](assets/manifest.json) records the included files and hashes. The scores are synthesized by `scripts/score.py`; no stock music, external recordings, samples or sound effects were used. No third-party music attribution or subscription is required for these compositions. Existing product assets remain Doorman's; the bundled font retains its OFL license.

## Edit and reproduce

`film.mjs` is the deterministic scene renderer. Change its timelines, copy and composition there. `scripts/score.py` contains the editable musical arrangements. `gallery.js` contains the comparison player's descriptive text and readable transcript; keep it aligned with the film script after copy changes.

Requires Node.js 20+ and Python 3.12+. From this directory:

```sh
npm ci
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python scripts/score.py
PYTHON=.venv/bin/python node scripts/render.mjs --audio-only
PYTHON=.venv/bin/python npm run render
.venv/bin/python scripts/previews.py
.venv/bin/python scripts/verify.py
npm run serve
```

Open `http://127.0.0.1:48628/`. Opening `index.html` directly also works because the gallery uses a plain local script and local media.

For one film: `PYTHON=.venv/bin/python node scripts/render.mjs --film 1`. Film indexes are 0, 1, 2. Add `--format vertical` or `--format landscape` to render one composition. `--posters` renders scene stills without encoding video. FFmpeg is supplied by `imageio-ffmpeg`; set `FFMPEG` to use another compatible build.

To verify the gallery with an existing Playwright installation:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/node_modules/playwright node scripts/check-gallery.mjs
```

The browser check covers desktop and mobile, all six selections, actual playback, matching downloads, keyboard selection, font loading and overflow. Video and audio verification decodes all delivery frames and checks the encoded output; it does not validate native routing or customer outcomes.

## Suggested launch copy

**Primary:** Your AI has more tools. More models. More agents. Meet Doorman: the AI gateway that helps you route requests, set clear boundaries and understand the spend. Your AI. Under control. doorman.ai

**Short:** Keep your tools. Bring your own keys. Put clear rules around your AI. Meet Doorman. doorman.ai

**Product follow-up:** What happens to an AI request? Follow it through Doorman—from your tools, through your routing rules, to the evidence behind the cost. doorman.ai

Use the vertical film as its own composition, and upload the full-resolution MP4. The editable files, separate music and timed text support later hook and CTA variants. Views and conversion have not been measured.
