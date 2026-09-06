/* Presentation-only prototype. All data is a local fixture; no app/helper calls. */
"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const params = new URLSearchParams(location.search);
const validViews = ["overview", "menubar", "setup", "settings", "states"];
const stateNames = {
  protected: "Protected",
  reconnecting: "Reconnecting",
  paused: "Paused",
  attention: "Needs attention",
  managed: "Managed",
  signedOut: "Signed out"
};
const model = {
  view: validViews.includes(location.hash.slice(1))
    ? location.hash.slice(1)
    : "overview",
  appearance: params.get("appearance") === "dark" ? "dark" : "light",
  state: Object.hasOwn(stateNames, params.get("state"))
    ? params.get("state")
    : "protected",
  step: Math.max(0, Math.min(2, Number(params.get("step")) || 0)),
  panel: ["settings", "apps", "doctor"].includes(params.get("panel"))
    ? params.get("panel")
    : "settings",
  mode: "route",
  login: true,
  gateway: "dmgw.io",
  motion: false,
  menu: false
};
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const paths = {
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  external: '<path d="M7 17 17 7M7 7h10v10"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>',
  circle: '<circle cx="12" cy="12" r="8"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  warning: '<path d="m12 3 10 17H2L12 3Z"/><path d="M12 9v4M12 16v.1"/>',
  dots:
    '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  settings:
    '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--ui-paper)"/><circle cx="15" cy="17" r="3" fill="var(--ui-paper)"/>',
  apps:
    '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  wifi:
    '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="20" r=".8" fill="currentColor"/>',
  battery:
    '<rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/><rect x="5" y="9" width="12" height="6" rx=".5" fill="currentColor" stroke="none"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  shield:
    '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  key:
    '<circle cx="8" cy="10" r="5"/><path d="m12 14 8 8M15 17l3-3M18 20l3-3"/>',
  monitor:
    '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4M8 21h8"/>'
};
function icon(name, size = 16, className = "") {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[
    name
  ] || paths.circle}</svg>`;
}
function switchMark(state = "protected", className = "") {
  let cue = "";
  if (state === "paused")
    cue = '<path class="state-cue" d="M13 13h2v6h-2zM17 13h2v6h-2z"/>';
  if (state === "managed")
    cue = '<path class="state-cue" d="M10 15h12v2H10z"/>';
  if (state === "attention")
    cue = '<path class="attention-cue" d="M25 4h3v5h-3zM25 10h3v3h-3z"/>';
  return `<svg class="switch ${className}" data-state="${state}" viewBox="0 0 32 32" aria-hidden="true"><path class="gate gate-a" d="M5 5h16v6H11v9H5V5Z"/><path class="gate gate-b" d="M27 27H11v-6h10v-9h6v15Z"/>${cue}</svg>`;
}
function appIcon(size = 38) {
  return `<img class="app-icon" src="assets/switch-app.svg" width="${size}" height="${size}" alt="Doorman">`;
}
function button(label, action, style = "", glyph = "", extra = "") {
  return `<button class="native-button ${style}" data-action="${action}" ${extra}>${
    glyph ? icon(glyph, 13) : ""
  }${label}</button>`;
}
function link(label, action, glyph = "") {
  return `<button class="native-link" data-action="${action}">${label}${
    glyph ? icon(glyph, 12) : ""
  }</button>`;
}
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
}
function titlebar(title) {
  return `<div class="window-bar"><div class="traffic-lights" aria-hidden="true"><i></i><i></i><i></i></div>${title}</div>`;
}
function menuBar() {
  return `<div class="mac-menu"><svg class="apple-symbol" viewBox="0 0 20 24" fill="currentColor" aria-hidden="true"><path d="M13.6 4.3c.9-1 1.5-2.4 1.4-3.8-1.4.1-3 .9-3.9 2-.8.9-1.5 2.3-1.3 3.6 1.4.1 2.9-.7 3.8-1.8ZM17.3 12.8c0-2.7 2.2-4 2.3-4.1-1.3-1.9-3.3-2.2-4-2.2-1.7-.2-3.4 1-4.2 1-.9 0-2.2-1-3.6-.9-1.9 0-3.7 1.1-4.7 2.8-2 3.5-.5 8.7 1.5 11.5 1 1.4 2.1 2.9 3.6 2.8 1.5-.1 2-1 3.8-1s2.3 1 3.8 1c1.6-.1 2.6-1.4 3.5-2.8 1.1-1.6 1.6-3.2 1.6-3.3-.1 0-3.6-1.4-3.6-4.8Z" transform="translate(-1.5 0) scale(.9)"/></svg><span class="finder">Finder</span><span class="finder-menu-item">File</span><span class="mac-menu-edit">Edit</span><span class="finder-menu-item">View</span><span class="finder-menu-item">Go</span><span class="finder-menu-item">Window</span><span class="finder-menu-item">Help</span><span class="spacer"></span><div class="system-icons"><button class="tray-button" data-action="tray" aria-label="Open Doorman menu bar mockup">${switchMark(
    model.state
  )}</button>${icon("wifi", 14)}${icon("battery", 20, "battery")}${icon(
    "search",
    13
  )}</div><time>Sat 5 Sep&nbsp; 9:41</time></div>`;
}
function stamp() {
  return `<div class="desktop-stamp"><span>Design mockup · Example data</span><span class="stamp-brand">${switchMark()} Doorman for macOS</span></div>`;
}

const copy = {
  protected: {
    title: "Protected",
    summary: "Claude Code, Codex and local Code sessions are governed.",
    primary: "View apps",
    action: "apps"
  },
  reconnecting: {
    title: "Reconnecting",
    summary:
      "Waiting for the gateway to respond. We’ll update this status when it does.",
    primary: "View apps",
    action: "apps"
  },
  paused: {
    title: "Paused",
    summary: "Resumes in 58 minutes. Traffic is passing through untouched.",
    primary: "Resume routing",
    action: "resume"
  },
  attention: {
    title: "Needs attention",
    summary: "The certificate isn’t trusted. Some apps may bypass routing.",
    primary: "Fix connection",
    action: "fix"
  },
  managed: {
    title: "Protected",
    summary: "Your organization manages routing on this Mac.",
    primary: "View apps",
    action: "apps"
  },
  signedOut: {
    title: "Not signed in",
    summary:
      "Connect your account to get started. Nothing on your Mac has changed.",
    primary: "Sign in to Doorman",
    action: "signin"
  }
};
const stateNotes = {
  protected: ["Settled and still", "One 0.6 s entrance, then no movement."],
  reconnecting: [
    "A connection is pending",
    "A soft 1.5 s wave. Protection is not inferred."
  ],
  paused: ["Your choice is visible", "Dimmed gates and pause bars. Static."],
  attention: [
    "A useful next step",
    "Amber gate, persistent marker, 1.8 s pulse."
  ],
  managed: [
    "Clear ownership",
    "A central gate bar. The team controls routing."
  ],
  signedOut: [
    "Present, but inactive",
    "Outlined gates. A clear invitation to sign in."
  ]
};
function receipt(state = "protected") {
  const managed = state === "managed";
  return `<div class="receipt"><div class="receipt-caption"><span>Last request</span><span>${
    state === "paused" ? "1 h ago" : managed ? "4 min ago" : "2 min ago"
  }</span></div><div class="receipt-app"><span class="app-tile">${
    managed ? "Cx" : "CC"
  }</span><span class="receipt-app-name">${
    managed ? "Codex CLI" : "Claude Code"
  }</span><span class="receipt-result">${
    managed ? "$0.09" : "$0.14"
  } saved</span></div><div class="receipt-route"><s>${
    managed ? "GPT-5.2" : "Sonnet 4.5"
  }</s>${icon("arrow", 12)}<span>${
    managed ? "GPT-5.2 mini" : "Gemini 3 Flash"
  }</span></div></div>`;
}
function healthCard() {
  return `<div class="health-card native-card"><div class="health-row">${icon(
    "checkCircle",
    14
  )}<span>Local proxy</span><span class="health-state">Ready</span></div><div class="health-row attention">${icon(
    "warning",
    14
  )}<span>Certificate</span><span class="health-state">Not trusted</span></div><div class="health-row">${icon(
    "checkCircle",
    14
  )}<span>Gateway</span><span class="health-state">Reachable</span></div></div>`;
}
function popover(state = model.state, library = false) {
  const c = copy[state];
  const showSavings = !["attention", "signedOut"].includes(state);
  return `<article class="popover" aria-label="${
    stateNames[state]
  } menu bar mockup" data-popover-state="${state}">
    <div class="pop-brand">${appIcon(
      23
    )}<span class="wordmark">doorman</span><span class="pop-context">${
    state === "managed" ? "Acme IT" : "This Mac"
  }</span></div>
    <div class="status-block ${
      state === "attention" ? "is-attention" : ""
    }"><div class="status-symbol">${switchMark(
    state
  )}</div><div class="status-copy"><div class="status-line"><h2>${
    c.title
  }</h2>${
    state === "managed" ? '<span class="status-chip">Managed</span>' : ""
  }</div><p>${c.summary}</p></div></div>
    ${
      state === "attention"
        ? healthCard()
        : state === "signedOut"
        ? `<div class="empty-receipt">${icon(
            "monitor",
            22
          )}<div><strong>Your tools, connected.</strong>See activity from supported AI apps.</div></div>`
        : receipt(state)
    }
    ${
      showSavings
        ? `<div class="savings-row"><span>Saved today</span><strong>${
            state === "managed" ? "$31.06" : "$18.42"
          }</strong></div>`
        : ""
    }
    ${
      state === "paused"
        ? `<div class="paused-note">${icon(
            "clock",
            12
          )}Savings recorded before you paused.</div>`
        : ""
    }
    <div class="pop-actions">${button(
      c.primary,
      c.action,
      ["paused", "attention", "signedOut"].includes(state) ? "primary" : "",
      c.action === "apps" ? "apps" : ""
    )}${
    ["protected", "reconnecting"].includes(state)
      ? button("Pause", "pause", "small", "pause")
      : state === "attention"
      ? button("Details", "doctor", "small")
      : ""
  }</div>
    <div class="pop-footer">${link(
      "Open dashboard",
      "dashboard",
      "external"
    )}<button class="icon-button" data-action="more" aria-label="More Doorman options" aria-expanded="${!library &&
    model.menu}">${icon("dots", 16)}</button>${
    !library && model.menu
      ? `<div class="context-menu" aria-label="Doorman options">${link(
          "Settings…",
          "settings"
        )}<div class="divider"></div>${link("Check this Mac", "doctor")}${link(
          "Sign out…",
          "signout"
        )}</div>`
      : ""
  }</div>
  </article>`;
}

const apps = [
  {
    name: "Claude Code",
    initial: "CC",
    detail: "Subscription routed through Doorman",
    status: "Governed",
    kind: "governed",
    method: "Direct"
  },
  {
    name: "Codex",
    initial: "Cx",
    detail: "ChatGPT sign-in preserved",
    status: "Governed",
    kind: "governed",
    method: "Direct"
  },
  {
    name: "Claude Desktop",
    surface: "Code",
    initial: "Cl",
    detail: "Local Code sessions",
    status: "Governed",
    kind: "governed",
    method: "Direct"
  },
  {
    name: "Claude Desktop",
    surface: "Chat",
    initial: "Cl",
    detail: "Traffic seen; content stays encrypted",
    status: "Observed",
    kind: "observed",
    method: "Network"
  },
  {
    name: "ChatGPT Desktop",
    initial: "G",
    detail: "Connection observed",
    status: "Opaque",
    kind: "opaque",
    method: "Network"
  },
  {
    name: "ChatGPT",
    surface: "Web",
    initial: "G",
    detail: "Compatibility check available",
    status: "Setup available",
    kind: "setup",
    method: "Deep"
  },
  {
    name: "Claude",
    surface: "Web",
    initial: "Cl",
    detail: "Compatibility check available",
    status: "Setup available",
    kind: "setup",
    method: "Deep"
  }
];
function appsWindow(extraClass = "") {
  const detected = apps.length;
  const governed = apps.filter(a => a.kind === "governed").length;
  const observed = apps.filter(a => ["observed", "opaque"].includes(a.kind))
    .length;
  return `<article class="window apps-window ${extraClass}" aria-label="AI apps on this Mac mockup">${titlebar(
    "Doorman"
  )}<div class="window-body"><div class="window-heading">${appIcon(
    34
  )}<div><h2>AI apps on this Mac</h2><p>A clear view of what Doorman can govern.</p></div><div class="heading-actions">${button(
    "Check this Mac",
    "doctor",
    "small"
  )}</div></div><div class="metric-row"><div class="metric"><strong>${detected}</strong><span>Detected</span></div><div class="metric"><strong>${governed}</strong><span>Governed</span></div><div class="metric"><strong>${observed}</strong><span>Observed</span></div></div><div class="native-card app-list">${apps
    .map(
      a =>
        `<div class="app-row"><span class="app-tile">${
          a.initial
        }</span><div class="app-description"><div class="app-name">${a.name}${
          a.surface ? `<span class="surface">${a.surface}</span>` : ""
        }</div><p>${
          a.detail
        }</p></div><div class="app-coverage"><span class="coverage-label ${
          a.kind
        }">${icon(
          a.kind === "governed"
            ? "checkCircle"
            : a.kind === "setup"
            ? "clock"
            : "circle",
          12
        )}${a.status}</span><span class="coverage-method">${
          a.method
        }</span></div></div>`
    )
    .join(
      ""
    )}</div><div class="apps-footer"><p>Observed includes encrypted connections. Seeing traffic doesn’t mean Doorman can govern its content.</p>${link(
    "How coverage works",
    "coverage",
    "external"
  )}</div></div></article>`;
}
function stepIndicator() {
  return `<div class="steps" aria-label="Step ${model.step + 1} of 3">${[
    "Sign in",
    "Allow",
    "Done"
  ]
    .map(
      (name, i) =>
        `${i ? '<span class="step-line"></span>' : ""}<div class="step ${
          i === model.step ? "active" : i < model.step ? "done" : ""
        }"><span class="step-num">${
          i < model.step ? icon("check", 10) : i + 1
        }</span><span>${name}</span></div>`
    )
    .join("")}</div>`;
}
function lamp(label, desc, state = "ok", trail = "") {
  return `<div class="setup-lamp"><span class="lamp-icon ${state}">${icon(
    state === "ok" ? "check" : state === "attention" ? "key" : "circle",
    12
  )}</span><div><strong>${label}</strong><p>${desc}</p></div>${
    trail ? `<span class="lamp-trailing ${state}">${trail}</span>` : ""
  }</div>`;
}
function setupWindow() {
  const contents = [
    `<div class="setup-heading"><h2>Sign in. Make yourself<br>at home.</h2><p>Link this Mac to your Doorman account. Enter this code in your browser to continue.</p></div><div class="code-card native-card"><span class="code-label">Your one-time code</span><div class="device-code">HK7·4P2Q</div><div class="code-meta">${icon(
      "clock",
      12
    )}Waiting for your browser</div></div><div class="setup-bottom">${link(
      "How privacy works",
      "privacy"
    )}${button("Continue in browser", "browser", "primary", "external")}</div>`,
    `<div class="setup-heading"><h2>Connect your AI tools.</h2><p>Allow Doorman to route supported AI traffic. macOS will ask for your password to approve the changes.</p></div><div class="setup-lamps native-card">${lamp(
      "Background helper",
      "Runs quietly on this Mac.",
      "ok",
      "Installed"
    )}${lamp(
      "Certificate trust",
      "Approve in the macOS prompt.",
      "attention",
      "Needs you"
    )}${lamp(
      "Verify the connection",
      "A test checks that routing works.",
      "wait",
      "Next"
    )}</div><div class="setup-bottom">${link(
      "What changes on my Mac?",
      "changes"
    )}${button("Allow & continue", "allow", "primary")}</div>`,
    `<div class="setup-heading"><h2>You’re protected.<br>Keep doing your thing.</h2><p>Supported AI apps are ready. Find Doorman in your menu bar whenever you want to check in.</p></div><div class="ready-menu" aria-label="Doorman lives in the menu bar"><span class="selected">${switchMark()}</span>${icon(
      "wifi",
      14
    )}${icon(
      "battery",
      19
    )}<span>9:41</span></div><div class="empty-receipt">${icon(
      "clock",
      20
    )}<div><strong>Ready for your first request</strong>Your latest activity will appear here.</div></div><div class="setup-bottom">${link(
      "View supported apps",
      "apps"
    )}${button("Open Doorman", "done", "primary")}</div>`
  ];
  return `<article class="window center-window setup-window" aria-label="First run ${
    ["sign in", "allow", "done"][model.step]
  } mockup">${titlebar(
    "Welcome to Doorman"
  )}<div class="window-body"><div class="setup-top">${appIcon(
    46
  )}${stepIndicator()}</div>${contents[model.step]}</div></article>`;
}
function setting(label, hint, control) {
  return `<div class="setting-row"><div class="setting-label"><strong>${label}</strong>${
    hint ? `<p>${hint}</p>` : ""
  }</div>${control}</div>`;
}
function settingsWindow() {
  return `<article class="window center-window settings-window" aria-label="Doorman settings mockup">${titlebar(
    "Settings"
  )}<div class="window-body"><div class="window-heading">${appIcon(
    39
  )}<div><h2>Doorman</h2><p>Settings for this Mac.</p></div></div><p class="settings-group-label">General</p><div class="native-card">${setting(
    "Routing",
    model.mode === "route"
      ? "Route eligible requests to suitable models."
      : "Measure activity without switching models.",
    `<div class="segmented" role="group" aria-label="Routing mode"><button data-action="route" aria-pressed="${model.mode ===
      "route"}">Route</button><button data-action="observe" aria-pressed="${model.mode ===
      "observe"}">Observe</button></div>`
  )}${setting(
    "Launch at login",
    "Keep Doorman ready when you sign in.",
    `<button class="toggle" data-action="login" role="switch" aria-checked="${model.login}" aria-label="Launch at login"><span></span></button>`
  )}${setting(
    "AI apps",
    "7 detected · 3 governed",
    link("View apps", "apps", "chevron")
  )}${setting(
    "Gateway",
    `<span class="mono">${escapeHTML(model.gateway)}</span>`,
    button("Change…", "gateway", "small")
  )}</div><p class="settings-group-label">Account</p><div class="native-card account-row"><span class="account-avatar">TI</span><div><strong>Tiago</strong><p>tiago@example.com · Free</p></div>${button(
    "Sign out",
    "signout",
    "small"
  )}</div><div class="settings-footer"><span>Version 0.5.0-dev</span>${link(
    "Uninstall Doorman…",
    "uninstall"
  )}</div></div></article>`;
}
function doctorChecks() {
  const attention = model.state === "attention";
  return `<div class="native-card doctor-checks">${lamp(
    "Explicit routing",
    "Claude Code and Codex",
    "ok",
    "Ready"
  )}${lamp(
    "Certificate trust",
    attention ? "Not trusted by this Mac" : "Trusted by this Mac",
    attention ? "attention" : "ok",
    attention ? "Needs you" : "Ready"
  )}${lamp(
    "Network visibility",
    "Extension can be enabled safely",
    "ok",
    "Ready"
  )}${lamp(
    "Deep browser tracking",
    "ChatGPT and Claude web",
    "wait",
    "Not tested"
  )}${lamp(
    "Existing networks",
    "Tailscale detected · compatible",
    "ok",
    "Ready"
  )}</div>`;
}
function doctorWindow() {
  return `<article class="window center-window doctor-window" aria-label="Check this Mac mockup">${titlebar(
    "Doorman"
  )}<div class="window-body"><div class="window-heading">${appIcon(
    38
  )}<div><h2>Check this Mac</h2><p>Connection and compatibility checks.</p></div></div><div class="doctor-summary">${icon(
    model.state === "attention" ? "warning" : "checkCircle",
    24
  )}<div><strong>${
    model.state === "attention"
      ? "One thing needs you."
      : "Your connection checks passed."
  }</strong><p>Browser tracking hasn’t been tested. Nothing changed.</p></div></div>${doctorChecks()}<div class="doctor-footer">${button(
    "Run again",
    "runchecks"
  )}${button("Done", "apps", "primary")}</div></div></article>`;
}
function overview() {
  return `${menuBar()}<div class="desktop-content">${appsWindow(
    "compact overview-apps"
  )}<div class="overview-pop">${popover()}</div><div class="overview-copy"><p class="note-index">A small app. A clear view.</p><h3>Right there.<br>When you need it.</h3><p>Check your connection, see the last request, and get back to work.</p>${link(
    "Explore the menu bar",
    "menubar",
    "arrow"
  )}</div></div>${stamp()}`;
}
function menubar() {
  return `${menuBar()}<div class="desktop-content"><div class="menubar-note"><div><h2>A glance.<br>Then back to work.</h2><p>Connection first. One recent request. Savings in context. A useful action when something needs you.</p></div><div class="state-specimen">${switchMark(
    model.state
  )}<div><span>${stateNotes[model.state][0]}</span><small>${
    stateNotes[model.state][1]
  }</small></div></div></div><div class="single-pop">${popover()}</div></div>${stamp()}`;
}
function stateLibrary() {
  return `<div class="library">${Object.keys(stateNames)
    .map(
      (state, i) =>
        `<section class="library-item"><header><span>0${i + 1} &nbsp; ${
          stateNames[state]
        }</span><small>${
          state === "protected"
            ? "0.6 s · once"
            : state === "reconnecting"
            ? "1.5 s · wave"
            : state === "attention"
            ? "1.8 s · pulse"
            : "Static"
        }</small></header>${popover(state, true)}<p class="library-note">${
          stateNotes[state][1]
        }</p></section>`
    )
    .join("")}</div>`;
}
const captions = {
  overview: [
    "The whole app, in two small surfaces.",
    "A menu bar companion and a focused view of app coverage.",
    "Proposed UI · 352 pt popover · 578 pt coverage window"
  ],
  menubar: [
    "One popover. Six honest states.",
    "Use the state controls above, or try Pause, Resume, and Fix connection.",
    "Existing helper states and sample receipts. Savings are historical while paused."
  ],
  setup: [
    "Three steps, with a clear next action.",
    "Sign in, approve the connection, and find Doorman in the menu bar.",
    "520 pt window · Browser and macOS approvals are simulated."
  ],
  settings: [
    "Native controls. Familiar choices.",
    "Try Route / Observe, launch at login, app coverage, and connection checks.",
    "Local preview only · Changes reset when the page reloads."
  ],
  states: [
    "The mark keeps its meaning.",
    "Labels and shape cues remain readable with motion off and in both appearances.",
    "Yellow is the brand. Amber is attention. Dark mode is a proposed extension."
  ]
};
function renderOptions() {
  let content = "";
  if (model.view === "menubar")
    content = `<div class="option-chips" role="group" aria-label="Connection state">${Object.entries(
      stateNames
    )
      .map(
        ([state, label]) =>
          `<button data-state="${state}" aria-pressed="${model.state ===
            state}">${label}</button>`
      )
      .join(
        ""
      )}</div><span class="options-hint">Try the controls inside the popover.</span>`;
  else if (model.view === "setup")
    content = `<div class="option-chips" role="group" aria-label="Setup step">${[
      "1 · Sign in",
      "2 · Allow",
      "3 · Done"
    ]
      .map(
        (label, i) =>
          `<button data-step="${i}" aria-pressed="${model.step ===
            i}">${label}</button>`
      )
      .join(
        ""
      )}</div><span class="options-hint">Click through the complete setup flow.</span>`;
  else if (model.view === "settings")
    content = `<div class="option-chips" role="group" aria-label="Settings surface">${[
      ["settings", "Settings"],
      ["apps", "AI apps on this Mac"],
      ["doctor", "Check this Mac"]
    ]
      .map(
        ([panel, label]) =>
          `<button data-panel="${panel}" aria-pressed="${model.panel ===
            panel}">${label}</button>`
      )
      .join(
        ""
      )}</div><span class="options-hint">Every change stays in this mockup.</span>`;
  else
    content = `<span class="options-hint">${
      model.view === "overview"
        ? "A native menu bar companion, built around the way you work."
        : "All six application states, using the approved Switch geometry."
    }</span><span class="options-hint">${
      model.appearance === "dark"
        ? "Dark appearance · Proposed palette extension"
        : "Light appearance · Website brand tokens"
    }</span>`;
  $("#view-options").innerHTML = content;
}
function render() {
  const active = document.activeElement;
  const focusKey = ["state", "step", "panel", "action"].find(
    k => active?.dataset[k]
  );
  const focusValue = focusKey ? active.dataset[focusKey] : null;
  const preview = $("#preview");
  preview.dataset.appearance = model.appearance;
  preview.dataset.view = model.view;
  preview.classList.toggle("library-preview", model.view === "states");
  preview.classList.toggle("motion-on", model.motion && !reduceMotion.matches);
  $("#detail-dialog").dataset.appearance = model.appearance;
  if (model.view === "overview") preview.innerHTML = overview();
  else if (model.view === "menubar") preview.innerHTML = menubar();
  else if (model.view === "setup")
    preview.innerHTML = `${menuBar()}<div class="desktop-content">${setupWindow()}</div>${stamp()}`;
  else if (model.view === "settings")
    preview.innerHTML = `${menuBar()}<div class="desktop-content">${
      model.panel === "settings"
        ? settingsWindow()
        : model.panel === "apps"
        ? appsWindow("center-window single-apps")
        : doctorWindow()
    }</div>${stamp()}`;
  else preview.innerHTML = stateLibrary();
  document.querySelectorAll("[data-view]").forEach(el => {
    if (el.tagName === "A") {
      if (el.dataset.view === model.view)
        el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    }
  });
  document
    .querySelectorAll("[data-theme]")
    .forEach(el =>
      el.setAttribute(
        "aria-pressed",
        String(el.dataset.theme === model.appearance)
      )
    );
  const motion = $("#motion-control");
  motion.textContent = reduceMotion.matches
    ? "Reduced motion"
    : model.motion
    ? "Motion on"
    : "Motion off";
  motion.setAttribute(
    "aria-pressed",
    String(model.motion && !reduceMotion.matches)
  );
  motion.disabled = reduceMotion.matches;
  renderOptions();
  const caption = captions[model.view];
  $(
    "#review-caption"
  ).innerHTML = `<div><strong>${caption[0]}</strong>${caption[1]}</div><div class="caption-right">${caption[2]}</div>`;
  alignPopover();
  if (focusKey && focusValue)
    document
      .querySelector(`[data-${focusKey}="${CSS.escape(focusValue)}"]`)
      ?.focus({ preventScroll: true });
}
function alignPopover() {
  const tray = $(".tray-button");
  if (!tray) return;
  const trayRect = tray.getBoundingClientRect();
  document
    .querySelectorAll(".overview-pop .popover,.single-pop .popover")
    .forEach(pop => {
      const box = pop.getBoundingClientRect();
      const offset = Math.max(
        15,
        Math.min(
          box.width - 28,
          box.right - (trayRect.left + trayRect.width / 2) - 6.5
        )
      );
      pop.style.setProperty("--pointer-right", `${offset}px`);
    });
}
function navigate(view) {
  model.menu = false;
  model.view = view;
  if (location.hash !== `#${view}`) location.hash = view;
  else render();
}
let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 3400);
}
function openDialog(title, content, actions, extra = "") {
  const dialog = $("#detail-dialog");
  $(
    "#dialog-content"
  ).innerHTML = `<div class="dialog-body"><div class="dialog-brand">${appIcon(
    27
  )}<span>Doorman · Interactive mockup</span></div><h2 id="dialog-title">${title}</h2>${content}${extra}<div class="dialog-actions">${actions}</div></div>`;
  if (!dialog.open) dialog.showModal();
}
function info(title, message) {
  openDialog(title, `<p>${message}</p>`, button("Done", "close", "primary"));
}
function closeDialog() {
  $("#detail-dialog").close();
}
let transitionTimer;
function transition(action, pendingLabel, after) {
  document.querySelectorAll(`[data-action="${action}"]`).forEach(b => {
    b.disabled = true;
    b.textContent = pendingLabel;
  });
  clearTimeout(transitionTimer);
  transitionTimer = setTimeout(after, 900);
}
function runAction(action, target) {
  const sourceState = target?.closest("[data-popover-state]")?.dataset
    .popoverState;
  if (sourceState) model.state = sourceState;
  if (action === "more") {
    if (model.view === "states") {
      model.state = target.closest("[data-popover-state]").dataset.popoverState;
      model.menu = false;
      navigate("menubar");
    } else {
      model.menu = !model.menu;
      render();
    }
    return;
  }
  if (action === "close") {
    closeDialog();
    return;
  }
  if (action === "menubar" || action === "tray") {
    navigate("menubar");
    return;
  }
  if (action === "apps") {
    model.panel = "apps";
    navigate("settings");
    return;
  }
  if (action === "settings") {
    model.panel = "settings";
    navigate("settings");
    return;
  }
  if (action === "pause") {
    model.state = "paused";
    navigate("menubar");
    return;
  }
  if (action === "resume") {
    model.state = "protected";
    navigate("menubar");
    return;
  }
  if (action === "signin") {
    model.step = 0;
    navigate("setup");
    return;
  }
  if (action === "done") {
    model.state = "protected";
    navigate("menubar");
    return;
  }
  if (action === "route" || action === "observe") {
    model.mode = action;
    render();
    return;
  }
  if (action === "login") {
    model.login = !model.login;
    render();
    return;
  }
  if (action === "doctor") {
    openDialog(
      "Check this Mac",
      `<p>${
        model.state === "attention"
          ? "One thing needs you: certificate trust."
          : "Routing checks passed. Browser tracking hasn’t been tested."
      } Nothing changed.</p>`,
      button("Run again", "runchecks") + button("Done", "close", "primary"),
      doctorChecks()
    );
    return;
  }
  if (action === "runchecks") {
    transition("runchecks", "Checking…", () => {
      if ($("#detail-dialog").open) runAction("doctor", target);
      else render();
      toast("Example checks complete. Nothing on your Mac changed.");
    });
    return;
  }
  if (action === "fix") {
    openDialog(
      "Trust the Doorman certificate",
      "<p>The macOS app would open a system approval prompt. This preview simulates a successful repair.</p>",
      button("Cancel", "close") +
        button("Simulate approval", "repair", "primary")
    );
    return;
  }
  if (action === "repair") {
    closeDialog();
    model.state = "reconnecting";
    navigate("menubar");
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      model.state = "protected";
      render();
      toast("Example connection restored.");
    }, 1500);
    return;
  }
  if (action === "browser") {
    openDialog(
      "Continue in your browser",
      '<p>In the app, your browser links this Mac to your account. The code for this example is <span class="mono">HK7·4P2Q</span>.</p>',
      button("Back", "close") +
        button("Simulate sign-in", "browser-complete", "primary")
    );
    return;
  }
  if (action === "browser-complete") {
    closeDialog();
    model.step = 1;
    render();
    return;
  }
  if (action === "allow") {
    openDialog(
      "Approve on your Mac",
      "<p>macOS would ask you to approve certificate trust. This mockup doesn’t request a password or change your system.</p>",
      button("Back", "close") +
        button("Simulate approval", "allow-complete", "primary")
    );
    return;
  }
  if (action === "allow-complete") {
    transition("allow-complete", "Verifying…", () => {
      closeDialog();
      model.step = 2;
      model.state = "protected";
      render();
    });
    return;
  }
  if (action === "gateway") {
    openDialog(
      "Change gateway",
      "<p>Choose the gateway this Mac connects to.</p>",
      button("Cancel", "close") +
        button("Save in preview", "save-gateway", "primary"),
      `<label class="dialog-field" for="gateway-input">Gateway hostname<input id="gateway-input" value="${escapeHTML(
        model.gateway
      )}" spellcheck="false" autocomplete="off" maxlength="253"></label><p id="gateway-error" class="dialog-error" role="alert"></p>`
    );
    return;
  }
  if (action === "save-gateway") {
    const value = $("#gateway-input").value.trim();
    if (
      !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(
        value
      )
    ) {
      $("#gateway-error").textContent = "Enter a hostname such as dmgw.io.";
      $("#gateway-input").focus();
      return;
    }
    model.gateway = value;
    closeDialog();
    render();
    toast("Gateway updated in the mockup.");
    return;
  }
  if (action === "signout") {
    openDialog(
      "Sign out of Doorman?",
      "<p>This switches the preview to the signed-out state.</p>",
      button("Cancel", "close") +
        button("Sign out of preview", "signout-complete", "primary")
    );
    return;
  }
  if (action === "signout-complete") {
    closeDialog();
    model.state = "signedOut";
    navigate("menubar");
    return;
  }
  if (action === "uninstall") {
    info(
      "Uninstall Doorman",
      "In the app, this starts the removal flow for the helper and its system changes. This mockup cannot uninstall anything."
    );
    return;
  }
  if (action === "dashboard") {
    openDialog(
      "Your dashboard lives on the web.",
      "<p>Keep the Mac app focused on this device. Explore detailed activity, routing, spend, and team controls in the website’s sample console.</p>",
      button("Back", "close") +
        '<a class="native-button primary" href="https://tiago520.github.io/doorman-website-preview/next/demo.html" target="_blank" rel="noreferrer">Explore web demo ' +
        icon("external", 12) +
        "</a>"
    );
    return;
  }
  if (action === "coverage") {
    info(
      "Coverage, explained.",
      "Governed apps use a supported routing connection. Observed and opaque connections are visible at the network level; their encrypted content is not governed. Setup available means a compatibility check is still needed."
    );
    return;
  }
  if (action === "privacy") {
    info(
      "Your tools. Your account.",
      "Browser sign-in links your Doorman account to this Mac. Coverage varies by app; the app list shows which connections are governed and which are only observed."
    );
    return;
  }
  if (action === "changes") {
    info(
      "What changes on your Mac?",
      "The app installs a background helper, requests certificate trust, and verifies a supported routing connection before enabling it. Only a real macOS approval can authorize system changes."
    );
    return;
  }
}
document.addEventListener("click", event => {
  const target = event.target.closest("button,a");
  if (!target) return;
  if (target.dataset.theme) {
    model.appearance = target.dataset.theme;
    render();
    return;
  }
  if (target.id === "motion-control") {
    model.motion = !model.motion;
    render();
    return;
  }
  if (target.dataset.state) {
    model.state = target.dataset.state;
    model.menu = false;
    render();
    return;
  }
  if (target.dataset.step) {
    model.step = Number(target.dataset.step);
    render();
    return;
  }
  if (target.dataset.panel) {
    model.panel = target.dataset.panel;
    render();
    return;
  }
  if (target.dataset.action) {
    event.preventDefault();
    runAction(target.dataset.action, target);
  }
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && model.menu) {
    model.menu = false;
    render();
  }
});
$("#detail-dialog").addEventListener("click", event => {
  if (event.target === $("#detail-dialog")) closeDialog();
});
window.addEventListener("hashchange", () => {
  const requested = location.hash.slice(1);
  model.view = validViews.includes(requested) ? requested : "overview";
  model.menu = false;
  render();
});
reduceMotion.addEventListener("change", render);
window.addEventListener("resize", alignPopover);
document.fonts.ready.then(alignPopover);
render();
