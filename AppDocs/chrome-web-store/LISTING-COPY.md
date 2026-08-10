# Store listing copy — all ten extensions

Every field the Chrome Web Store dashboard asks for, ready to paste. Summaries
are the manifest `description` verbatim, so the listing and the installed
extension never disagree.

**Permission justifications are contractual.** A reviewer compares the text
against the code. Everything below was written from the actual implementation —
if you change what an extension does, change its justification in the same
commit.

Privacy policy URL for all ten: `https://qeloma.com/privacy` *(pending domain
confirmation — see the runbook)*.

---

## Qeloma Timebox

- **Category:** Workflow & Planning
- **Summary:** Visual hourly time-blocking grid with live countdown timers, task status toggles, and local storage persistence.

**Detailed description**

> Plan your day in hours, not in a list. Timebox gives you an hourly grid you fill
> with what you actually intend to do, a live countdown on the block you are in,
> and a one-click status toggle when something is done, moved, or dropped.
>
> Everything stays on your machine. Timebox has no account, no sync, no server,
> and no network access of any kind — your plan is stored in Chrome's local
> extension storage and never leaves the browser.

**Single purpose:** Provide an hourly time-blocking planner inside the browser toolbar.

**Permissions**

| Permission | Justification |
| --- | --- |
| `storage` | Persists the user's own time blocks, labels, and completion states in local extension storage so the plan survives a browser restart. No other data is stored and nothing is transmitted. |

**Data usage:** Collects nothing. Tick no data categories.

---

## Qeloma Palette

- **Category:** Developer Tools
- **Summary:** Native EyeDropper pixel color sampler, page dominant color clusterer, and one-click CSS/Tailwind value generator.

**Detailed description**

> Sample any pixel on screen with the browser's native eyedropper, pull the
> dominant colours out of the page you are looking at, and copy the result
> straight out as a hex value, a CSS custom property, or a Tailwind token.
>
> Palette runs entirely locally. No colours, screenshots, or page data are sent
> anywhere.

**Single purpose:** Sample and generate colour values from the page the user is viewing.

**Permissions**

| Permission | Justification |
| --- | --- |
| `activeTab` | Reads colour data from the tab the user is on, and only after they click the Qeloma Palette toolbar button. No access to any other tab and no background access. |
| `storage` | Saves the user's swatch history and preferred output format (hex / CSS / Tailwind) locally. |

**Data usage:** Collects nothing. Tick no data categories.

---

## Qeloma Inspect

- **Category:** Developer Tools
- **Summary:** On-page SEO inspector rendering H1–H6 heading hierarchies, OpenGraph preview cards, and structured JSON-LD data.

**Detailed description**

> See how a page is actually structured. Inspect renders the H1–H6 outline, the
> OpenGraph and Twitter card previews as a social crawler would see them, and any
> JSON-LD structured data the page declares — without opening DevTools.
>
> Analysis happens locally in the browser on the page you are already viewing.
> Nothing is uploaded and no page is fetched on your behalf.

**Single purpose:** Display the SEO and metadata structure of the page the user is viewing.

**Permissions**

| Permission | Justification |
| --- | --- |
| `activeTab` | Reads the headings, meta tags, and JSON-LD of the page the user is on, only after they click the Qeloma Inspect toolbar button. |
| `scripting` | Injects a single read-only extraction script into the active tab on that click to collect the heading and metadata structure. Nothing is injected until the user acts, and the script does not modify the page. |
| `storage` | Remembers which panels the user had expanded between sessions. |

**Data usage:** Collects nothing. Tick no data categories.

---

## Qeloma Reader

- **Category:** Accessibility
- **Summary:** Distraction-free article reader stripping clutter into a clean typography view with font adjustments and Markdown export.

**Detailed description**

> Strip an article down to what you came for. Reader extracts the main content,
> drops the navigation, ads, and sidebars, and renders it in a typography-first
> view with adjustable font size, family, and theme. Export the result as
> Markdown when you want to keep it.
>
> Extraction runs entirely in your browser. The article is never sent to a server
> and Reader has no network access.

**Single purpose:** Render the article on the current page in a clean, readable view.

**Permissions**

| Permission | Justification |
| --- | --- |
| `activeTab` | Reads the article content of the page the user is on, only after they click the Qeloma Reader toolbar button. |
| `scripting` | Injects the article-extraction script into the active tab on that click. It runs once per user action and is never registered to run automatically. |
| `storage` | Saves the user's reading preferences — font size, font family, and light/dark theme. |

**Data usage:** Collects nothing. Tick no data categories.

---

## Qeloma Shot

- **Category:** Workflow & Planning
- **Summary:** One-click viewport capture, region crop, and auto-scroll full-page screenshot stitching with canvas annotation.

**Detailed description**

> Capture what is on screen, a region you drag out, or the entire scrollable page
> stitched into one image. Annotate the result on a canvas and save it as a PNG.
>
> Capture and stitching happen locally in the browser. Images are never uploaded
> — the only place a screenshot goes is the folder you save it to.

**Single purpose:** Capture, annotate, and save screenshots of the page the user is viewing.

**Permissions**

| Permission | Justification |
| --- | --- |
| `activeTab` | Captures the visible area of the tab the user is on, only after they click the Qeloma Shot toolbar button. |
| `scripting` | Injects a measurement script that reads the page's scroll height and drives the auto-scroll sequence needed to stitch a full-page capture. Runs only for the capture the user requested. |
| `downloads` | Writes the finished PNG to the user's Downloads folder when they click Save. The extension never reads, lists, or modifies existing downloads. |
| `storage` | Saves capture preferences such as image format and annotation defaults. |

**Data usage:** Collects nothing. Tick no data categories.

---

## Qeloma Webtime

- **Category:** Well-being
- **Summary:** Private browsing time tracker with per-site breakdown charts, idle state auto-pausing, and zero telemetry.

**Detailed description**

> See where your browsing time actually goes. Webtime records how long you spend
> per site, breaks it down in a daily chart, and pauses automatically when you go
> idle or move away from the browser, so the numbers reflect real attention.
>
> Webtime is deliberately local-only. It records the domain name and nothing
> else — never the full URL, never the page title, never page content — and there
> is no account, no sync, and no telemetry.

**Single purpose:** Track and display how much time the user spends on each website.

**Permissions**

| Permission | Justification |
| --- | --- |
| `tabs` | Needed to read the origin of the active tab in order to attribute elapsed time to a site. The extension parses the URL and stores only the hostname (for example `example.com`); the full URL, query string, page title, and page content are discarded and never persisted. |
| `idle` | Detects when the user goes idle so the running timer pauses instead of over-counting time the user was away. |
| `storage` | Stores the per-domain daily totals locally. This is the extension's entire dataset and it never leaves the device. |

**Data usage:** Tick **Web history** — the extension records which sites were
visited (domain only) to build the report. State clearly that it is stored
locally and never transmitted.

---

## Qeloma Night

- **Category:** Accessibility
- **Summary:** Zero-flicker dark mode engine with contrast controls, warm amber hue filters, and site whitelists.

**Detailed description**

> A dark mode that applies before the page paints, so you never get hit with a
> white flash on the way to a dark page. Tune contrast, brightness, and warmth to
> taste, and whitelist the sites whose own dark theme you would rather keep.
>
> Night works by injecting a CSS filter layer. It does not read page text, form
> fields, or network activity, and it sends nothing anywhere.

**Single purpose:** Apply a user-configurable dark theme to websites.

**Permissions**

| Permission | Justification |
| --- | --- |
| `storage` | Stores the user's theme settings — invert, contrast, brightness, warmth — and their per-site whitelist. |

**Host permission justification — `<all_urls>` content script**

> Qeloma Night is a dark-mode filter, so it has to be able to restyle whichever
> site the user happens to open; there is no smaller set of sites that would let
> the feature work. The content script is registered at `document_start`
> specifically so the theme is in place before the first paint — running later is
> what produces the white flash this extension exists to remove.
>
> The script's entire behaviour is to inject one `<style>` element containing CSS
> filter rules, and to remove it again on whitelisted sites. It does not read the
> DOM, page text, form inputs, cookies, or network requests, and it makes no
> network calls. Nothing about the pages the user visits is collected, stored, or
> transmitted.

**Data usage:** Collects nothing. Tick no data categories.

---

## Qeloma Volume

- **Category:** Functionality & UI
- **Summary:** Per-tab Web Audio GainNode booster (up to 600%), bass booster equalizer, and stereo balance controls.

**Detailed description**

> Some tabs are just too quiet. Volume routes a tab's audio through a Web Audio
> gain stage so you can push it past Chrome's 100% ceiling, with a bass boost and
> a stereo balance control on top. Settings are remembered per site.
>
> Audio is processed live in memory and played straight back out. Nothing is
> recorded, saved, or transmitted.

**Single purpose:** Adjust the playback volume and tone of audio in the user's tab.

**Permissions**

| Permission | Justification |
| --- | --- |
| `activeTab` | Identifies which tab the user has asked to boost, at the moment they click the toolbar button. |
| `tabCapture` | Captures the audio stream of that one tab so it can be routed through a Web Audio `GainNode` and played back louder than Chrome allows natively. This is the only way to raise a tab's volume above 100%. The stream is processed in memory and is never recorded, written to disk, or transmitted. Video is not captured. |
| `offscreen` | MV3 service workers cannot use the Web Audio API. The offscreen document exists solely to host the audio graph that processes the captured stream. |
| `storage` | Saves per-site gain, bass boost, and balance preferences. |

**Data usage:** Collects nothing. Audio is processed transiently and never
persisted or sent. Tick no data categories.

---

## Qeloma Clip → Lens

- **Category:** Workflow & Planning
- **Summary:** Contextual page region capture connected directly to Gemini 2.5 Flash AI for streaming summaries and verdicts.

**Detailed description**

> Select a region of a page and get a summary, an extracted set of key facts, or a
> tone-and-credibility verdict, streamed back as it is generated.
>
> Clip → Lens uses your own Google Gemini API key, which you enter in the
> extension's options page and which is stored locally in your browser. When you
> run an analysis, the selected text is sent directly from your browser to
> Google's Gemini API — it does not pass through any Qeloma server. If no key is
> configured, the extension falls back to a fully offline local analysis that
> sends nothing anywhere.

**Single purpose:** Analyse a user-selected region of the current page with AI and show the result.

**Permissions**

| Permission | Justification |
| --- | --- |
| `activeTab` | Reads the text of the region the user selected on the page they are on, only after they click the Qeloma Clip → Lens toolbar button. |
| `scripting` | Injects a one-off extraction script into the active tab on that click to read the selected region. It runs per user action and does not modify the page. |
| `storage` | Stores the user's own Gemini API key and their last-used analysis mode locally. The key is never transmitted to Qeloma and is only used to authenticate the user's own requests to Google. |

**Remote code:** None. The extension makes data-only `fetch` calls to
`https://generativelanguage.googleapis.com` and executes no code retrieved over
the network. All executable code ships in the package.

**Data usage — this one is not blank.** Tick:

- **Website content** — the selected page text is transmitted to Google's Gemini
  API for analysis, using the user's own API key.
- **Authentication information** — the user's Gemini API key is stored locally.

Then certify: not sold to third parties · not used for unrelated purposes · not
used to determine creditworthiness or for lending. All three hold.

---

## Qeloma Focus

- **Category:** Well-being
- **Summary:** Domain blocker powered by Chrome declarativeNetRequest, Pomodoro timer, and session tracking.

**Detailed description**

> Name the sites that derail you, start a focus session, and Focus keeps them
> shut until the timer runs out. A toolbar countdown shows how long is left, and
> completed sessions are kept as a local history so you can see what you actually
> did.
>
> Blocking rules are generated on your machine from the list you type. Focus does
> not read, log, or transmit your browsing.

**Single purpose:** Block user-specified websites during timed focus sessions.

**Permissions**

| Permission | Justification |
| --- | --- |
| `declarativeNetRequest` | Registers block rules for exactly the domains the user typed into their block list. Rules are generated locally from that list and handed to Chrome, which enforces them. The extension never observes, reads, or logs the requests themselves — declarativeNetRequest is used precisely because it does not expose request contents to the extension. |
| `alarms` | Ends a Pomodoro session at the scheduled time and refreshes the toolbar countdown, without keeping a persistent background page alive. |
| `storage` | Stores the user's block list, current session state, and completed session history locally. |

**Optional host permission justification — `*://*/*`**

> Focus shows its own blocked page when the user tries to open a site they have
> blocked. Chrome only applies a `declarativeNetRequest` redirect if the
> extension holds host permission for that site, so some host access is
> unavoidable for that feature.
>
> Rather than request access to all sites at install, Focus declares host access
> as **optional** and requests exactly one domain at a time — at the moment the
> user types that domain into their block list. A user who blocks `youtube.com`
> is asked only for `*://*.youtube.com/*`. Removing the domain hands the
> permission straight back.
>
> If the user declines, the domain is still blocked; it falls back to a plain
> block rule and Chrome's own error page. The extension never reads, logs, or
> transmits request contents — `declarativeNetRequest` is used specifically
> because it does not expose request data to the extension.

**Data usage:** Collects nothing. Tick no data categories.
