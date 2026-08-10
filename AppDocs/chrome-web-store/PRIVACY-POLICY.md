# Qeloma Extensions — Privacy Policy

*Last updated: 10 August 2026*

> **Before publishing:** confirm the two placeholders — the hosting URL
> (`https://qeloma.com/privacy`) and the contact address
> (`privacy@qeloma.com`). Both appear in all ten store listings. Host this as a
> public page; the Chrome Web Store rejects policy URLs behind a login.

This policy covers the Qeloma browser extension suite: **Qeloma Night, Shot,
Volume, Focus, Timebox, Webtime, Inspect, Clip → Lens, Reader,** and
**Palette**.

## The short version

Nine of the ten extensions send nothing anywhere. They have no accounts, no
servers, no analytics, and no telemetry. Everything they remember is stored in
your own browser using Chrome's extension storage and stays on your device.

The one exception is **Qeloma Clip → Lens**, which sends text you explicitly
select to Google's Gemini API using an API key you supply yourself. That is
described in full below.

## What each extension stores, and where

All storage below is local to your browser via the Chrome `storage` API. None of
it is transmitted to Qeloma.

| Extension | What it keeps on your device |
| --- | --- |
| Night | Theme settings and your per-site whitelist |
| Shot | Capture format and annotation preferences |
| Volume | Per-site gain, bass, and balance settings |
| Focus | Your block list, current session, and session history |
| Timebox | Your time blocks and their completion state |
| Webtime | Daily time totals per domain — hostname only |
| Inspect | Which panels you had expanded |
| Reader | Font size, font family, and theme |
| Palette | Saved colour swatches and output format |
| Clip → Lens | Your Gemini API key and last-used analysis mode |

## What is never collected

Across the entire suite, we do not collect, store, or transmit:

- personal identifiers, names, email addresses, or account credentials;
- passwords, form input, or payment information;
- your browsing history, beyond what is described for Webtime below;
- page content, screenshots, or audio, beyond what is described for
  Clip → Lens below;
- analytics, crash telemetry, advertising identifiers, or device fingerprints.

We do not sell or share data with third parties, because we do not collect it.

## Qeloma Webtime — a note on browsing data

Webtime records how long the active tab spends on each site. To do that it reads
the active tab's URL and immediately reduces it to the hostname — for example,
`example.com`. The full URL, query string, page title, and page content are
discarded and never written to storage.

The resulting daily totals live only in your browser. There is no sync, no
export to a server, and no account. Clearing the extension's storage or
uninstalling it deletes the data permanently.

## Qeloma Clip → Lens — third-party AI processing

Clip → Lens is the only extension in the suite that transmits data off your
device, and only when you actively ask it to.

**What is sent.** When you select a region of a page and choose an analysis
action, the selected text (truncated to roughly 6,000 characters) is sent along
with the page title and URL as context.

**Where it goes.** Directly from your browser to Google's Generative Language
API at `https://generativelanguage.googleapis.com`. It does not pass through any
Qeloma server. Qeloma never receives, sees, or stores the text you analyse.

**How it is authenticated.** With a Google Gemini API key that you create and
enter yourself in the extension's options page. The key is stored locally in
your browser and is used only to sign your own requests to Google. It is never
sent to Qeloma.

**Google's handling of that data** is governed by Google's own terms for the
Gemini API, not by this policy. Review them before sending anything sensitive.

**Not sending anything.** If you do not configure an API key, Clip → Lens runs a
local, offline analysis instead and makes no network requests at all. Select
text you are comfortable sharing with Google, or use the offline mode.

## Permissions

Each extension requests the narrowest permission set its feature needs. The
justification for every permission is published on that extension's Chrome Web
Store listing, under the Privacy practices section. Two are worth calling out:

- **Qeloma Night** runs on all sites, because a dark-mode filter has to work on
  whichever site you open. It only injects a CSS filter; it does not read page
  content.
- **Qeloma Volume** captures a tab's audio stream so it can amplify it. The
  audio is processed live in memory and is never recorded, saved, or sent.

## Your control

- Uninstalling an extension removes all of its stored data.
- You can clear stored settings at any time from the extension's own UI or via
  `chrome://extensions`.
- Because nothing is held on a server, there is no account to delete and no
  data-export request to make.

## Children

These extensions are general-purpose developer and productivity tools. They are
not directed at children and collect no personal information from anyone.

## Changes

If this policy changes materially, the date at the top will be updated and the
change will be noted in the affected extensions' store listings.

## Contact

Questions about this policy: **privacy@qeloma.com**
