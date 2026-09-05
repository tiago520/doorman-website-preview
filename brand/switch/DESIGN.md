# Switch — the Doorman identity

**Owner decision, 5 September 2026: Switch is the only approved Doorman logo.**
Use it for all new website, console, native-app, documentation, social and browser
surfaces. Do not introduce a second mark, redraw the old tile/door logo, or turn a
status glyph into a separate brand. Historical comparison snapshots remain archives.

[Interactive identity guide](index.html) · [Public playground](https://tiago520.github.io/doorman-website-preview/brand/switch/) · [Download SVG kit](doorman-switch-kit.zip)

## The mark

![Switch in context, states and three app colors](switch-system@2x.png)

Switch is two interlocking right-angle gates on a `0 0 32 32` viewbox. Preserve the
square corners, proportions and negative space. Scale the complete SVG uniformly.
Do not round corners, skew, rotate, stretch, add a container to the core mark, or
add shadows/gradients inside it. Keep at least one stroke-width of clear space
around the visible symbol. Use the supplied app containers only for app icons.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor">
  <path d="M5 5h16v6H11v9H5V5Z"/>
  <path d="M27 27H11v-6h10v-9h6v15Z"/>
</svg>
```

Canonical files: [ink symbol](assets/switch-icon.svg), [white symbol](assets/switch-white.svg),
[ink wordmark](assets/switch-wordmark.svg), [white wordmark](assets/switch-wordmark-white.svg).
Wordmark SVGs contain outlines, so the brand rendering does not depend on a font.
In interface navigation the same symbol may sit beside lowercase **doorman**, in
Inter/SF at weight 800. Use a readable accessible link name; decorative SVGs are hidden
from assistive technology. The mark is recognizable at 16px; never shrink a tray or
favicon state below its provided 16px master.

## Three approved app treatments

![White, ink and yellow app icons](switch-colors@2x.png)

| Treatment | Field | Symbol | Asset |
|---|---|---|---|
| White | `#ffffff` | `#18201b` ink | [White app icon](assets/switch-app-white.svg) |
| Ink | `#18201b` | `#ffffff` white | [Ink app icon](assets/switch-app-ink.svg) |
| Yellow | `#ffe600` | `#18201b` ink | [Yellow app icon](assets/switch-app.svg) |

These are treatments of one identity. Yellow may be the app-icon field or marketing
header; it is never low-contrast body text. Keep website buttons and console surfaces
within their own documented tokens. In the console, saved-money yellow remains tied
to actual savings; it does not signal connection health.

## Menu bar states and motion

![Switch motion playground and menu bars](switch-playground@2x.png)

| State | Meaning | Presentation | Timing |
|---|---|---|---|
| Protected | Active connection state reported by the app | Gates settle, then remain still | 0.6s once on entry |
| Reconnecting | Connection restoration pending | Soft opacity wave across the gates | 1.5s cycle |
| Paused | Routing paused | Dim mark with pause bars | Static |
| Needs attention | Review required | Small marker and restrained amber pulse | 1.8s cycle |
| Managed | Team manages these settings | Bar through the central opening | Static |
| Signed out | Sign-in required | Outlined gates | Static |

Loading may share reconnecting motion only while setup/connection is actually pending;
it must retain an accurate text label. Do not imply a route is protected just because
a logo animates. State always comes from the actual application model, accompanied by
text and a shape cue. The favicon and Dock/app icons remain neutral brand marks.

`prefers-reduced-motion: reduce` disables all motion. Manual Motion off does the same;
all states remain distinguishable. Avoid perpetual rotation, bouncing or rapid flashing.
Use monochrome/template-compatible tray assets for macOS light/dark menu bars and
keep attention meaningful without relying on color. Inspect tiny states at actual size.

[Static state SVGs](https://tiago520.github.io/doorman-website-preview/next/branding.html#states) include all six states at 16, 24 and 32px. The playground
also shows core geometry at 16, 24, 48 and 160px. Reuse [switch-state.css](switch-state.css)
for the web demonstration; [state-mapping.json](state-mapping.json) records semantics.

## Browser tabs and typography

[Adaptive favicon](assets/favicon.svg) uses ink on a light browser and white on a dark
browser. It does not show live connection status or play animations. The website and
console use this favicon and the same two-gate inline mark.

The interface family is native San Francisco on Apple and genuine Inter weights
elsewhere. Regular copy stays regular; do not load only weight 800 and let the browser
substitute it into body text. Keep numerical columns tabular. SF Rounded may remain
for console numbers on Apple. Code/keys use the existing monospace stack. Headline
scale differs between marketing and an operational console; family and clarity agree.

## Implementation and proof

The website and independent console preview implement the selected brand. Native
menu bars here are **identity applications**, not captured native-app screenshots.
The new native state drawing is a proposal for implementation; this bundle does not
change Swift or Go behavior. State timings are based on native commit
`f9011431294746e3ae68cf5e809d376e3eb2a55d`, `Glyph.swift`, `App.swift`, and `Model.swift`.

[Verification results](verification.json): desktop/mobile keyboard selection, six
states, motion toggle, OS reduced motion, tiny sizes, neutral favicon, no overflow,
no broken images/browser errors, and zero axe AA issues. Fonts are licensed under
[SIL OFL](assets/OFL.txt). Future design work must reference this guide and these assets.
