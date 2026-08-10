# Chrome Web Store — submission runbook

Ten extensions, one developer account, one $5 registration fee. This is the
order of operations from a clean checkout to ten published listings.

Companion files:

- [LISTING-COPY.md](LISTING-COPY.md) — every field the dashboard asks for, per extension
- [PRIVACY-POLICY.md](PRIVACY-POLICY.md) — the single policy all ten link to

---

## 0. One-time account setup

1. Register at <https://chrome.google.com/webstore/devconsole> — **$5 once**, per
   account, covers up to 20 extensions. No renewal.
2. Complete the **account-level publisher details**: publisher name, contact
   email, and a **verified** email address. Unverified contact email blocks
   publishing.
3. Host the privacy policy at a stable public URL and paste it into
   **Account → Privacy practices**. All ten listings reference it.

> **Open item:** [PRIVACY-POLICY.md](PRIVACY-POLICY.md) is written but not
> hosted. It currently assumes `https://qeloma.com/privacy`. Confirm the real
> domain before the first upload — the URL appears in every listing and changing
> it later means editing ten listings.

---

## 1. Build and gate

```bash
cd extensions
npm install
npm run build:all       # builds + zips all 10 into extensions/release/
node scripts/cws-preflight.mjs
```

`cws-preflight.mjs` is the gate. It reads the real build output — not the source
config — and fails on anything the store rejects outright:

| Checked | Why it matters |
| --- | --- |
| `manifest_version: 3` | MV2 uploads are refused |
| name ≤ 75, description 1–132 chars | hard field limits; over-length fails at upload |
| version format (1–4 ints, 0–65535, no leading zeros) | malformed versions are refused |
| icons 16/48/128 exist **and** are actually those pixel dimensions | a mislabelled icon fails review |
| no `key` / `update_url` in the manifest | dev-only keys break the upload |
| no `eval()`, `new Function()`, remote `import()`, remote `<script src>` | remote code execution is banned outright |
| no `.map`, `.DS_Store`, `.env`, `node_modules/` in the package | leaks source and secrets |
| DNR redirect targets are web-accessible **and** host permissions exist | otherwise blocking silently never fires |
| release zip exists and is non-empty | catches a half-finished build |

It also emits **warnings** — these are not blockers, they are the questions a
reviewer will ask. Every warning has prepared answer text in
[LISTING-COPY.md](LISTING-COPY.md).

**Do not upload anything while the gate reports an ERROR.**

---

## 2. Per-extension store assets

Chrome requires, for each listing:

| Asset | Spec | Required? |
| --- | --- | --- |
| Store icon | 128×128 PNG | Yes |
| Screenshot | 1280×800 or 640×400 PNG/JPEG, 1–5 of them | **Yes — at least 1** |
| Small promo tile | 440×280 PNG | Only if you want to be listed in categories/search collections |
| Marquee promo tile | 1400×560 PNG | Only for editorial features |

The 128×128 icons already ship inside each package. **Screenshots do not exist
yet and are the one remaining hard blocker on every listing** — a listing cannot
be submitted without at least one.

Fastest path: load each unpacked build from `packages/<name>/.output/chrome-mv3`
via `chrome://extensions` → Developer mode → Load unpacked, open the popup on a
representative page, and capture at 1280×800.

---

## 3. Create each listing

For each extension, in the developer dashboard:

1. **New item** → upload `extensions/release/qeloma-<name>.zip`.
2. **Store listing tab** — paste title, summary, description, category, and
   language from [LISTING-COPY.md](LISTING-COPY.md). Upload the screenshot(s).
3. **Privacy tab** — this is where submissions actually get delayed:
   - **Single purpose** — one sentence. Prepared per extension.
   - **Permission justification** — a separate box per declared permission.
     Every permission the manifest declares must have text. Prepared per
     extension.
   - **Host permission justification** — only for Night (and Focus, depending on
     the decision in §5).
   - **Data usage** — tick what the extension collects, then certify the three
     compliance checkboxes. Nine of the ten collect nothing that leaves the
     device; Clip → Lens is the exception and is disclosed.
   - **Privacy policy URL** — the same URL for all ten.
4. **Distribution tab** — Public, all regions unless you want a soft launch.
5. **Submit for review.**

---

## 4. Review expectations

| Track | Trigger | Typical turnaround |
| --- | --- | --- |
| Automated | MV3, narrow permissions, no host access, no data transfer | minutes to ~24 h |
| Manual | broad host access, sensitive APIs, any data transmission | days |

Which of ours land where:

| Extension | Track | Reason |
| --- | --- | --- |
| Timebox | Automated | `storage` only |
| Palette | Automated | `activeTab`, `storage` |
| Inspect | Automated | `activeTab`, `scripting`, `storage` |
| Reader | Automated | `activeTab`, `scripting`, `storage` |
| Shot | Likely automated | adds `downloads` |
| Webtime | Borderline | `tabs` reads URLs |
| Focus | Borderline | host access declared but optional, so no install warning |
| Volume | Manual likely | `tabCapture` |
| Clip → Lens | Manual likely | transmits page text to a third-party API |
| Night | **Manual** | `<all_urls>` content script |

### Recommended publishing order

The architecture review (§9.1) proposes Shot → Focus → Night as the wedge.
Publish in ascending review risk instead, so the pipeline is learned on listings
that come back in minutes rather than days:

1. **Timebox, Palette, Inspect, Reader** — automated track, learn the dashboard
2. **Shot, Webtime, Focus** — one sensitive permission each
3. **Volume, Night** — first manual reviews
4. **Clip → Lens** — last, the only data-transmission disclosure

---

## 5. Resolved — Qeloma Focus blocking

Focus previously shipped broken. `background.ts` built `declarativeNetRequest`
rules whose action was `redirect → extensionPath: /blocked.html`, but under MV3 a
`redirect` action requires host permissions for the request URL, and the redirect
target must be listed in `web_accessible_resources`. Neither was declared, so the
rules registered without error and never fired — with blocking being the entire
product.

**Fixed with per-domain optional host permissions:**

- `optional_host_permissions: ['*://*/*']` — declared, but *not* granted at
  install, so Chrome shows no all-sites warning on the install prompt.
- `web_accessible_resources` exposes `blocked.html`.
- The popup calls `chrome.permissions.request({ origins: ['*://*.<domain>/*'] })`
  at the moment the user adds a domain, and hands the permission back via
  `chrome.permissions.remove()` when they delete it.
- The background worker splits the block list by what has actually been granted:
  granted domains get the branded `blocked.html` redirect, declined ones fall
  back to a plain `block` rule and Chrome's own error page. **Blocking works
  either way** — declining only costs you the branded page.
- `chrome.permissions.onAdded` / `onRemoved` rebuild the rule set so the two
  paths stay in sync.

The permission request must be the first `await` in the click handler; Chrome
only shows the prompt while the click's user gesture is live.

---

## 6. After approval

- **Versioning.** Every update needs a higher `version` in `wxt.config.ts`.
  Chrome will not accept a re-upload at the same version.
- **Re-run the gate** before every update, not just the first submission.
- **Permission increases trigger re-review** and Chrome disables the extension
  for existing users until they accept the new permissions. Adding host
  permissions to Focus later is more expensive than getting it right now.
- **Keep the zips.** `extensions/release/` is gitignored; archive the exact
  uploaded artefact somewhere durable so you can reproduce what a reviewer saw.
