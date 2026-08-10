# **QELOMA**  

## **BROWSER EXTENSIONS**

> **Architecture Review, Product Line & Build Economics**

> *A study of the Peta Sittek model and a proposed Qeloma extension suite*

UI → code → store approval, with costs, timelines, flows, themes, & dev tooling

Version 1.0 · Author: Jawad Ul Hadi · Qeloma Organization

>*Facts on fees & review times verified against current sources, August 2026*

### **Contents**

[1\. The Model We're Studying 3](#1.-the-model-we’re-studying)

[2\. Cost & Time Economics 4](#2.-cost-&-time-economics)

[3\. The Build Lifecycle — UI to Approval 6](#3.-the-build-lifecycle-—-ui-to-approval)

[4\. Proposed Qeloma Extension Line 7](#4.-proposed-qeloma-extension-line)

[5\. Per-Product Architecture Reviews 9](#5.-per-product-architecture-reviews)

[6\. Reference Flowcharts 13](#6.-reference-flowcharts)

[7\. Themes for the Line 14](#7.-themes-for-the-line)

[8\. Additional Developer Tooling 15](#8.-additional-developer-tooling)

[9\. New Ideas & Differentiators 16](#9.-new-ideas-&-differentiators)

# **1. The Model we’re Studying** {#1.-the-model-we’re-studying}

Peta Sittek's catalogue is a portfolio of **small, single-purpose browser extensions** — each solving exactly one problem, with a clean popup UI, a focused permission footprint, and a marketing page per product. It is the browser-extension expression of the same philosophy behind the Qeloma suite: **one tool, one job, done well**. That is precisely why it is worth studying before Qeloma ships its own line.

### **1.1 What the catalogue contains**

From the site and the two catalogue screenshots, the published products cluster into clear families:

| Family | Extensions | Core job |
| :---- | :---- | :---- |
| Appearance | Dark Mode Everywhere | Restyle any page to a dark theme |
| Page tools | Page Editable, Simple Screenshot, Site Inspector | Act on the current page (edit, capture, inspect) |
| Media | Volume Master | Boost/control tab audio beyond 100% |
| Productivity | Web time Tracker, Time box++, Daily Quote | Track time/focus / motivate |
| Privacy & blocking | Domain Blocker, Domain Whitelist | Block/allow domains & requests |
| Social insight | Social Meter, Social Revealer, Site Connector | Read/relay data about pages & profiles |
| Team tools | Message Deleter for Slack 3.0 | Automate a tedious SaaS chore |

### **1.2 The pattern worth copying**

| Trait | Why it works | Qeloma takeaway |
| :---- | :---- | :---- |
| One job each | Trivial to explain, review, and rank in search | Keep each extension a single capability |
| Popup-first UX | Users grasp value in one click; low support burden | Design the popup as the whole product |
| Narrow permissions | Faster review, higher trust, fewer rejections | activeTab over \<all\_urls\> wherever possible |
| A page per product | SEO \+ a clear install funnel per tool | One landing page per extension, shared shell |
| Cross-browser | Chrome \+ Edge \+ Firefox multiplies reach at low cost | Author once (WXT), ship to three stores |
| Local & private | No backend \= no cost, easy trust story | Fits Qeloma's zero-cost, key-free rule exactly |

*The strategic fit is strong: this model is local-first, private, and zero-backend by nature — the same constraints we've locked for the Qeloma suite. An extension line is arguably the purest expression of the Qeloma philosophy.*

# **2\. Cost & Time Economics** {#2.-cost-&-time-economics}

The honest headline: money cost is near zero; the real budget is time. Costs split into three buckets — once ever, once per extension, and never-ending.

### **2.1 Money — the entire fee picture**

| Item | Cost | Notes |
| :---- | :---- | :---- |
| Chrome Web Store registration | $5 one-time | Per developer account; covers up to 20 extensions; no renewal |
| Microsoft Edge Add-ons | $0 | Free developer registration |
| Firefox Add-ons (AMO) | $0 | Free |
| Hosting (landing pages) | $0 | Vercel Hobby / static; reuse the suite shell |
| Backend | $0 | Local-first extensions need none |
| Domain (optional, for verification) | \~$10–15/yr | Nice for brand \+ publisher verification; not required |

*Verified August 2026: the Chrome Web Store fee is a one-time $5 per account (not per extension, no annual renewal), and a single account can publish up to 20 extensions. Edge and Firefox charge no registration fee.*

### **2.2 Time — where the budget actually goes**

Per extension, assuming the shared Qeloma tooling and design system described later are in place. Ranges reflect a simple popup tool vs. a more involved one (e.g. content-script-heavy).

| Phase | Simple tool | Involved tool | What happens |
| :---- | :---- | :---- | :---- |
| Concept & scope | 0.5 day | 1 day | Define the single job, permissions, edge cases |
| UI / UX design | 1 day | 2–3 days | Popup \+ options; apply a Qeloma theme |
| Core code | 1–2 days | 4–7 days | Popup logic, content/background scripts, storage |
| Cross-browser | 0.5 day | 1 day | WXT targets; test Chrome/Edge/Firefox |
| Store assets | 0.5 day | 1 day | Icon set, screenshots, listing copy, privacy policy |
| Submit & fix | 0.5 day | 1–2 days | Package, submit, address review feedback |
| Total (elapsed) | \~4–5 days | \~10–15 days | Plus review wait (below) |

### **2.3 Approval timeline (verified, 2026\)**

| Store | Typical review | Drivers |
| :---- | :---- | :---- |
| Chrome Web Store | Often \< 24h; up to a few days | Two tracks: automated (minutes for clean, narrow-permission MV3) vs. manual (broad permissions, sensitive APIs) |
| Chrome — updates | Minutes to hours | Code-only MV3 updates are fast; permission/listing changes re-trigger scrutiny |
| Edge Add-ons | 1–7 days | Generally a touch slower than Chrome |
| Firefox AMO | Hours to a few days | Automated \+ possible manual; source may be requested if minified |

*As of April 2026 Google flagged a submission surge extending some review times. The single biggest lever on approval speed is permission minimalism: an MV3 extension using only activeTab from an established account can clear automated review in minutes; \<all\_urls\> plus sensitive APIs pushes you into slower manual review.*

### **2.4 The economics of a line (not a single tool)**

The Peta Sittek insight is that fixed costs are paid **once** and amortized across the whole catalog. With shared Qeloma tooling, each additional extension gets cheaper.

| Cost type | Paid once (whole line) | Paid per extension |
| :---- | :---- | :---- |
| Developer accounts | $5 Chrome \+ free Edge/Firefox | — |
| Design system / theme | Build the Qeloma popup kit once | Pick a theme variant |
| Build tooling (WXT etc.) | Configure once | Reuse config |
| Landing-page shell | One shared template | One page's content |
| Privacy policy | One common policy per account | Link/annotate per extension |
| Review learning curve | Paid on extension \#1 | Faster each time |

# **3\. The Build Lifecycle — UI to Approval** {#3.-the-build-lifecycle-—-ui-to-approval}

Every Qeloma extension moves through the same seven stages. Standardizing this is what makes a line efficient.

### **3.1 The pipeline**

  1 SCOPE ───► 2 DESIGN ───► 3 BUILD ───► 4 CROSS-BROWSER  
    (one job)     (popup/opts)   (MV3 code)    (WXT targets)  
                                                    │  
  7 MAINTAIN ◄─ 6 REVIEW ◄─ 5 PACKAGE & LIST ◄──────┘  
   (updates)     (stores)     (assets+policy)

| Stage | Output | Definition of done |
| :---- | :---- | :---- |
| 1 · Scope | One-line job \+ permission list | A single sentence; the minimum permissions written down |
| 2 · Design | Popup \+ options mockup, themed | Every state drawn; matches a Qeloma theme |
| 3 · Build | MV3 extension (service worker \+ popup) | Works unpacked in Chrome; no console errors |
| 4 · Cross-browser | Chrome/Edge/Firefox builds | Verified in all three via WXT targets |
| 5 · Package & list | Zip \+ icons \+ screenshots \+ copy \+ privacy | Listing complete; permissions justified in notes |
| 6 · Review | Store submission | Approved on all target stores |
| 7 · Maintain | Versioned updates | Fixes shipped; policy changes tracked |

### **3.2 Manifest V3 baseline (non-negotiable)**

All three major stores now require **Manifest V3**; MV2 is no longer accepted for new extensions. The Qeloma baseline manifest shape:

{  
  "manifest\_version": 3,  
  "name": "Qeloma \<Tool\>",  
  "version": "1.0.0",  
  "action": { "default\_popup": "popup.html" },  
  "background": { "service\_worker": "sw.js" },  
  "permissions": \["activeTab", "storage"\],   // minimal by default  
  "host\_permissions": \[\],                     // avoid \<all\_urls\> unless essential  
  "icons": { "16": "...", "48": "...", "128": "..." }  
}

* Background \= a service worker (not a persistent page); assume it can be killed anytime — persist state in storage.

* Prefer activeTab (granted on click) over broad host permissions — the single biggest review-speed lever.

* Never obfuscate code; minify only. Obfuscation is auto-flagged.

* Ship a complete listing: icon set, screenshots, clear description, and a privacy policy URL.

### **3.3 Permission tiers (design to the lowest tier you can)**

| Tier | Examples | Review impact |
| :---- | :---- | :---- |
| **Green** | activeTab, storage | Fast automated review likely |
| **Amber** | scripting, specific host patterns, downloads | Some added scrutiny; justify clearly |
| **Red** | \<all\_urls\>, tabs, webRequest, cookies, history | Manual review; strongest justification needed |

# **4\. Proposed Qeloma Extension Line** {#4.-proposed-qeloma-extension-line}

These are the initial products proposed for the Qeloma Organization. Each is a single-job tool, local-first, key-free, MV3, and shippable to Chrome/Edge/Firefox. They are chosen to (a) fit the Qeloma philosophy, (b) reuse suite assets where possible, and (c) span an easy-to-hard difficulty range so the team climbs the learning curve deliberately.

A note on strategy: some names below deliberately parallel proven categories (dark mode, screenshots, audio boost). That is intentional — **we compete on polish, privacy, and a coherent branded suite**, not on inventing unproven needs. Others (the Lens-connected tools) are genuinely differentiated because they tie into capabilities we already own.

### **4.1 The lineup at a glance**

| \# | Qeloma extension | One job | Difficulty |
| :---- | :---- | :---- | :---- |
| 1 | Qeloma Night | Dark-mode any website, cleanly | Medium |
| 2 | Qeloma Shot | One-click, full-page & region screenshots | Easy–Medium |
| 3 | Qeloma Volume | Per-tab audio boost & control | Medium |
| 4 | Qeloma Focus | Block/allow domains; focus sessions | Easy |
| 5 | Qeloma Timebox | Visual time-blocking on a grid | Easy–Medium |
| 6 | Qeloma Webtime | Private browsing-time analytics | Medium |
| 7 | Qeloma Inspect | On-page SEO / meta / headings inspector | Medium |
| 8 | Qeloma Clip → Lens | Capture a page region → send to QelomaLens | Medium–Hard |
| 9 | Qeloma Reader | Strip clutter → clean readable view | Medium |
| 10 | Qeloma Palette | Pick colors & extract a page's palette | Easy |

*Recommended first three (the wedge): Qeloma Shot (fast win, tiny permissions), Qeloma Focus (easiest, high daily use), Qeloma Night (high demand, showcases theming). Ship these to learn the pipeline, then scale to the rest.*

### **4.2 Suite-level architecture (shared foundation)**

Every extension sits on one shared foundation so the marginal cost of each new tool stays low.

qeloma-extensions/            (monorepo, WXT)  
  packages/  
    ext-ui/        popup \+ options component kit (themed)  
    ext-core/      storage, messaging, permission helpers, i18n  
    ext-theme/     @qeloma/theme adapted for popup surfaces  
  apps/  
    night/  shot/  volume/  focus/  timebox/  
    webtime/ inspect/ clip-lens/ reader/ palette/  
  landing/         shared landing-page shell (one page per app)

| Shared layer | What it gives every extension |
| :---- | :---- |
| **ext-ui** | Consistent popup shell, buttons, toggles, sliders, empty states — all themed. A new tool gets a professional UI for free. |
| **ext-core** | Typed wrappers over chrome.storage, runtime messaging, activeTab/scripting helpers, and i18n. No re-solving MV3 plumbing per tool. |
| **ext-theme** | The suite tokens mapped to popup surfaces (compact, dark-friendly). Brand consistency across the whole line. |
| **WXT** | One config builds Chrome/Edge/Firefox targets; handles MV3 boilerplate, HMR, and packaging. |
| **landing** | One shell renders every product page (hero, features, store badges) from a small config — the Peta Sittek funnel, systematized. |

# **5\. Per-Product Architecture Reviews** {#5.-per-product-architecture-reviews}

Each product below gets: its job, MV3 surfaces used, permission tier, the core flow, and the key risk. These are architecture reviews, not code.

### **5.1 Qeloma Night — dark mode any site**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Apply a comfortable dark theme to any page; per-site toggle \+ global on/off; remembers choices. |
| **MV3 surfaces** | Content script (injects CSS filter / computed restyle); popup (toggle \+ intensity); service worker (state); storage. |
| **Permissions** | activeTab \+ scripting (on toggle); storage. Avoid \<all\_urls\> by injecting on demand. |
| **Permission tier** | |
| **Key risk** | Style correctness across diverse sites (contrast, images, backgrounds). This is the hard part of dark-mode tools. |

popup toggle ─► sw: set site pref (storage)  
             ─► inject/adjust content style on active tab  
site load ─► content script reads pref ─► applies theme before paint

*Mitigation: layered strategy — CSS filter fallback for unknown sites, curated overrides for popular ones; user intensity slider; ship continual compatibility updates (the known cost of this category).*

### **5.2 Qeloma Shot — one-click screenshots**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Capture visible area, a selected region, or the full scrolling page; download or copy. |
| **MV3 surfaces** | Popup (mode buttons); service worker (captureVisibleTab, stitch full page); content script (region overlay \+ scroll). |
| **Permissions** | activeTab; downloads (optional); storage (prefs). No host permissions needed. |
| **Permission tier** | |
| **Key risk** | Full-page stitching on lazy-loading or fixed-header sites; high-DPI scaling. |

popup: choose Visible | Region | Full page  
 Region ─► content overlay selects rect ─► crop  
 Full   ─► sw scrolls \+ captures tiles ─► stitch on canvas  
 result ─► preview ─► download / copy

*Strong first product: tiny permission footprint (Green tier) → fast approval, and a universally useful job.*

### **5.3 Qeloma Volume — per-tab audio boost**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Boost a tab's audio above 100% and control volume per tab via Web Audio gain. |
| **MV3 surfaces** | Popup (slider, per-tab list); content script or offscreen doc (AudioContext \+ GainNode on media/tab stream); service worker. |
| **Permissions** | activeTab; tabCapture or media element access; storage. |
| **Permission tier** | |
| **Key risk** | MV3 audio routing (AudioContext lifecycle under a killable service worker; offscreen document may be required). |

popup slider ─► sw ─► content: route tab audio through GainNode  
             ─► gain \= slider (0..600%)  
tab switch ─► popup shows that tab's current gain

*Architecture note: use an offscreen document to host the persistent AudioContext, since the service worker cannot hold it. This is the crux of the design.*

### **5.4 Qeloma Focus — domain blocker & focus sessions**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Block distracting domains; start a timed focus session that enforces the blocklist. |
| **MV3 surfaces** | Popup (list \+ start session); service worker (declarativeNetRequest rules, timer); options (manage lists); storage. |
| **Permissions** | declarativeNetRequest; storage; alarms. No webRequest (MV3-friendly). |
| **Permission tier** | |
| **Key risk** | Getting blocking right with declarativeNetRequest rule limits. |

options: manage bl\[ocklist\] ─► storage  
 popup: Start focus (n min) ─► sw enables DNR rules \+ alarm  
 request to blocked host ─► DNR blocks ─► friendly block page  
 alarm fires ─► sw disables rules

*Easiest, highest-daily-use product; DNR keeps it MV3-clean and Green-tier. Excellent second launch.*

### **5.5 Qeloma Timebox — visual time-blocking**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Plan the day as blocks on a visual grid; lightweight, local, motivating. |
| **MV3 surfaces** | Popup or full-page 'newtab' (grid UI); storage. No content scripts. |
| **Permissions** | storage only. (Optional: override new-tab page.) |
| **Permission tier** | |
| **Key risk** | Scope creep into a full planner; keep it single-purpose. |

newtab/popup grid ─► drag to create blocks ─► storage  
 timer highlights the current block  
 day rollover ─► archive to storage

*Pure-local, Green tier, no page access at all — the safest possible extension to ship.*

### **5.6 Qeloma Webtime — private browsing analytics**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Show where your time goes online, computed and stored entirely locally. |
| **MV3 surfaces** | Service worker (tab/active-time tracking via events); popup (charts); storage. |
| **Permissions** | tabs (or activeTab \+ focus events); storage. Weigh tabs (Red) vs. a lighter event model. |
| **Permission tier** | |
| **Key risk** | Accurate time attribution without heavy permissions; the tabs permission raises review scrutiny. |

sw: on tab activated/updated ─► accrue time to domain (storage)  
 popup ─► read aggregates ─► render donut/day view  
 all data local; nothing leaves the browser

*Privacy is the selling point: state plainly that data never leaves the device (fits Qeloma's rule perfectly).*

### **5.7 Qeloma Inspect — on-page SEO/meta inspector**

| Aspect | Detail |
| :---- | :---- |
| **Job** | One click reveals a page's title, meta, headings outline, links, and structured data. |
| **MV3 surfaces** | Popup (report); content script (reads DOM: meta, h1..h6, canonical, OG, JSON-LD). |
| **Permissions** | activeTab \+ scripting; storage (prefs). |
| **Permission tier** | |
| **Key risk** | Presenting a lot of data clearly in a small popup. |

popup open ─► inject reader ─► collect meta/headings/links  
           ─► render report ─► copy/export

*Developer-flavored; pairs naturally with the Qeloma engineering brand and needs only activeTab.*

### **5.8 Qeloma Clip → Lens — capture region, send to Lens**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Select any region of a page (image or text), then push it straight into QelomaLens for SUMMARIZE / EXTRACT / VERDICT. |
| **MV3 surfaces** | Content script (region select); popup (choose capability); service worker (hand-off to Lens web app / local pipeline). |
| **Permissions** | activeTab \+ scripting; storage. Opens Lens in a tab with the payload (no key in the extension). |
| **Permission tier** | |
| **Key risk** | Clean hand-off contract to Lens without embedding heavy logic in the extension. |

content: select region ─► capture image/text  
 popup: pick capability (Summarize/Extract/Verdict)  
 sw: open Lens with payload ─► Lens runs (rule-based/local)

*This is the genuinely differentiated product — it makes the extension line a front door to QelomaLens. Strategic centerpiece.*

### **5.9 Qeloma Reader — clean reading view**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Strip nav, ads, and clutter; render an article in a calm, readable, themeable view. |
| **MV3 surfaces** | Content script (readability extraction); popup/overlay (reader UI \+ theme/font controls); storage. |
| **Permissions** | activeTab \+ scripting; storage. |
| **Permission tier** | |
| **Key risk** | Extraction quality across article layouts. |

popup: Read ─► inject readability extract ─► render overlay  
 controls: font, width, theme (reuse ext-theme)  
 prefs ─► storage

*Reuses the Qeloma theme beautifully; a natural companion to Night.*

### **5.10 Qeloma Palette — color picker & page palette**

| Aspect | Detail |
| :---- | :---- |
| **Job** | Eyedrop any pixel and extract a page's dominant color palette; copy hex/rgb. |
| **MV3 surfaces** | Content script (eyedropper / sample); popup (palette \+ copy); storage (history). |
| **Permissions** | activeTab \+ scripting; storage. (EyeDropper API where available.) |
| **Permission tier** | |
| **Key risk** | Cross-site sampling permissions and the EyeDropper API's availability. |

popup: Pick ─► eyedropper ─► hex/rgb ─► copy \+ history  
 Extract ─► sample page ─► cluster ─► palette swatches

*Designer-flavored, tiny, Green tier — an easy portfolio piece.*

# **6\. Reference Flowcharts** {#6.-reference-flowcharts}

Two flows every extension in the line shares. Individual product flows are in §5; these are the common rails.

### **6.1 End-to-end product lifecycle**

IDEA  
  └─► SCOPE (one job \+ min permissions)  
        └─► DESIGN (popup/options, themed)  
              └─► BUILD (WXT · MV3 · service worker \+ popup)  
                    └─► TEST (Chrome / Edge / Firefox)  
                          └─► ASSETS (icons · shots · copy · privacy)  
                                └─► SUBMIT ──► \[review\]  
                                       ├─ approved ─► LIVE ─► MAINTAIN  
                                       └─ rejected ─► FIX permissions/listing ─┘

### **6.2 Runtime request flow (MV3)**

USER clicks toolbar icon  
   └─► POPUP opens (ext-ui, themed)  
         └─► user action ─► sendMessage ─► SERVICE WORKER  
                                   ├─ needs page? ─► activeTab \+ scripting ─► CONTENT SCRIPT  
                                   │                                            └─► act on DOM / capture  
                                   └─ persist ─► chrome.storage (local)  
         ◄─ result ─── message back ─── popup renders  
(no external network required; nothing leaves the browser)

### **6.3 The Lens hand-off (Clip → Lens)**

CONTENT selects region ─► payload {image|text}  
   └─► SERVICE WORKER ─► open Lens tab with payload  
         └─► LENS ingests ─► rule-based/local capabilities run  
               └─► result shown in Lens (no key, no server needed)

# **7\. Themes for the Line** {#7.-themes-for-the-line}

The whole line shares **@qeloma/theme** adapted for compact popup surfaces. A small set of named variants keeps products distinct yet unmistakably Qeloma. Every extension picks one variant token set; all controls inherit it.

### **7.1 Base brand**

| | \#2C3E50 | Slate — brand | Popup header, primary text |
| :---- | :---- | :---- | :---- |
| | **\#C0532E** | Terracotta — accent | Primary action, active toggle, focus |
| | **\#11161C** | Editor base | Dark popup background |
| | **\#F2F0ED** | Paper | Light popup background |
| | **\#2E7D5B** | Success | Enabled / active session |
| | **\#B08900** | Warn | Permission prompt / attention |
| | **\#B23B3B** | Danger | Blocked / error |

### **7.2 Named popup variants**

| Variant | Mood | Suggested for |
| :---- | :---- | :---- |
| **Slate (default)** | Calm, professional, dark-first | Inspect, Webtime, Timebox |
| **Ember** | Warm terracotta-forward | Focus, Timebox sessions |
| **Night** | Deep, low-glare | Night, Reader |
| **Paper** | Light, editorial | Reader (light mode), Palette |
| **Signal** | High-contrast accents | Shot, Volume (action tools) |

*Rule: variants change surface \+ accent emphasis only, never the semantic token names. A control styled once works in every variant — the same contract used across the Qeloma suite.*

### **7.3 Popup layout system**

* Fixed popup width (360–400px); vertical rhythm on an 8px grid; one primary action per popup.

* Header (icon \+ name \+ master toggle) · body (the one control set) · footer (options link / status).

* Every state drawn: empty, active, permission-needed, error. Never a blank popup.

* Options page (when needed) reuses the same kit at full width.

# **8\. Additional Developer Tooling** {#8.-additional-developer-tooling}

The tooling that turns a pile of extensions into an efficient product line. Configure once; reuse everywhere.

| Tool | Role in the line | Why |
| :---- | :---- | :---- |
| **WXT** | Extension framework: MV3 scaffolding, HMR, multi-browser build | One codebase → Chrome/Edge/Firefox; kills boilerplate |
| **TypeScript (strict)** | All extension \+ shared code | Type-safe messaging & storage across surfaces |
| **React \+ Tailwind** | Popup/options UI via ext-ui | Consistent, fast UI; matches suite conventions |
| **@qeloma/theme** | Theming contract for popups | Brand consistency; already built |
| **web-ext** | Firefox run/lint/sign | Local testing \+ AMO validation |
| **Playwright** | E2E: load unpacked, drive popup | Verify flows headlessly (as we do in the suite) |
| **zip/CI packager** | Reproducible store zips per target | One command → uploadable artifacts |
| **Icon/screenshot gen** | Generate store assets from a template | Cover Studio can produce store banners |
| **Privacy-policy template** | One policy, per-app annotations | Required by stores; write once |
| **Store-listing linter** | Check permissions vs. usage before submit | Pre-empt the \#1 rejection cause |

*Reuse from the existing suite: Cover Studio can generate the Chrome/Edge/Firefox store screenshots and marquee images; @qeloma/theme provides the popup tokens; the Playwright \+ soffice verification workflow already used in the suite applies directly to extensions.*

# **9\. New Ideas & Differentiators** {#9.-new-ideas-&-differentiators}

Beyond parity products, these lean on assets Qeloma already owns — the hardest thing for a solo competitor to copy.

| Idea | Why it's differentiated |
| :---- | :---- |
| **Lens everywhere** | Right-click any selection/image ─► a Qeloma capability (Summarize/Extract/Verdict) runs via Lens. The extension line becomes Lens's distribution channel. |
| **Studio quick-clean** | Right-click an image ─► open in Qeloma Studio for bg-remove/enhance. Ties the extension line to the editor. |
| **Unified Qeloma popup** | A single 'Qeloma' launcher extension that hosts installed mini-tools as tabs — one icon, many capabilities, coherent brand. |
| **Private-by-manifest badge** | Every listing states 'no data leaves your browser' and backs it with a zero-host-permission design where possible — a real trust wedge. |
| **Theme sync** | One theme choice syncs across all Qeloma extensions via storage — the suite feels like one product, not twelve. |
| **Capability recipes** | Site Connector-style: capture on site A ─► use on site B, but routed through Lens capabilities rather than raw scraping. |

### **9.1 Recommended rollout**

1. Stand up the shared foundation (WXT monorepo, ext-ui, ext-core, ext-theme, landing shell) \+ pay the $5 Chrome account.

2. Ship the wedge: Qeloma Shot ─► Qeloma Focus ─► Qeloma Night. Learn the three stores' review quirks on low-permission tools first.

3. Add the differentiator: Qeloma Clip ─► Lens (the strategic centerpiece).

4. Fill out the line: Timebox, Webtime, Inspect, Reader, Palette, Volume as capacity allows.

5. Introduce the unified launcher \+ theme sync once several tools are live.

**Bottom line.** The Peta Sittek model is a near-perfect fit for Qeloma: single-job, local-first, private, zero-backend tools — the same constraints we've already locked. Money cost is trivial ($5 once for Chrome; free on Edge/Firefox); the real investment is time, and a shared foundation amortizes it across the whole line. Start with three low-permission wedge products to master the pipeline, then play the card no solo developer can match — wiring the extension line into QelomaLens and Studio, so the whole suite compounds.
