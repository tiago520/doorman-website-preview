// Export the editable HTML mockups as 2x PNGs and a portable PDF review deck.
// Supply PLAYWRIGHT_MODULE if Playwright is installed outside this directory.
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "exports");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce"
});
const errors = [];
page.on("pageerror", e => errors.push(e.message));
const exports = [];
const states = [
  "protected",
  "reconnecting",
  "paused",
  "attention",
  "managed",
  "signedOut"
];

async function open(view, appearance, query = {}) {
  const url = pathToFileURL(path.join(root, "index.html"));
  url.search = new URLSearchParams({ appearance, ...query }).toString();
  url.hash = view;
  await page.goto(url.href, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(img => img.decode()));
  });
}
async function capture(name, selector, decorate) {
  if (decorate) {
    await page.evaluate(
      ({ selector, title }) => {
        const original = document.querySelector(selector);
        const width = original.getBoundingClientRect().width;
        const clone = original.cloneNode(true);
        const appearance = document.querySelector("#preview").dataset
          .appearance;
        const symbol = document.querySelector(".brand-lockup svg").outerHTML;
        const board = document.createElement("section");
        board.className = "export-board";
        board.style.width = `${Math.max(480, width + 112)}px`;
        board.innerHTML = `<header class="export-header">${symbol}<strong>doorman</strong><span>for macOS</span></header><div class="export-title"><h1>${title}</h1><span>${
          appearance === "dark" ? "Dark" : "Light"
        } appearance · ${Math.round(
          width
        )} pt</span></div><div class="preview export-stage" data-appearance="${appearance}"></div><footer class="export-footer">Design mockup · Example data<span>Switch / Concept 01</span></footer>`;
        const stage = board.querySelector(".export-stage");
        clone.style.width = `${width}px`;
        stage.append(clone);
        document.body.replaceChildren(board);
        const style = document.createElement("style");
        style.textContent = `body{background:#fff}.export-board{margin:0}.export-header{height:54px;padding:0 26px;background:var(--yellow);display:flex;align-items:center;gap:7px}.export-header svg{width:23px;height:23px}.export-header strong{font-size:19px;font-weight:800;letter-spacing:-.6px}.export-header span{margin-left:auto;font-size:10px}.export-title{padding:26px 28px 23px;display:flex;flex-direction:column;gap:8px}.export-title h1{font-size:25px;line-height:1.15;letter-spacing:-.8px;max-width:none}.export-title>span{color:var(--muted);font-size:10px}.export-stage{display:flex;align-items:flex-start;justify-content:center;padding:44px 56px 48px;min-height:0;border-radius:0;overflow:visible}.export-stage>.window{margin:0;position:relative;left:auto;top:auto;max-width:none}.export-stage>.popover:before{display:none}.export-footer{padding:18px 24px;display:flex;justify-content:space-between;font-size:9px;color:var(--muted)}`;
        document.head.append(style);
      },
      { selector, title: decorate }
    );
    selector = ".export-board";
  }
  const file = path.join(output, `${name}@2x.png`);
  const box = await page.locator(selector).boundingBox();
  await page
    .locator(selector)
    .screenshot({ path: file, animations: "disabled" });
  exports.push({
    file: path.basename(file),
    logicalWidth: Math.round(box.width),
    logicalHeight: Math.round(box.height),
    scale: 2
  });
  console.log(path.basename(file));
}
try {
  for (const appearance of ["light", "dark"]) {
    await open("overview", appearance);
    await capture(`overview-${appearance}`, "#preview");
    await open("states", appearance);
    await capture(`states-${appearance}`, "#preview");
    for (const state of states) {
      await open("menubar", appearance, { state });
      await capture(
        `menubar-${state}-${appearance}`,
        ".popover",
        `Menu bar · ${
          {
            protected: "Protected",
            reconnecting: "Reconnecting",
            paused: "Paused",
            attention: "Needs attention",
            managed: "Managed",
            signedOut: "Signed out"
          }[state]
        }`
      );
    }
    for (let step = 0; step < 3; step++) {
      await open("setup", appearance, { step: String(step) });
      await capture(
        `setup-${step + 1}-${appearance}`,
        ".setup-window",
        `First run · ${["Sign in", "Allow", "Done"][step]}`
      );
    }
    for (const panel of ["settings", "apps", "doctor"]) {
      await open("settings", appearance, { panel });
      await capture(
        `${panel}-${appearance}`,
        ".window",
        {
          settings: "Settings",
          apps: "AI apps on this Mac",
          doctor: "Check this Mac"
        }[panel]
      );
    }
  }

  const pages = [
    {
      title: "Your AI. At home on Mac.",
      sub:
        "The approved Switch identity, translated into a focused macOS companion.",
      images: ["overview-light"]
    },
    {
      title: "Just as clear after dark.",
      sub:
        "A proposed dark appearance. The identity and state meanings stay the same.",
      images: ["overview-dark"]
    },
    {
      title: "One popover. Six honest states.",
      sub:
        "A connection label, a useful next action, and a shape cue that works without motion.",
      images: ["states-light"]
    },
    {
      title: "Six states. In the dark, too.",
      sub:
        "Neutral healthy states, distinct pause and managed marks, and amber only for attention.",
      images: ["states-dark"]
    },
    {
      title: "Three steps. A clear next action.",
      sub:
        "Sign in with your browser, approve the connection, and find Doorman in the menu bar.",
      images: ["setup-1-light", "setup-2-light", "setup-3-light"]
    },
    {
      title: "A warm welcome, in dark mode.",
      sub: "The same first-run flow, with a proposed native dark palette.",
      images: ["setup-1-dark", "setup-2-dark", "setup-3-dark"]
    },
    {
      title: "Small windows. Useful controls.",
      sub: "Focused preferences and an honest account of app coverage.",
      images: ["settings-light", "apps-light"]
    },
    {
      title: "Familiar choices, in either appearance.",
      sub:
        "Routing, launch at login, gateway settings, and supported app connections.",
      images: ["settings-dark", "apps-dark"]
    },
    {
      title: "Know what needs you.",
      sub:
        "Connection checks show confirmed results and leave untested coverage visibly pending.",
      images: ["doctor-light", "doctor-dark"]
    }
  ];
  const font = (
    await readFile(path.join(root, "assets/inter-latin-variable.woff2"))
  ).toString("base64");
  const symbol =
    '<svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor"><path d="M5 5h16v6H11v9H5V5Z"/><path d="M27 27H11v-6h10v-9h6v15Z"/></svg>';
  const body = [];
  for (const [index, slide] of pages.entries()) {
    const images = await Promise.all(
      slide.images.map(
        async name =>
          `<div class="figure"><img alt="${name}" src="data:image/png;base64,${(
            await readFile(path.join(output, `${name}@2x.png`))
          ).toString("base64")}"></div>`
      )
    );
    body.push(
      `<section class="page"><header>${symbol}<b>doorman</b><span>macOS / Design study</span></header><main><h1>${
        slide.title
      }</h1><p>${slide.sub}</p><div class="images">${images.join(
        ""
      )}</div></main><footer><span>Design mockups · Example data · September 2026</span><span>Switch / Concept 01 &nbsp;&nbsp; ${String(
        index + 1
      ).padStart(2, "0")}</span></footer></section>`
    );
  }
  await page.setContent(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Doorman for macOS — Switch mockups</title><style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}*{box-sizing:border-box}html,body{margin:0;background:#fff;color:#18201b;font-family:Inter,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{width:1440px;height:1260px;display:flex;flex-direction:column;break-after:page;overflow:hidden}.page:last-child{break-after:auto}header{height:64px;flex-shrink:0;background:#ffe600;display:flex;align-items:center;gap:8px;padding:0 48px}header b{font-size:23px;font-weight:800;letter-spacing:-.7px}header span{margin-left:auto;font-size:12px}main{max-width:none;padding:36px 48px 20px;display:flex;flex-direction:column;flex:1;min-height:0;margin:0}h1{font-size:39px;line-height:1.12;letter-spacing:-1.5px;font-weight:700;margin:0}p{margin:12px 0 0;font-size:14px;line-height:1.5;color:#69746c}.images{display:flex;justify-content:center;align-items:center;gap:24px;flex:1;min-height:0;margin-top:28px}.figure{flex:1;height:100%;min-width:0;display:flex;align-items:center;justify-content:center}.figure img{display:block;max-width:100%;max-height:100%;object-fit:contain}footer{height:52px;flex-shrink:0;margin:0 48px;border-top:1px solid rgba(24,32,27,.11);display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#69746c}@page{size:1440px 1260px;margin:0}</style></head><body>${body.join(
      ""
    )}</body></html>`,
    { waitUntil: "load" }
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode()));
  });
  await page.pdf({
    path: path.join(output, "doorman-macos-mockups.pdf"),
    width: "1440px",
    height: "1260px",
    printBackground: true,
    preferCSSPageSize: true
  });
  console.log("doorman-macos-mockups.pdf");

  const assetHashes = {};
  for (const file of [
    "switch-app.svg",
    "brand-guide.md",
    "state-mapping.json",
    "inter-latin-variable.woff2"
  ]) {
    assetHashes[file] = createHash("sha256")
      .update(await readFile(path.join(root, "assets", file)))
      .digest("hex");
  }
  await writeFile(
    path.join(output, "provenance.json"),
    JSON.stringify(
      {
        kind: "HTML design mockups, not native captures",
        generatedAt: new Date().toISOString(),
        browser: await browser.version(),
        platform: process.platform,
        font: "Native SF first; Inter Latin variable rendered on Linux",
        scale: 2,
        nativeReferenceCommit: "f9011431294746e3ae68cf5e809d376e3eb2a55d",
        websitePreviewCommit: "164d0f04f6b39fadb90607625752cca2451c85f6",
        brandGuide:
          "https://tiago520.github.io/doorman-website-preview/assets/brand/switch/DESIGN.md",
        assetHashes,
        exports,
        pdfPages: pages.length,
        browserErrors: errors
      },
      null,
      2
    ) + "\n"
  );
  if (errors.length) throw new Error(errors.join("\n"));
} finally {
  await browser.close();
}
