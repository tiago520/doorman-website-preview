# Doorman — The studio film

[Watch the film with sound](https://tiago520.github.io/doorman-website-preview/launch/studio/). [Download all four MP4s](https://tiago520.github.io/doorman-website-preview/launch/studio/doorman-studio-launch-kit.zip). [Download editable sources](https://tiago520.github.io/doorman-website-preview/launch/studio/doorman-studio-source.zip).

A 48-second product film with dark studio artwork, moving light, close-ups of the console and readable typography. Its nine scenes last 4–6 seconds each. Headlines settle before the next transition. Landscape and portrait use separate compositions, including different product crops.

Two soundtrack choices use the same picture and reading pace:

| Version | Music | Character |
|---|---|---|
| Studio groove | “Deep Urban” by Eugenio Mininni | Bass-led tech house |
| Club mix | “Cat Walk” by Arulo | Brighter dance music |

The player can switch the soundtrack at the current point in the film. Both versions are delivered as 1920 × 1080 and 1080 × 1920 MP4s, 60 fps, H.264 High, Rec.709, AAC stereo at 48 kHz. Smaller VP9/Opus files support web browsers without H.264. The music is normalized to approximately −14 LUFS.

## Creative direction

The reference is the film on [Apple’s Mac Studio product page](https://www.apple.com/mac-studio/), reviewed on September 6, 2026. The new treatment draws on its dark stage, controlled industrial lighting, material detail and music-led presentation. The Doorman film gives its explanation longer holds. No Apple footage or audio is included.

The story introduces Doorman as the AI gateway, then explains supported tools, routing, budgets, data rules, agent permissions and recorded spend. Product captures use example data and are labeled in the film. The film makes no fixed-savings or universal-coverage claims.

The [approved Switch guide](assets/brand-guide.md) supplies the identity. The two-gate mark and wordmark retain the supplied geometry and proportions. The yellow application icon uses its approved container. Typography is genuine Inter, with explicit 400, 500, 600 and 700 font instances generated from the supplied variable font. The font retains its [OFL license](assets/OFL.txt).

## Artwork and music credits

The new background plates, [Ribbons](assets/ribbons.png) and [Fins](assets/fins.png), were generated with the built-in image tool for this production. The [exact prompts](references/background-prompts.md) are included. The logo, copy, product imagery, moving light, compositing and animation are separate layers. The console images are existing Doorman sample captures.

“Deep Urban” and “Cat Walk” are produced recordings from [Mixkit’s music library](https://mixkit.co/free-stock-music/house/), used under the [Mixkit Stock Music Free License](https://mixkit.co/license/#musicFree). The license permits use in web and social videos, including online marketing. It excludes television/radio broadcasts, video games and standalone music remixes. These delivery files are prepared for web and social release. Music ownership remains with the respective rights holders.

The sync edits use 48-second excerpts, edge fades and loudness normalization. The music is included in finished audiovisual exports. Standalone recordings are not redistributed in the gallery or archives. The [source metadata](references/music-sources.json) and per-version audio records document the tracks, excerpts and processing. Raw music can be downloaded from the provider when reproducing the project.

## Delivery checks

The [media report](exports/verification.json) records full decoding of all 11,520 delivered frames, durations, resolution, audio levels, a brand-color sample and SHA-256 hashes. The [browser report](exports/gallery-verification.json) covers desktop and phone playback, explicit playback with sound, soundtrack switching without restarting, keyboard selection and matching downloads.

The launch kit contains the four finished MP4s, timed text and production notes. The separate source archive contains the renderer, gallery code, art and reproducible scripts. It excludes the provider’s standalone music and the finished media. Audience response and campaign reach have not been measured.

## Reproduce from the source archive

Requires Node.js 20+ and Python 3.12+. Run these commands from the unpacked source directory:

```sh
npm ci
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python scripts/fetch-music.py
.venv/bin/python scripts/audio.py
PYTHON=.venv/bin/python npm run render
.venv/bin/python scripts/previews.py
.venv/bin/python scripts/verify.py
.venv/bin/python scripts/package.py
npm run serve
```

`film.mjs` contains the timeline and separate compositions. `scripts/audio.py` prepares the licensed sync excerpts. `scripts/render.mjs` renders each picture once and muxes both music choices. `scripts/check-gallery.mjs` runs with an existing Playwright installation, selected with `PLAYWRIGHT_MODULE`; set `PREVIEW_URL` to the page being checked. Local development uses port 48632.
