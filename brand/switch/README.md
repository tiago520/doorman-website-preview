# Doorman Switch identity system

The owner selected Switch and all three colorways. This bundle preserves the chosen two-gate geometry. Its playground demonstrates the approved states and motion. All six states are also implemented in isolated native preview PR #4; main and released apps are unchanged.

## Use
Serve this directory with any static host. All paths are relative. Open index.html for the animated playground; state-mapping.html explains the relationship to actual native app states.

Core assets: assets/switch-icon.svg (ink), assets/switch-white.svg (reverse), assets/favicon.svg (light/dark adaptive), assets/switch-wordmark.svg and switch-wordmark-white.svg (outlined, no font needed), and the three switch-app*.svg colorways.

State masters: assets/switch-STATE-SIZE.svg, where STATE is protected, reconnecting, paused, attention, managed, or signedOut; SIZE is 16, 24, or 32. Static exports work without scripts. switch-state.css applies the demonstration motion to classed paths in the HTML.

Native reference timings: protected settle 0.6 seconds once; reconnect wave 1.5 seconds; attention pulse 1.8 seconds. The other states remain still. OS reduced motion always disables animation. Motion on/off is separately available in the preview. Browser favicon and app icons are neutral; they do not assert gateway health.

The six-state native reference is Sources/DoormanMenuBar/Glyph.swift, App.swift and Sources/DoormanModel/Model.swift in doorman-mac. The selected brand and six state treatments are implemented in native preview PR #4 (https://github.com/DoormanAI/doorman-mac/pull/4), source ebad20b2616de26ce8ee38e95ebdd5d066a1c907; this is not a released app. The menu bars are identity applications, not product screenshots.

Verification: Playwright at 1440 and 390, keyboard selection of all six states, one pressed state at a time, matching inspector/menu previews, neutral browser tab, animation on/off, reduced-motion behavior, exact 16/24/48 sizes, no overflow/broken images/browser errors, and zero axe WCAG AA violations on both pages. Results: verification.json.

Fonts: the shared local Inter variable subsets used by the website and console; SIL Open Font License in fonts/OFL.txt. SVG wordmarks use outlines. No analytics or external requests.

Actual macOS captures: https://tiago520.github.io/doorman-website-preview/next/macos.html. These are native preview views rendered at 2× with development fixtures, not customer activity or proof of live routing. See DESIGN.md for implementation and verification limits.
