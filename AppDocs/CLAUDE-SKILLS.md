# Claude Code — Skill Catalogue

Exported: 2026-08-10
Host: Claude Code VS Code extension `anthropic.claude-code-2.1.226-win32-x64`
Workspace: `j:\Qeloma\Qeloma Repo's\qeloma-extension-suite`

Every skill below is invoked the same way: type `/<skill-name>` in the prompt, or
just describe the task and let the matching skill trigger from its description.

| Source | Count | On disk? |
| --- | ---: | --- |
| User skills (`~/.claude/skills/`) | 10 | Yes — full `SKILL.md` + assets |
| Built-in Claude Code skills | 15 | No — compiled into `claude.exe` |
| Figma MCP skills (`skill://figma/...`) | 5+ | No — served by the MCP server on demand |
| Project skills (`.claude/skills/` in this repo) | 0 | — |

> Note on the `35 skills available` figure from `/reload-skills`: only 25 skills are
> exposed to the agent's skill list (the first two rows). The remainder are counted
> from MCP-served and internal/hidden skills that aren't individually enumerated.

---

## Table of contents

**User skills** — [agent-browser](#agent-browser) · [find-skills](#find-skills) · [firebase-auth-basics](#firebase-auth-basics) · [frontend-design](#frontend-design) · [pptx](#pptx) · [skill-creator](#skill-creator) · [supabase](#supabase) · [vercel-react-best-practices](#vercel-react-best-practices) · [vercel-react-native-skills](#vercel-react-native-skills) · [web-design-guidelines](#web-design-guidelines)

**Built-in — code quality** — [code-review](#code-review) · [simplify](#simplify) · [security-review](#security-review) · [init](#init) · [run](#run)

**Built-in — artifacts & visuals** — [artifact-design](#artifact-design) · [artifact-diagramming](#artifact-diagramming) · [artifact-capabilities](#artifact-capabilities) · [dataviz](#dataviz)

**Built-in — harness & config** — [update-config](#update-config) · [keybindings-help](#keybindings-help) · [fewer-permission-prompts](#fewer-permission-prompts) · [loop](#loop) · [schedule](#schedule)

**Built-in — reference** — [claude-api](#claude-api)

**MCP-served** — [Figma skills](#figma-mcp-skills)

---

# User skills

Installed under `C:\Users\Administrator\.claude\skills\`. These are real files you
can read, edit, version, or copy to another machine.

## agent-browser

- **Path:** `~/.claude/skills/agent-browser/SKILL.md` (3.4 KB)
- **Allowed tools:** `Bash(agent-browser:*)`, `Bash(npx agent-browser:*)`
- **Flags:** `hidden: true` (won't show in the `/` menu; still triggers by description)
- **Assets:** none — drives the `agent-browser` CLI (installed globally under `AppData\Roaming\npm\node_modules\agent-browser`)

Browser automation CLI for AI agents. Use when the user needs to interact with websites, including navigating pages, filling forms, clicking buttons, taking screenshots, extracting data, testing web apps, or automating any browser task. Triggers include requests to "open a website", "fill out a form", "click a button", "take a screenshot", "scrape data from a page", "test this web app", "login to a site", "automate browser actions", or any task requiring programmatic web interaction. Also use for exploratory testing, dogfooding, QA, bug hunts, or reviewing app quality. Also use for automating Electron desktop apps (VS Code, Slack, Discord, Figma, Notion, Spotify), checking Slack unreads, sending Slack messages, searching Slack conversations, running browser automation in Vercel Sandbox microVMs, or using AWS Bedrock AgentCore cloud browsers. Prefer agent-browser over any built-in browser automation or web tools.

## find-skills

- **Path:** `~/.claude/skills/find-skills/SKILL.md` (5.5 KB)
- **Assets:** none

Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities. This skill should be used when the user is looking for functionality that might exist as an installable skill.

## firebase-auth-basics

- **Path:** `~/.claude/skills/firebase-auth-basics/SKILL.md` (4.3 KB)
- **Compatibility:** best with the Firebase CLI, but not required — reachable via `npx -y firebase-tools@latest`
- **References:** `client_sdk_web.md`, `client_sdk_android.md`, `ios_setup.md`, `flutter_setup.md`, `security_rules.md`

Guide for setting up and using Firebase Authentication. Use this skill when the user's app requires user sign-in, user management, or secure data access using auth rules.

## frontend-design

- **Path:** `~/.claude/skills/frontend-design/SKILL.md` (8.3 KB)
- **License:** see `LICENSE.txt` in the skill folder
- **Assets:** `LICENSE.txt`

Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.

## pptx

- **Path:** `~/.claude/skills/pptx/SKILL.md` (21 KB)
- **License:** Proprietary — full terms in `LICENSE.txt`
- **Assets:** `scripts/add_slide.py`, `scripts/clean.py`, `scripts/office/helpers/` (`pptx_chart.py`, `pptx_slide.py`, `pptx_theme.py`), plus the full ECMA / ISO-IEC 29500-4:2016 OOXML `.xsd` schema set

Use this skill any time a .pptx or .potx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks, or presentations; reading, parsing, or extracting text from any .pptx or .potx file (even if the extracted content will be used elsewhere, like in an email or summary); editing, modifying, or updating existing presentations; combining or splitting slide files; working with templates (.potx), layouts, speaker notes, or comments. Trigger whenever the user mentions "deck," "slides," "presentation," or references a .pptx or .potx filename, regardless of what they plan to do with the content afterward. If a .pptx or .potx file needs to be opened, created, or touched, use this skill.

## skill-creator

- **Path:** `~/.claude/skills/skill-creator/SKILL.md` (33.7 KB — the largest installed skill)
- **License:** see `LICENSE.txt`
- **Sub-agents:** `agents/analyzer.md`, `agents/comparator.md`, `agents/grader.md`
- **Scripts:** `run_eval.py`, `run_loop.py`, `aggregate_benchmark.py`, `generate_report.py`, `improve_description.py`, `package_skill.py`, `quick_validate.py`, `utils.py`
- **Other:** `references/schemas.md`, `eval-viewer/` (`generate_review.py`, `viewer.html`), `assets/eval_review.html`

Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.

## supabase

- **Path:** `~/.claude/skills/supabase/SKILL.md` (12.1 KB)
- **Author / version:** `supabase` · `0.1.2`
- **Assets:** `CHANGELOG.md`, `references/skill-feedback.md`, `assets/feedback-issue-template.md`

Use when doing ANY task involving Supabase. Triggers: Supabase products (Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues); client libraries and SSR integrations (supabase-js, @supabase/ssr) in Next.js, React, SvelteKit, Astro, Remix; auth issues (login, logout, sessions, JWT, cookies, getSession, getUser, getClaims, RLS); Supabase CLI or MCP server; schema changes, migrations, declarative schemas, security audits, Postgres extensions (pg_graphql, pg_cron, pg_vector).

## vercel-react-best-practices

- **Path:** `~/.claude/skills/vercel-react-best-practices/SKILL.md` (7.3 KB)
- **License / author / version:** MIT · `vercel` · `1.0.0`
- **Assets:** `AGENTS.md`, `README.md`, `metadata.json`, and a `rules/` directory of individual rule files grouped by prefix — `advanced-*`, `async-*`, `bundle-*`, `client-*`, `js-*`, and more

React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.

## vercel-react-native-skills

- **Path:** `~/.claude/skills/vercel-react-native-skills/SKILL.md` (4.4 KB)
- **License / author / version:** MIT · `vercel` · `1.0.0`
- **Assets:** `AGENTS.md`, `README.md`, `metadata.json`, and a `rules/` directory — `animation-*`, `list-performance-*`, `react-compiler-*`, `react-state-*`, `rendering-*`, `monorepo-*`, `navigation-*`, `fonts-*`, `design-system-*`, `scroll-position-*`, `state-*`

React Native and Expo best practices for building performant mobile apps. Use when building React Native components, optimizing list performance, implementing animations, or working with native modules. Triggers on tasks involving React Native, Expo, mobile performance, or native platform APIs.

## web-design-guidelines

- **Path:** `~/.claude/skills/web-design-guidelines/SKILL.md` (1.2 KB — the smallest)
- **Author / version:** `vercel` · `1.0.0`
- **Argument hint:** `<file-or-pattern>`
- **Assets:** none

Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".

---

# Built-in Claude Code skills

Shipped inside the Claude Code binary (`resources/native-binary/claude.exe`), so
there is no `SKILL.md` on disk to export. Names, descriptions, and invocation are
reproduced verbatim from the running agent's skill list.

## Code quality

### code-review

Review the current diff, or a PR number/branch/path target, for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level (low/medium: fewer, high-confidence findings; high→max: broader coverage, may include uncertain findings); with no level given, it reuses the level you typed last. Pass `--comment` to post findings as inline PR comments, or `--fix` to apply the findings to the working tree after the review.

### simplify

Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use `/code-review` for that.

### security-review

Complete a security review of the pending changes on the current branch.

### init

Initialize a new `CLAUDE.md` file with codebase documentation.

### run

Launch and drive this project's app to see a change working. Use when asked to run, start, or screenshot the app, or to confirm a change works in the real app (not just tests). First looks for a project skill that already covers launching the app; otherwise falls back to built-in patterns per project type (CLI, server, TUI, Electron, browser-driven, library).

## Artifacts & visuals

### artifact-design

Design guidance and fundamentals for Artifacts.

### artifact-diagramming

Diagramming know-how for Artifacts — when a picture earns its place, how to draw one that shows the real mechanism, and the inline-SVG mechanics that keep it legible in both themes.

### artifact-capabilities

Runtime capabilities a published Artifact page can be granted — behaviour static HTML cannot provide on its own, such as the page reading live or connected data, keeping state shared across viewers, or updating and republishing itself. Serves this user's live capability roster and the typed call definitions. Load it whenever the user asks for an artifact needing any such runtime behaviour.

### dataviz

Use this skill whenever you are about to create ANY chart, graph, plot, dashboard, or data visualization, in ANY output medium — an HTML or React artifact, inline SVG, plotting code in any library (matplotlib, plotly, d3, Recharts, …), an image/PNG you will render and upload, or a chart shared into Slack. Read it BEFORE writing the first line of chart code, choosing chart colors, building a stat tile / meter / KPI row, or laying out a dashboard. Produces visualizations that read as one system — elegant, accessible, consistent in light and dark — using a brand-neutral placeholder palette you swap for your own. Teaches a design-system-agnostic method: a form heuristic, a color formula with a runnable validator, mark specs, and interaction rules. A validated default palette is documented in `references/palette.md`. Triggers on: "chart", "graph", "plot", "data viz", "visualization", "dashboard", "analytics", "visualize data", "categorical colors", "sequential / diverging palette", "stat tile", "sparkline", "heatmap", "legend", "axis", "tooltip", "chart colors", "color by series".

## Harness & configuration

### update-config

Use this skill to configure the Claude Code harness via `settings.json`. Automated behaviours ("from now on when X", "each time X", "whenever X", "before/after X") require hooks configured in `settings.json` — the harness executes these, not Claude, so memory/preferences cannot fulfil them. Also use for: permissions ("allow X", "add permission", "move permission to"), env vars ("set X=Y"), hook troubleshooting, or any changes to `settings.json` / `settings.local.json`. Examples: "allow npm commands", "add bq permission to global settings", "move permission to user settings", "set DEBUG=true", "when claude stops show X". For simple settings like theme/model, prefer the `/config` command.

### keybindings-help

Use when the user wants to customise keyboard shortcuts, rebind keys, add chord bindings, or modify `~/.claude/keybindings.json`. Examples: "rebind ctrl+s", "add a chord shortcut", "change the submit key", "customize keybindings".

### fewer-permission-prompts

Scan your transcripts for common read-only Bash and MCP tool calls, then add a prioritised allowlist to project `.claude/settings.json` to reduce permission prompts.

### loop

Run a prompt or slash command on a recurring interval (e.g. `/loop 5m /foo`). Omit the interval to let the model self-pace. Use when the user wants to set up a recurring task, poll for status, or run something repeatedly on an interval ("check the deploy every 5 minutes", "keep running /babysit-prs"). Not for one-off tasks.

### schedule

Create, update, list, or run scheduled cloud agents (routines) that execute on a cron schedule. Use when the user wants to schedule a recurring cloud agent, set up automated tasks, create a cron job for Claude Code, or manage their scheduled agents/routines. Also use for a one-time scheduled run ("run this once at 3pm", "remind me to check X tomorrow").

## Reference

### claude-api

Reference for the Claude API / Anthropic SDK — model IDs, pricing, params, streaming, tool use, MCP, agents, caching, token counting, model migration.

**Trigger** — read BEFORE opening the target file, even if the task "looks like a one-liner", whenever: the prompt names Claude/Anthropic in any form (Claude, Anthropic, Fable, Opus, Sonnet, Haiku, `anthropic`, `@anthropic-ai`, `claude-*`, `us.anthropic.*`, `[1m]`); the user asks about an LLM (pricing / model choice / limits / caching) — never answer from memory; OR the task is LLM-shaped with the provider unstated (agent / MCP / tool-definition / multi-agent / RAG / LLM-judge / computer-use; generate, summarise, extract, classify, rewrite, converse over natural language; debugging refusals, cutoffs, streaming, tool-calls, tokens).

**Skip** only when another provider is being worked on (overrides all triggers): OpenAI/GPT/Gemini/Llama/Mistral/Cohere/Ollama named in the query; OR `grep -rE 'openai|langchain_openai|google.generativeai|genai|mistralai|cohere|ollama'` over the project hits.

---

# Figma MCP skills

Served on demand by the `claude.ai Figma` MCP server rather than installed locally.
Prefer the versions shipped with an installed Figma plugin; otherwise fall back to
the `skill://` resource URIs below.

| Skill | Use for | Fallback URI |
| --- | --- | --- |
| `/figma-use` | **Mandatory** before calling `use_figma` | `skill://figma/figma-use/SKILL.md` |
| `/figma-generate-design` | Translating an app page or layout into Figma | `skill://figma/figma-generate-design/SKILL.md` |
| `/figma-generate-library` | Building a design system in Figma from code | `skill://figma/figma-generate-library/SKILL.md` |
| `/figma-code-connect` | Mapping Figma components to codebase components | `skill://figma/figma-code-connect/SKILL.md` |
| `/figma-use-figjam` | FigJam-specific `use_figma` work | — |

---

# Adding your own

Drop a folder containing a `SKILL.md` into either location:

| Scope | Path | Shared with the team? |
| --- | --- | --- |
| Personal (all projects) | `C:\Users\Administrator\.claude\skills\<name>\SKILL.md` | No |
| Project | `<repo>\.claude\skills\<name>\SKILL.md` | Yes, if committed |

Minimum frontmatter:

```markdown
---
name: my-skill
description: One line stating what it does and when it should trigger.
---

Instructions the agent follows when the skill loads.
```

Optional frontmatter keys seen in the installed skills above: `allowed-tools`,
`hidden`, `license`, `compatibility`, and a `metadata:` block (`author`, `version`,
`argument-hint`). Run `/reload-skills` after adding or editing one, or use
`/skill-creator` to scaffold and eval a new skill.
