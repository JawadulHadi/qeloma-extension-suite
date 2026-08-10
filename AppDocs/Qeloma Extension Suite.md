# Qeloma Extension Suite

Qeloma Shot (shot) — One-click viewport capture, region crop, and auto-scroll full-page screenshot stitching with canvas annotation.
Qeloma Focus (focus) — Domain blocker powered by Chrome declarativeNetRequest, Pomodoro timer, and session tracking.
Qeloma Night (night) — Zero-flicker dark mode engine with contrast controls, warm amber hue filters, and site whitelists.
Qeloma Clip → Lens (clip-lens) — Contextual page region capture connected directly to Gemini 2.5 Flash AI for streaming summaries and verdicts.
Qeloma Volume (volume) — Per-tab Web Audio GainNode booster (up to 600%), bass booster equalizer, and stereo balance controls.
Qeloma Timebox (timebox) — Visual hourly time-blocking grid with live countdown timers, task status toggles, and local storage persistence.
Qeloma Webtime (webtime) — Private browsing time tracker with per-site breakdown charts, idle state auto-pausing (chrome.idle), and zero telemetry.
Qeloma Inspect (inspect) — On-page SEO inspector rendering H1–H6 heading hierarchies, OpenGraph preview cards, and structured JSON-LD data.
Qeloma Reader (reader) — Distraction-free article reader stripping clutter into a clean typography view with font adjustments and Markdown export.
Qeloma Palette (palette) — Native EyeDropper pixel color sampler, page dominant color clusterer, and one-click CSS/Tailwind value generator.
✨ Additional Features Implemented
Shared Packages README Viewer: Parses local Markdown documentation for @qeloma/types, @qeloma/ui, @qeloma/utils, @qeloma/gemini, and @qeloma/storage.
Discord Webhook Integrator: Configures Discord channel endpoints and dispatches test alerts for CI/CD pipeline passes/fails.
Core Web Vitals & Telemetry: Tracks LCP, CLS, INP, FID, and TTFB alongside release build times and bundle sizes across all 10 extensions.
Real-Time GitHub Webhook Listener: Listens for workflow_run events and dynamically updates CI/CD status badges across the Suite Dashboard.
Social Media Card Previewer: OpenGraph meta tag optimizer and live simulator for Twitter (X) and LinkedIn sharing cards.

## Suite Dashboard & Extension Roadmap Review

Accuracy Verification: Confirmed that all 10 extensions are accurately registered with their single-purpose MV3 utilities, permission tiers, CWS review velocities, and build statuses:
Qeloma Shot (shot) — One-click full-page & region screenshot capture (Green Tier)
Qeloma Focus (focus) — declarativeNetRequest domain blocker & Pomodoro focus shield (Green Tier)
Qeloma Night (night) — Zero-flicker CSS dark mode restyling (Amber Tier)
Qeloma Clip → Lens (clip-lens) — On-page region capture connected to Gemini 2.5 Flash for streaming AI summarization (Green Tier)
Qeloma Volume (volume) — Per-tab Web Audio GainNode booster (up to 600%) & equalizer (Amber Tier)
Qeloma Timebox (timebox) — Visual hourly time-blocking grid with countdown timers (Green Tier)
Qeloma Webtime (webtime) — Zero-telemetry local browsing time tracker & charts (Amber Tier)
Qeloma Inspect (inspect) — On-page SEO inspector, H1–H6 hierarchy & JSON-LD parser (Green Tier)
Qeloma Reader (reader) — Distraction-free article reader with typography controls (Green Tier)
Qeloma Palette (palette) — Native EyeDropper API pixel color sampler & Tailwind generator (Green Tier)
Monorepo & Telemetry Integration:
Shared Package README Previewer: Local Markdown parser rendering packages/shared/* documentation directly inside the Monorepo Explorer.
Discord Webhook Integrator: Real-time CI/CD pipeline alert dispatcher supporting test success and failure notifications.
Telemetry & Core Web Vitals: Historical build duration and bundle size tracking paired with PageSpeed Core Web Vitals monitoring (LCP, CLS, INP, FID, TTFB).
GitHub Webhook Listener: Simulated workflow_run listener auto-updating Suite Dashboard status badges live.
Social Media Card Previewer: Interactive Twitter/LinkedIn OpenGraph card generator for meta tag optimization.
