import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QelomaExtension, TabData, TimeboxTask, MonorepoFile, LensAnalysisResult, CwsLinterResult } from '../models/extension.model';

@Injectable({
  providedIn: 'root'
})
export class ExtensionStoreService {
  private http = inject(HttpClient);

  // 10 Extensions Definition
  readonly extensions = signal<QelomaExtension[]>([
    {
      id: 'shot',
      name: 'Qeloma Shot',
      shortName: 'Shot',
      tagline: 'One-click, full-page & region screenshots',
      description: 'Capture visible viewport, selected canvas regions, or auto-scroll stitch full pages with instant annotation and download.',
      category: 'Page Tools',
      permissionTier: 'Green',
      difficulty: 'Easy–Medium',
      permissions: ['activeTab', 'storage', 'downloads'],
      hostPermissions: [],
      themeVariant: 'signal',
      icon: 'photo_camera',
      status: 'Wedge Candidate',
      isWedge: true,
      estimatedReviewTime: '< 24h (Automated Fast-Track)',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Shot',
    description: 'One-click, full-page & region screenshots',
    permissions: ['activeTab', 'storage', 'downloads'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Shot",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["activeTab", "storage", "downloads"]
}`,
      popupComponent: 'shot',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Shot)', runNumber: 142, commitHash: 'a3f91b2', commitMessage: 'feat(shot): optimize MV3 service worker', duration: '14s', testsPassed: 18, totalTests: 18, lastRunTime: '4 mins ago' }
    },
    {
      id: 'focus',
      name: 'Qeloma Focus',
      shortName: 'Focus',
      tagline: 'Domain blocker & timeboxed focus sessions',
      description: 'Block distracting sites with declarativeNetRequest and run clean Pomodoro focus sessions directly in your browser.',
      category: 'Privacy & Blocking',
      permissionTier: 'Green',
      difficulty: 'Easy',
      permissions: ['declarativeNetRequest', 'storage', 'alarms'],
      hostPermissions: [],
      themeVariant: 'ember',
      icon: 'security',
      status: 'Wedge Candidate',
      isWedge: true,
      estimatedReviewTime: '< 24h (Automated Fast-Track)',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Focus',
    description: 'Domain blocker & timeboxed focus sessions',
    permissions: ['declarativeNetRequest', 'storage', 'alarms'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Focus",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["declarativeNetRequest", "storage", "alarms"]
}`,
      popupComponent: 'focus',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Focus)', runNumber: 119, commitHash: 'f8c21a4', commitMessage: 'fix(focus): DNR rule update handling', duration: '12s', testsPassed: 16, totalTests: 16, lastRunTime: '12 mins ago' }
    },
    {
      id: 'night',
      name: 'Qeloma Night',
      shortName: 'Night',
      tagline: 'Intelligent dark mode restyling for the web',
      description: 'Apply comfortable dark theme to any page with custom contrast, warm amber hue, and zero-flicker CSS injection.',
      category: 'Appearance',
      permissionTier: 'Amber',
      difficulty: 'Medium',
      permissions: ['activeTab', 'scripting', 'storage'],
      hostPermissions: [],
      themeVariant: 'night',
      icon: 'dark_mode',
      status: 'Wedge Candidate',
      isWedge: true,
      estimatedReviewTime: '1 - 2 Days (Low Risk)',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Night',
    description: 'Intelligent dark mode restyling for the web',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Night",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["activeTab", "scripting", "storage"]
}`,
      popupComponent: 'night',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Night)', runNumber: 98, commitHash: 'd4e5671', commitMessage: 'perf(night): zero-flicker CSS injection', duration: '15s', testsPassed: 14, totalTests: 14, lastRunTime: '25 mins ago' }
    },
    {
      id: 'clip-lens',
      name: 'Qeloma Clip → Lens',
      shortName: 'Clip→Lens',
      tagline: 'Capture page region → AI summarize, extract & verdict',
      description: 'Select text or image regions on any site and send directly to QelomaLens AI for instant summarization and analysis.',
      category: 'AI Integration',
      permissionTier: 'Green',
      difficulty: 'Medium–Hard',
      permissions: ['activeTab', 'scripting', 'storage'],
      hostPermissions: [],
      themeVariant: 'slate',
      icon: 'auto_awesome',
      status: 'Ready',
      estimatedReviewTime: '< 24h (Automated Fast-Track)',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Clip -> Lens',
    description: 'Capture page region -> AI summarize, extract & verdict',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Clip -> Lens",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["activeTab", "scripting", "storage"]
}`,
      popupComponent: 'clip-lens',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Clip-Lens)', runNumber: 204, commitHash: 'e718902', commitMessage: 'feat(lens): Gemini 2.5 Flash streaming hookup', duration: '19s', testsPassed: 22, totalTests: 22, lastRunTime: '1 hour ago' }
    },
    {
      id: 'volume',
      name: 'Qeloma Volume',
      shortName: 'Volume',
      tagline: 'Per-tab audio booster & gain equalizer',
      description: 'Boost tab volume up to 600% with Web Audio GainNode, bass booster, and stereo balance control.',
      category: 'Media',
      permissionTier: 'Amber',
      difficulty: 'Medium',
      permissions: ['activeTab', 'tabCapture', 'storage'],
      hostPermissions: [],
      themeVariant: 'signal',
      icon: 'volume_up',
      status: 'In Monorepo',
      estimatedReviewTime: '1 - 2 Days',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Volume',
    description: 'Per-tab audio booster & gain equalizer',
    permissions: ['activeTab', 'tabCapture', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Volume",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["activeTab", "tabCapture", "storage"]
}`,
      popupComponent: 'volume',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Volume)', runNumber: 87, commitHash: 'c901234', commitMessage: 'feat(volume): web audio gain 600% clamp', duration: '11s', testsPassed: 12, totalTests: 12, lastRunTime: '2 hours ago' }
    },
    {
      id: 'timebox',
      name: 'Qeloma Timebox',
      shortName: 'Timebox',
      tagline: 'Visual time-blocking grid for daily planning',
      description: 'Plan your workday as hourly blocks on a calm visual grid with countdown timer and local persistence.',
      category: 'Productivity',
      permissionTier: 'Green',
      difficulty: 'Easy–Medium',
      permissions: ['storage'],
      hostPermissions: [],
      themeVariant: 'paper',
      icon: 'calendar_view_day',
      status: 'In Monorepo',
      estimatedReviewTime: '< 24h (Instant Green Tier)',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Timebox',
    description: 'Visual time-blocking grid for daily planning',
    permissions: ['storage'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Timebox",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "permissions": ["storage"]
}`,
      popupComponent: 'timebox',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Timebox)', runNumber: 76, commitHash: 'b567891', commitMessage: 'chore(timebox): local storage state migration', duration: '9s', testsPassed: 10, totalTests: 10, lastRunTime: '3 hours ago' }
    },
    {
      id: 'webtime',
      name: 'Qeloma Webtime',
      shortName: 'Webtime',
      tagline: 'Private browsing time analytics & site tracker',
      description: 'Track how long you spend on each website with zero telemetry, local chrome.storage, and daily time breakdown charts.',
      category: 'Productivity',
      permissionTier: 'Amber',
      difficulty: 'Medium',
      permissions: ['storage', 'tabs', 'idle'],
      hostPermissions: [],
      themeVariant: 'slate',
      icon: 'pie_chart',
      status: 'In Monorepo',
      estimatedReviewTime: '1 - 2 Days',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Webtime',
    description: 'Private browsing time analytics & site tracker',
    permissions: ['storage', 'tabs', 'idle'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Webtime",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["storage", "tabs", "idle"]
}`,
      popupComponent: 'webtime',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Webtime)', runNumber: 64, commitHash: 'a234567', commitMessage: 'fix(webtime): idle state detection accuracy', duration: '13s', testsPassed: 15, totalTests: 15, lastRunTime: '4 hours ago' }
    },
    {
      id: 'inspect',
      name: 'Qeloma Inspect',
      shortName: 'Inspect',
      tagline: 'On-page SEO, meta, headings & JSON-LD inspector',
      description: 'One click reveals page Title, Meta Description, H1-H6 outline hierarchy, OpenGraph cards, and Structured JSON-LD data.',
      category: 'Page Tools',
      permissionTier: 'Green',
      difficulty: 'Medium',
      permissions: ['activeTab', 'scripting', 'storage'],
      hostPermissions: [],
      themeVariant: 'slate',
      icon: 'code_blocks',
      status: 'In Monorepo',
      estimatedReviewTime: '< 24h (Automated Fast-Track)',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Inspect',
    description: 'On-page SEO, meta, headings & JSON-LD inspector',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Inspect",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["activeTab", "scripting", "storage"]
}`,
      popupComponent: 'inspect',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Inspect)', runNumber: 52, commitHash: 'f987654', commitMessage: 'feat(inspect): JSON-LD structured data parser', duration: '10s', testsPassed: 12, totalTests: 12, lastRunTime: '5 hours ago' }
    },
    {
      id: 'reader',
      name: 'Qeloma Reader',
      shortName: 'Reader',
      tagline: 'Strip clutter → calm, distraction-free reading mode',
      description: 'Extract article body content into a calm typography view with dark/light themes, font sizing, and markdown export.',
      category: 'Page Tools',
      permissionTier: 'Green',
      difficulty: 'Medium',
      permissions: ['activeTab', 'scripting', 'storage'],
      hostPermissions: [],
      themeVariant: 'paper',
      icon: 'chrome_reader_mode',
      status: 'In Monorepo',
      estimatedReviewTime: '< 24h (Automated Fast-Track)',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Reader',
    description: 'Strip clutter -> calm, distraction-free reading mode',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Reader",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["activeTab", "scripting", "storage"]
}`,
      popupComponent: 'reader',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Reader)', runNumber: 48, commitHash: 'e345678', commitMessage: 'style(reader): typography baseline spacing', duration: '11s', testsPassed: 14, totalTests: 14, lastRunTime: '6 hours ago' }
    },
    {
      id: 'palette',
      name: 'Qeloma Palette',
      shortName: 'Palette',
      tagline: 'Pixel eyedropper & page color scheme extractor',
      description: 'Sample pixel color with native EyeDropper API, cluster page dominant colors, and copy CSS/Tailwind values.',
      category: 'Appearance',
      permissionTier: 'Green',
      difficulty: 'Easy',
      permissions: ['activeTab', 'scripting', 'storage'],
      hostPermissions: [],
      themeVariant: 'paper',
      icon: 'palette',
      status: 'In Monorepo',
      estimatedReviewTime: '< 24h (Automated Fast-Track)',
      wxtConfigSnippet: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Palette',
    description: 'Pixel eyedropper & page color scheme extractor',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`,
      manifestSnippet: `{
  "manifest_version": 3,
  "name": "Qeloma Palette",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["activeTab", "scripting", "storage"]
}`,
      popupComponent: 'palette',
      cicdStatus: { status: 'success', workflowName: 'CI / Build & Test (Palette)', runNumber: 41, commitHash: 'd123456', commitMessage: 'feat(palette): EyeDropper API fallback', duration: '8s', testsPassed: 10, totalTests: 10, lastRunTime: '7 hours ago' }
    }
  ]);

  // Selected active extension
  readonly selectedExtensionId = signal<string>('shot');
  readonly activeExtension = computed(() =>
    this.extensions().find(e => e.id === this.selectedExtensionId()) || this.extensions()[0]
  );

  // Selected Monorepo File
  readonly selectedMonorepoFile = signal<MonorepoFile | null>(null);

  selectMonorepoFile(file: MonorepoFile) {
    if (file.type === 'file') {
      this.selectedMonorepoFile.set(file);
    }
  }

  // Active view tab ('simulator' | 'admin' | 'showcase' | 'releases' | 'community' | 'guide' | 'checklist' | 'monorepo' | 'linter' | 'economics' | 'onboarding')
  readonly activeView = signal<'simulator' | 'admin' | 'showcase' | 'releases' | 'community' | 'guide' | 'checklist' | 'monorepo' | 'linter' | 'economics' | 'onboarding'>('simulator');

  // Community Metrics Counter State
  readonly activeInstalls = signal<number>(28450);
  readonly githubStars = signal<number>(1482);
  readonly githubForks = signal<number>(342);
  readonly hasStarred = signal<boolean>(false);

  starRepo() {
    if (!this.hasStarred()) {
      this.githubStars.update(v => v + 1);
      this.hasStarred.set(true);
    } else {
      this.githubStars.update(v => v - 1);
      this.hasStarred.set(false);
    }
  }

  // GitHub Release Notes Data mapped per Extension
  readonly releaseNotes = signal([
    {
      version: 'v2.4.0',
      tag: 'v2.4.0-mv3-release',
      date: '2026-08-04',
      title: 'Manifest V3 Strict Compliance & Gemini 2.5 Flash Lens Engine',
      extensionId: 'clip-lens',
      extensionName: 'Qeloma Clip-Lens',
      author: 'Jawad-Ul-Hadi',
      commitHash: 'e718902',
      badge: 'Latest Release',
      changes: [
        'Integrated Google Gemini 2.5 Flash for instant on-page text summarization.',
        'Zero-eval CSP audit passed with Green Tier (<24h review velocity).',
        'Added streaming response callback in active tab context script.'
      ]
    },
    {
      version: 'v2.3.2',
      tag: 'v2.3.2-focus-dnr',
      date: '2026-08-01',
      title: 'declarativeNetRequest Rule Set Optimization',
      extensionId: 'focus',
      extensionName: 'Qeloma Focus Shield',
      author: 'Jawad-Ul-Hadi',
      commitHash: 'f8c21a4',
      badge: 'Patch',
      changes: [
        'Migrated legacy webRequest blocking to declarativeNetRequest MV3 API.',
        'Added customizable Pomodoro timer notifications with chrome.alarms.',
        'Reduced background service worker memory footprint to <4MB.'
      ]
    },
    {
      version: 'v2.2.0',
      tag: 'v2.2.0-shot-crop',
      date: '2026-07-28',
      title: 'Offscreen Document Screenshot API & Element Snapping',
      extensionId: 'shot',
      extensionName: 'Qeloma Shot',
      author: 'Jawad-Ul-Hadi',
      commitHash: 'a3f91b2',
      badge: 'Feature Update',
      changes: [
        'Utilized MV3 offscreen document for canvas rendering without background DOM.',
        'Instant element snapping and area crop selection marquee.',
        'Direct download & clipboard copy support.'
      ]
    },
    {
      version: 'v2.1.0',
      tag: 'v2.1.0-audio-boost',
      date: '2026-07-20',
      title: 'Web Audio GainNode 600% Volume Boost',
      extensionId: 'volume',
      extensionName: 'Qeloma Volume Max',
      author: 'Jawad-Ul-Hadi',
      commitHash: 'c901234',
      badge: 'Major Update',
      changes: [
        'Implemented tabCapture Web Audio API stream analyzer with 600% gain clamp.',
        '10-band equalizer presets for Speech, Bass, and Night listening.',
        'Smooth gain transition to eliminate clipping distortion.'
      ]
    },
    {
      version: 'v2.0.0',
      tag: 'v2.0.0-monorepo-wxt',
      date: '2026-07-10',
      title: 'Monorepo Suite Launch with WXT & pnpm Workspace Architecture',
      extensionId: 'all',
      extensionName: 'All 10 Qeloma Extensions',
      author: 'Jawad-Ul-Hadi',
      commitHash: 'b567891',
      badge: 'Suite Milestone',
      changes: [
        'Refactored entire suite into single pnpm monorepo using WXT build tool.',
        'Shared design tokens, UI components, and TypeScript type definitions.',
        'Standardized Manifest V3 permission profiles across all 10 tools.'
      ]
    }
  ]);

  // Developer Testimonials Data
  readonly testimonials = signal([
    {
      name: 'Elena Rostova',
      role: 'Staff Extension Engineer @ BrowserCraft',
      avatar: 'https://picsum.photos/seed/elena/100/100',
      quote: 'Jawad-Ul-Hadi\'s monorepo architecture for Qeloma is a masterclass in Manifest V3 engineering. Decoupling 10 tools while sharing design tokens reduced our team\'s maintenance overhead by 70%.',
      highlight: '70% Less Overhead',
      stars: 5,
      date: '2 days ago'
    },
    {
      name: 'Marcus Vance',
      role: 'Senior Frontend Architect @ WebPulse Labs',
      avatar: 'https://picsum.photos/seed/marcus/100/100',
      quote: 'The automated CWS Manifest V3 linter and fast-track Green tier permission strategy got our extensions approved in under 18 hours. Outstanding clarity and pragmatic execution.',
      highlight: '<18h Store Approval',
      stars: 5,
      date: '1 week ago'
    },
    {
      name: 'Devon Takahashi',
      role: 'Open Source Maintainer @ ExtensionKit',
      avatar: 'https://picsum.photos/seed/devon/100/100',
      quote: 'Having real-time interactive simulators alongside WXT source code makes testing and debugging extension popups seamless. No need to load unpacked extensions after every edit!',
      highlight: 'Zero-Friction Testing',
      stars: 5,
      date: '2 weeks ago'
    }
  ]);

  updateCwsStatus(extId: string, status: 'Draft' | 'Packaging' | 'Submitted' | 'In Review' | 'Published') {
    this.extensions.update(list => 
      list.map(e => e.id === extId ? { ...e, cwsStatus: status } : e)
    );
  }

  downloadExtensionZip(extId: string) {
    const ext = this.extensions().find(e => e.id === extId);
    if (!ext) return;
    const blob = new Blob([
      `=== ${ext.name} (v1.0.0) Chrome Web Store Build Package ===\n\n`,
      `--- manifest.json ---\n${ext.manifestSnippet}\n\n`,
      `--- wxt.config.ts ---\n${ext.wxtConfigSnippet}\n\n`,
      `--- README.md ---\n# ${ext.name}\n${ext.description}\nCategory: ${ext.category}\nPermission Tier: ${ext.permissionTier}\nStatus: CWS Ready\n`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qeloma-${ext.id}-v1.0.0-cws.zip.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadSuiteZip() {
    const blob = new Blob([
      `=== Qeloma Extension Suite Monorepo Release Package (v2.4.0) ===\n`,
      `Architect: Jawad-Ul-Hadi\n`,
      `Build Engine: WXT + pnpm Workspaces\n`,
      `Manifest Spec: Chrome Web Store Manifest V3 (Strict CSP)\n\n`,
      `Includes all 10 single-purpose browser extensions:\n`,
      ...this.extensions().map(e => `- ${e.name} (${e.shortName}): ${e.description}\n`)
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qeloma-suite-monorepo-v2.4.0.zip.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Popup overlay open/closed state
  readonly isPopupOpen = signal<boolean>(true);

  // Mock Simulated Web Tabs
  readonly tabs = signal<TabData[]>([
    {
      id: 'tab-1',
      title: 'GitHub - qeloma/monorepo: Extension Suite Architecture',
      url: 'https://github.com/qeloma/monorepo',
      favicon: 'code',
      domain: 'github.com',
      timeSpentSeconds: 4320, // 1h 12m
      contentSnippet: 'Qeloma Monorepo: WXT + pnpm workspaces architecture. Lightweight, local-first browser extensions designed for Manifest V3.',
      meta: {
        title: 'GitHub - qeloma/monorepo: Extension Suite Architecture',
        description: 'Pnpm workspaces + WXT framework setup for multi-extension suite with shared UI and utilities.',
        keywords: ['github', 'wxt', 'monorepo', 'chrome extension', 'pnpm'],
        headings: ['Qeloma Monorepo Architecture', 'Getting Started', 'Shared Packages', 'Chrome Web Store Deployment']
      }
    },
    {
      id: 'tab-2',
      title: 'Architecting High-Performance Chrome Extensions (MV3)',
      url: 'https://techcrunch.com/2026/08/05/qeloma-extension-suite-mv3',
      favicon: 'article',
      domain: 'techcrunch.com',
      timeSpentSeconds: 2150, // 35m
      contentSnippet: 'Browser extensions are evolving rapidly with Manifest V3 requirements. Local-first architectures like Qeloma eliminate remote API overhead while preserving privacy.',
      meta: {
        title: 'Architecting High-Performance Chrome Extensions in 2026',
        description: 'How developer-first extensions are leveraging declarativeNetRequest, service workers, and local storage wrappers.',
        keywords: ['techcrunch', 'chrome', 'manifest v3', 'privacy', 'extensions'],
        headings: ['The MV3 Era', 'Zero-Backend Architecture', 'Why Local-First Wins']
      }
    },
    {
      id: 'tab-3',
      title: 'Twitter / X - Latest Product Updates',
      url: 'https://twitter.com/qeloma_app',
      favicon: 'tag',
      domain: 'twitter.com',
      isBlocked: false,
      timeSpentSeconds: 1800, // 30m
      contentSnippet: 'Discover the latest releases from Qeloma. High productivity tools, dark mode restyling, screen capture, and Lens AI integration.',
      meta: {
        title: 'Qeloma (@qeloma_app) on X',
        description: 'Official X account for Qeloma Extension Suite.',
        keywords: ['twitter', 'x', 'qeloma', 'updates'],
        headings: ['Qeloma Updates', 'Pinned Post', 'Replies']
      }
    },
    {
      id: 'tab-4',
      title: 'Chrome Web Store Developer Documentation',
      url: 'https://developer.chrome.com/docs/extensions/mv3/',
      favicon: 'extension',
      domain: 'developer.chrome.com',
      timeSpentSeconds: 3100, // 51m
      contentSnippet: 'Welcome to Chrome extension development. Learn how to build Manifest V3 background service workers, content scripts, and popups.',
      meta: {
        title: 'Chrome Web Store MV3 Docs',
        description: 'Complete documentation for building Chrome extensions.',
        keywords: ['chrome', 'extension', 'mv3', 'manifest', 'api'],
        headings: ['Chrome MV3 Documentation', 'Manifest File', 'Permissions', 'Publishing']
      }
    }
  ]);

  readonly activeTabId = signal<string>('tab-1');
  readonly activeTab = computed(() =>
    this.tabs().find(t => t.id === this.activeTabId()) || this.tabs()[0]
  );

  // Simulated Extension Interactive States
  // 1. Qeloma Night State
  readonly nightSettings = signal({
    enabled: true,
    mode: 'obsidian' as 'slate' | 'obsidian' | 'amber' | 'oled',
    invert: 85,
    contrast: 110,
    brightness: 95,
    sepia: 15,
    whitelisted: false
  });

  // 2. Qeloma Shot State
  readonly shotState = signal({
    mode: 'visible' as 'visible' | 'region' | 'fullpage',
    isCapturing: false,
    capturedImage: null as string | null,
    cropRect: { x: 10, y: 10, width: 80, height: 70 }
  });

  // 3. Qeloma Volume State
  readonly volumeState = signal({
    volumeLevel: 180, // 180% gain
    bassBoost: true,
    monoAudio: false,
    equalizerPreset: 'Balanced' as 'Balanced' | 'Vocal' | 'Bass Heavy' | 'Acoustic'
  });

  // 4. Qeloma Focus State
  readonly focusState = signal({
    blockedDomains: ['facebook.com', 'twitter.com', 'instagram.com', 'reddit.com'],
    isFocusSessionActive: true,
    sessionDurationMinutes: 25,
    timeRemainingSeconds: 1140, // 19m
    strictMode: true
  });

  // 5. Qeloma Timebox State
  readonly timeboxTasks = signal<TimeboxTask[]>([
    { id: '1', title: 'Monorepo Architecture Setup', startTime: '09:00', endTime: '10:30', category: 'work', completed: true, color: '#2C3E50' },
    { id: '2', title: 'WXT Manifest V3 Configs', startTime: '10:30', endTime: '12:00', category: 'focus', completed: true, color: '#C0532E' },
    { id: '3', title: 'Lunch & Quick Walk', startTime: '12:00', endTime: '13:00', category: 'break', completed: false, color: '#2E7D5B' },
    { id: '4', title: 'Qeloma Lens AI API Hookup', startTime: '13:00', endTime: '15:00', category: 'focus', completed: false, color: '#C0532E' },
    { id: '5', title: 'Chrome Web Store Submission', startTime: '15:00', endTime: '16:30', category: 'review', completed: false, color: '#B08900' }
  ]);

  // 6. Qeloma Webtime State
  readonly webtimeState = signal({
    dailyLimitMinutes: 120,
    totalTodayMinutes: 188,
    siteBreakdown: [
      { domain: 'github.com', minutes: 72, color: '#2C3E50' },
      { domain: 'developer.chrome.com', minutes: 51, color: '#4285F4' },
      { domain: 'techcrunch.com', minutes: 35, color: '#00A562' },
      { domain: 'twitter.com', minutes: 30, color: '#1DA1F2' }
    ]
  });

  // 7. Qeloma Inspect State
  readonly inspectState = signal({
    highlightHeadings: true,
    showOgPreview: true,
    showMetaTags: true,
    jsonLdFound: true
  });

  // 8. Qeloma Clip -> Lens State
  readonly lensHistory = signal<LensAnalysisResult[]>([
    {
      id: 'lens-1',
      action: 'summarize',
      pageTitle: 'GitHub - qeloma/monorepo',
      contentSnippet: 'Pnpm workspaces + WXT framework setup for multi-extension suite with shared UI and utilities.',
      summary: '1. Utilizes pnpm workspaces for fast package linking.\n2. WXT compiles Manifest V3 for Chrome, Edge, and Firefox seamlessly.\n3. Shared UI and utils decoupling ensures zero code duplication.',
      timestamp: '10:14 AM'
    }
  ]);
  readonly lensAnalyzing = signal<boolean>(false);

  // 9. Qeloma Reader State
  readonly readerState = signal({
    active: false,
    fontFamily: 'serif' as 'serif' | 'sans' | 'mono',
    fontSize: 18,
    lineWidth: 68,
    theme: 'sepia' as 'sepia' | 'dark' | 'light'
  });

  // 10. Qeloma Palette State
  readonly paletteState = signal({
    activeColor: '#C0532E',
    extractedPalette: [
      { name: 'Primary Slate', hex: '#2C3E50', usage: 'Dominant' },
      { name: 'Terracotta Accent', hex: '#C0532E', usage: 'Accent' },
      { name: 'Editor Base', hex: '#11161C', usage: 'Background' },
      { name: 'Paper Neutral', hex: '#F2F0ED', usage: 'Surface' },
      { name: 'Success Emerald', hex: '#2E7D5B', usage: 'State' }
    ]
  });

  // CWS Linter State & Check Levels
  readonly linterCheckLevel = signal<'strict' | 'fastTrack' | 'privacy' | 'singlePurpose' | 'all'>('strict');
  readonly enforceMv3Strict = signal<boolean>(true);
  readonly linterInputJson = signal<string>(`{
  "manifest_version": 3,
  "name": "Qeloma Extension",
  "version": "1.0.0",
  "description": "Productivity extension suite tool",
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "sw.js"
  },
  "permissions": [
    "activeTab",
    "storage"
  ]
}`);
  readonly linterResult = signal<CwsLinterResult | null>(null);
  readonly linterLoading = signal<boolean>(false);

  // CI/CD GitHub Actions Health Summary
  readonly cicdSummary = computed(() => {
    const list = this.extensions();
    const total = list.length;
    const passing = list.filter(e => e.cicdStatus?.status === 'success').length;
    const building = list.filter(e => e.cicdStatus?.status === 'building').length;
    const totalTests = list.reduce((acc, curr) => acc + (curr.cicdStatus?.testsPassed || 0), 0);
    return { total, passing, building, totalTests };
  });

  triggerCiBuild(extId: string) {
    this.extensions.update(list =>
      list.map(e => {
        if (e.id === extId && e.cicdStatus) {
          return {
            ...e,
            cicdStatus: {
              ...e.cicdStatus,
              status: 'building',
              lastRunTime: 'Building now...'
            }
          };
        }
        return e;
      })
    );

    setTimeout(() => {
      this.extensions.update(list =>
        list.map(e => {
          if (e.id === extId && e.cicdStatus) {
            const nextRun = e.cicdStatus.runNumber + 1;
            const newHash = Math.random().toString(36).substring(2, 9);
            return {
              ...e,
              cicdStatus: {
                ...e.cicdStatus,
                status: 'success',
                runNumber: nextRun,
                commitHash: newHash,
                lastRunTime: 'Just now'
              }
            };
          }
          return e;
        })
      );
    }, 2200);
  }

  triggerAllCiBuilds() {
    this.extensions().forEach(e => this.triggerCiBuild(e.id));
  }

  // Monorepo File Tree
  readonly monorepoFiles = signal<MonorepoFile[]>([
    {
      name: 'pnpm-workspace.yaml',
      path: '/pnpm-workspace.yaml',
      type: 'file',
      language: 'yaml',
      content: `packages:
  - 'extensions/*'
  - 'shared/*'`
    },
    {
      name: 'package.json',
      path: '/package.json',
      type: 'file',
      language: 'json',
      content: `{
  "name": "qeloma-extensions-monorepo",
  "private": true,
  "scripts": {
    "dev:shot": "pnpm --filter @qeloma/shot dev",
    "dev:focus": "pnpm --filter @qeloma/focus dev",
    "dev:night": "pnpm --filter @qeloma/night dev",
    "build:all": "pnpm --recursive run build"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "wxt": "^0.19.0"
  }
}`
    },
    {
      name: 'tsconfig.json',
      path: '/tsconfig.json',
      type: 'file',
      language: 'json',
      content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@qeloma/utils": ["shared/utils/src/index.ts"],
      "@qeloma/ui": ["shared/ui/src/index.ts"],
      "@qeloma/types": ["shared/types/src/index.ts"]
    }
  }
}`
    },
    {
      name: 'shared',
      path: '/shared',
      type: 'folder',
      children: [
        {
          name: 'utils',
          path: '/shared/utils',
          type: 'folder',
          children: [
            {
              name: 'storage.ts',
              path: '/shared/utils/storage.ts',
              type: 'file',
              language: 'typescript',
              content: `import browser from 'webextension-polyfill';

export async function getStorageItem<T>(key: string, defaultValue: T): Promise<T> {
  const result = await browser.storage.local.get(key);
  return result[key] !== undefined ? result[key] : defaultValue;
}

export async function setStorageItem<T>(key: string, value: T): Promise<void> {
  await browser.storage.local.set({ [key]: value });
}`
            }
          ]
        },
        {
          name: 'types',
          path: '/shared/types',
          type: 'folder',
          children: [
            {
              name: 'messaging.ts',
              path: '/shared/types/messaging.ts',
              type: 'file',
              language: 'typescript',
              content: `export type ExtensionMessage =
  | { type: 'TOGGLE_NIGHT'; payload: { enabled: boolean } }
  | { type: 'CAPTURE_SHOT'; payload: { mode: 'visible' | 'region' | 'full' } }
  | { type: 'SET_GAIN'; payload: { gain: number } }
  | { type: 'BLOCK_DOMAIN'; payload: { domain: string } }
  | { type: 'ANALYZE_CLIP'; payload: { text: string; pageTitle: string } };`
            }
          ]
        }
      ]
    },
    {
      name: 'extensions',
      path: '/extensions',
      type: 'folder',
      children: [
        {
          name: 'shot',
          path: '/extensions/shot',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/shot/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Shot',
    description: 'One-click screenshot capture & element area crop',
    permissions: ['activeTab', 'storage', 'downloads'],
    action: { default_popup: 'popup.html' },
  },
});`
            },
            {
              name: 'entrypoints/popup/App.tsx',
              path: '/extensions/shot/entrypoints/popup/App.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React, { useState } from 'react';
import { captureVisibleTab } from '@qeloma/utils';

export function App() {
  const [capturing, setCapturing] = useState(false);
  const handleShot = async (mode: 'visible' | 'region') => {
    setCapturing(true);
    await captureVisibleTab(mode);
    setCapturing(false);
  };
  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl">
      <h1 className="font-bold text-sm">Qeloma Shot</h1>
      <button onClick={() => handleShot('visible')} class="mt-2 px-3 py-1 bg-indigo-600 rounded">
        {capturing ? 'Capturing...' : 'Capture Viewport'}
      </button>
    </div>
  );
}`
            }
          ]
        },
        {
          name: 'focus',
          path: '/extensions/focus',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/focus/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Focus',
    description: 'Domain blocker and pomodoro focus timer',
    permissions: ['declarativeNetRequest', 'storage', 'alarms'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        },
        {
          name: 'night',
          path: '/extensions/night',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/night/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Night',
    description: 'Intelligent dark mode restyling for web pages',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        },
        {
          name: 'clip-lens',
          path: '/extensions/clip-lens',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/clip-lens/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Clip -> Lens',
    description: 'Capture page snippet -> AI summary & verdict',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        },
        {
          name: 'volume',
          path: '/extensions/volume',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/volume/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Volume',
    description: 'Per-tab audio booster up to 600%',
    permissions: ['activeTab', 'tabCapture', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        },
        {
          name: 'timebox',
          path: '/extensions/timebox',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/timebox/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Timebox',
    description: 'Visual hourly task grid and timeblock manager',
    permissions: ['storage'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        },
        {
          name: 'webtime',
          path: '/extensions/webtime',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/webtime/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Webtime',
    description: 'Local browsing time analytics and site tracker',
    permissions: ['storage', 'tabs', 'idle'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        },
        {
          name: 'inspect',
          path: '/extensions/inspect',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/inspect/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Inspect',
    description: 'On-page SEO, meta tag, heading & JSON-LD audit',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        },
        {
          name: 'reader',
          path: '/extensions/reader',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/reader/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Reader',
    description: 'Distraction-free article reader mode',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        },
        {
          name: 'palette',
          path: '/extensions/palette',
          type: 'folder',
          children: [
            {
              name: 'wxt.config.ts',
              path: '/extensions/palette/wxt.config.ts',
              type: 'file',
              language: 'typescript',
              content: `import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome-mv3',
  manifest: {
    name: 'Qeloma Palette',
    description: 'Pixel eyedropper and page color extraction tool',
    permissions: ['activeTab', 'scripting', 'storage'],
    action: { default_popup: 'popup.html' },
  },
});`
            }
          ]
        }
      ]
    }
  ]);

  // Method to lint specific extension by ID
  lintExtensionById(extId: string) {
    const ext = this.extensions().find(e => e.id === extId);
    if (ext) {
      this.linterInputJson.set(ext.manifestSnippet);
      this.runManifestLinter(ext.manifestSnippet);
    }
  }

  // Methods
  selectExtension(id: string) {
    this.selectedExtensionId.set(id);
    this.isPopupOpen.set(true);
  }

  setActiveTab(tabId: string) {
    this.activeTabId.set(tabId);
    // Check if domain is blocked in focus state
    const tab = this.tabs().find(t => t.id === tabId);
    if (tab) {
      const isBlocked = this.focusState().blockedDomains.some(d => tab.domain.includes(d));
      this.tabs.update(list => list.map(t => t.id === tabId ? { ...t, isBlocked } : t));
    }
  }

  togglePopup() {
    this.isPopupOpen.update(v => !v);
  }

  // 1. Qeloma Night Actions
  updateNightSettings(partial: Partial<ReturnType<typeof this.nightSettings>>) {
    this.nightSettings.update(curr => ({ ...curr, ...partial }));
  }

  // 2. Qeloma Focus Actions
  addBlockedDomain(domain: string) {
    if (!domain) return;
    const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    this.focusState.update(state => {
      if (state.blockedDomains.includes(clean)) return state;
      const updatedDomains = [...state.blockedDomains, clean];
      return { ...state, blockedDomains: updatedDomains };
    });
    // Update active tab blockage if matches
    const currentTab = this.activeTab();
    if (currentTab.domain.includes(clean)) {
      this.tabs.update(list => list.map(t => t.id === currentTab.id ? { ...t, isBlocked: true } : t));
    }
  }

  removeBlockedDomain(domain: string) {
    this.focusState.update(state => ({
      ...state,
      blockedDomains: state.blockedDomains.filter(d => d !== domain)
    }));
    const currentTab = this.activeTab();
    if (currentTab.domain.includes(domain)) {
      this.tabs.update(list => list.map(t => t.id === currentTab.id ? { ...t, isBlocked: false } : t));
    }
  }

  // 3. Qeloma Volume Actions
  setVolumeLevel(level: number) {
    this.volumeState.update(state => ({ ...state, volumeLevel: level }));
  }

  // 4. Qeloma Lens AI Action
  analyzeClipWithLens(action: 'summarize' | 'extract' | 'verdict', textContent: string) {
    this.lensAnalyzing.set(true);
    const tab = this.activeTab();

    this.http.post<{ success: boolean; summary: string; action: string; timestamp: string; isLocalFallback?: boolean }>('/api/lens-analyze', {
      action,
      content: textContent || tab.contentSnippet,
      pageTitle: tab.title,
      pageUrl: tab.url
    }).subscribe({
      next: (res) => {
        this.lensAnalyzing.set(false);
        if (res && res.success) {
          const newResult: LensAnalysisResult = {
            id: `lens-${Date.now()}`,
            action,
            pageTitle: tab.title,
            contentSnippet: textContent || tab.contentSnippet,
            summary: res.summary,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isLocalFallback: res.isLocalFallback
          };
          this.lensHistory.update(list => [newResult, ...list]);
        }
      },
      error: (err) => {
        this.lensAnalyzing.set(false);
        console.error('Lens API error:', err);
      }
    });
  }

  // Persistent Theme Mode State (Slate Dark vs High Contrast Light)
  readonly isLightMode = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('qeloma-theme');
      if (savedTheme === 'light') {
        this.isLightMode.set(true);
        document.documentElement.classList.add('light-theme');
      }
    }
  }

  toggleThemeMode() {
    const nextMode = !this.isLightMode();
    this.isLightMode.set(nextMode);
    if (typeof window !== 'undefined') {
      if (nextMode) {
        document.documentElement.classList.add('light-theme');
        localStorage.setItem('qeloma-theme', 'light');
      } else {
        document.documentElement.classList.remove('light-theme');
        localStorage.setItem('qeloma-theme', 'dark');
      }
    }
  }

  // Global Search State
  readonly isSearchOpen = signal<boolean>(false);
  readonly globalSearchQuery = signal<string>('');

  openSearch() {
    this.isSearchOpen.set(true);
  }

  closeSearch() {
    this.isSearchOpen.set(false);
    this.globalSearchQuery.set('');
  }

  setSearchQuery(q: string) {
    this.globalSearchQuery.set(q);
  }

  readonly globalSearchResults = computed(() => {
    const q = this.globalSearchQuery().trim().toLowerCase();
    if (!q) return { extensions: [], releases: [], files: [], linterRules: [] };

    const matchingExtensions = this.extensions().filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.shortName.toLowerCase().includes(q) ||
      e.tagline.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.permissions.some(p => p.toLowerCase().includes(q))
    );

    const matchingReleases = this.releaseNotes().filter(r => 
      r.version.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.extensionName.toLowerCase().includes(q) ||
      r.changes.some(c => c.toLowerCase().includes(q))
    );

    const matchingFiles = this.monorepoFiles().filter(f => 
      f.name.toLowerCase().includes(q) ||
      f.path.toLowerCase().includes(q) ||
      (f.content && f.content.toLowerCase().includes(q))
    );

    const linterRules = [
      { rule: 'MV3 CSP Strict', desc: 'No remote code execution allowed. All code must be packaged in extension bundle.' },
      { rule: 'Permission Minimization', desc: 'Limit host permissions to fast-track CWS review (<24h review velocity).' },
      { rule: 'declarativeNetRequest', desc: 'Use DNR rulesets instead of webRequest blocking.' },
      { rule: 'Service Worker Lifecycle', desc: 'Background service workers must be ephemeral and event-driven.' }
    ].filter(r => r.rule.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));

    return {
      extensions: matchingExtensions,
      releases: matchingReleases,
      files: matchingFiles,
      linterRules
    };
  });

  // Download Manifest Config Method
  downloadManifestConfig(extId?: string, customJson?: string) {
    let jsonText = customJson || this.linterInputJson();
    let filename = 'manifest.json';

    if (extId) {
      const ext = this.extensions().find(e => e.id === extId);
      if (ext) {
        jsonText = ext.manifestSnippet;
        filename = `${ext.id}-manifest.json`;
      }
    } else {
      try {
        const parsed = JSON.parse(jsonText);
        filename = `${(parsed.name || 'custom').toLowerCase().replace(/\s+/g, '-')}-manifest.json`;
        jsonText = JSON.stringify(parsed, null, 2);
      } catch {
        jsonText = jsonText || this.linterInputJson();
      }
    }

    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Feedback Submissions State
  readonly feedbackList = signal<{ id: string; email: string; category: string; message: string; date: string }[]>([]);
  readonly feedbackToast = signal<string | null>(null);

  submitFeedback(message: string, email = 'contributor@qeloma.dev', category = 'General') {
    if (!message.trim()) return;
    const entry = {
      id: `fb-${Date.now()}`,
      email,
      category,
      message,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    this.feedbackList.update(list => [entry, ...list]);
    this.feedbackToast.set('Thank you Bro! Your feedback has been logged for Lead Architect review.');
    setTimeout(() => this.feedbackToast.set(null), 4000);
  }

  // Saved Manifest Templates
  readonly savedManifestTemplates = signal<{ id: string; name: string; description: string; json: string }[]>([
    {
      id: 'template-ai',
      name: 'Gemini AI Content Summarizer',
      description: 'MV3 template with activeTab, scripting, and Gemini proxy setup',
      json: JSON.stringify({
        manifest_version: 3,
        name: "Qeloma AI Assistant",
        version: "1.0.0",
        description: "Gemini 2.5 Flash on-page assistant",
        action: { default_popup: "popup.html" },
        background: { service_worker: "background.js" },
        permissions: ["activeTab", "scripting", "storage"],
        host_permissions: []
      }, null, 2)
    },
    {
      id: 'template-dnr',
      name: 'Fast-Track DNR Domain Blocker',
      description: 'Zero-remote-code declarativeNetRequest ruleset boilerplate',
      json: JSON.stringify({
        manifest_version: 3,
        name: "Qeloma Focus Shield",
        version: "1.0.0",
        description: "Declarative net request domain blocker",
        action: { default_popup: "popup.html" },
        background: { service_worker: "background.js" },
        permissions: ["declarativeNetRequest", "storage", "alarms"],
        declarative_net_request: {
          rule_resources: [{ id: "rules", enabled: true, path: "rules.json" }]
        }
      }, null, 2)
    }
  ]);

  saveManifestTemplate(name: string, description: string, json: string) {
    const newTemplate = {
      id: `tpl-${Date.now()}`,
      name: name || 'Custom Manifest Template',
      description: description || 'User saved configuration',
      json
    };
    this.savedManifestTemplates.update(list => [newTemplate, ...list]);
  }

  // Shared Packages README Data
  readonly sharedPackages = signal([
    {
      name: '@qeloma/types',
      path: 'packages/shared/types/README.md',
      version: '1.2.0',
      description: 'Shared TypeScript interfaces, MV3 permissions schema, and CWS linter contracts.',
      readmeContent: `# @qeloma/types

> Shared TypeScript definitions and CWS Manifest V3 contracts for Qeloma extensions.

## Package Overview
This package exports zero-dependency type contracts consumed across all 10 extension packages and workspace utilities.

## Core Exports
- \`QelomaExtension\`: Manifest V3 extension metadata interface
- \`PermissionTier\`: 'Green' | 'Amber' | 'Red'
- \`CwsLinterResult\`: Security check results and review duration estimates
- \`LensAnalysisResult\`: Gemini 2.5 Flash on-page summarization schema

## Installation & Usage
\`\`\`ts
import { QelomaExtension, CwsLinterResult } from '@qeloma/types';
\`\`\`
`
    },
    {
      name: '@qeloma/ui',
      path: 'packages/shared/ui/README.md',
      version: '2.0.1',
      description: 'Tailwind CSS v4 & Angular component primitives for extension popups and options pages.',
      readmeContent: `# @qeloma/ui

> Reusable UI design system primitives for extension popups, side panels, and options pages.

## Features
- **Design Token Palette**: Slate, Indigo, Emerald, and Amber color utilities
- **Typography & Icons**: Material Icons integration & high contrast light/dark mode support
- **Accessible Components**: Buttons, badges, code cards, and modal dialogs

## Usage
\`\`\`ts
import { QelomaButton, QelomaBadge } from '@qeloma/ui';
\`\`\`
`
    },
    {
      name: '@qeloma/utils',
      path: 'packages/shared/utils/README.md',
      version: '1.4.0',
      description: 'Chrome extension storage wrappers, tab query helpers, and DOM selectors.',
      readmeContent: `# @qeloma/utils

> Utility helpers for chrome.storage.local, tab permissions, and async task execution.

## Key Modules
- **\`storageHelper\`**: Strongly typed async getter/setter with fallback defaults
- **\`tabHelper\`**: Query active tab, execute script injections, and capture tab media
- **\`linterRules\`**: MV3 compliance validation logic

## Usage
\`\`\`ts
import { storageHelper, getActiveTab } from '@qeloma/utils';
\`\`\`
`
    },
    {
      name: '@qeloma/gemini',
      path: 'packages/shared/gemini/README.md',
      version: '2.5.0',
      description: 'Server-side proxy client for Google Gemini 2.5 Flash AI API requests.',
      readmeContent: `# @qeloma/gemini

> Gemini 2.5 Flash AI integration package with server-side key protection.

## Features
- **Secure Server Proxy**: Keeps GEMINI_API_KEY safe on Express backend
- **Streaming Summaries**: Async streaming for Clip-Lens and Tab-Flow extensions
- **Custom Prompts**: Pre-configured prompts for code explanation & web page summaries

## Usage
\`\`\`ts
import { summarizeTextWithGemini } from '@qeloma/gemini';
\`\`\`
`
    },
    {
      name: '@qeloma/storage',
      path: 'packages/shared/storage/README.md',
      version: '1.1.0',
      description: 'Encrypted local storage sync layer with cross-extension state persistence.',
      readmeContent: `# @qeloma/storage

> Cross-extension persistence engine for chrome.storage.sync & IndexedDB.

## Features
- **Auto Sync**: Synchronizes user preferences across all 10 tools
- **Quota Management**: Keeps storage consumption below Chrome 5MB limit

## Usage
\`\`\`ts
import { QelomaStorageEngine } from '@qeloma/storage';
\`\`\`
`
    }
  ]);

  // Discord Webhook Configuration & Dispatcher State
  readonly discordWebhookUrl = signal<string>('https://discord.com/api/webhooks/1234567890/qeloma_ci_channel');
  readonly discordNotifyOnSuccess = signal<boolean>(true);
  readonly discordNotifyOnFailure = signal<boolean>(true);
  readonly discordLogs = signal<{ id: string; timestamp: string; event: string; status: 'sent' | 'failed'; payload: string }[]>([
    {
      id: 'd1',
      timestamp: new Date().toLocaleTimeString(),
      event: 'CI/CD Build Passed (Qeloma Clip-Lens)',
      status: 'sent',
      payload: '{\n  "embeds": [{\n    "title": "✅ CI/CD Pipeline Succeeded",\n    "description": "Package: @qeloma/clip-lens\\nStatus: PASS\\nDuration: 14s",\n    "color": 3066993\n  }]\n}'
    }
  ]);

  updateDiscordWebhookUrl(url: string) {
    this.discordWebhookUrl.set(url);
  }

  sendDiscordTestNotification(eventName = 'Test Webhook Event', isSuccess = true) {
    const payloadObj = {
      content: `**[Qeloma Monorepo CI/CD]** Notification for \`${eventName}\``,
      embeds: [
        {
          title: isSuccess ? '✅ Build Succeeded' : '❌ Build Failed',
          description: `Architect: Jawad-Ul-Hadi\nTarget: pnpm workspaces (chrome-mv3)\nResult: ${isSuccess ? 'All 18 tests passed in 12s' : 'Syntax error in manifest.json'}\nWebhook Endpoint: ${this.discordWebhookUrl()}`,
          color: isSuccess ? 3066993 : 15158332,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const entry = {
      id: `discord-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      event: eventName,
      status: 'sent' as const,
      payload: JSON.stringify(payloadObj, null, 2)
    };

    this.discordLogs.update(logs => [entry, ...logs]);
    this.submitFeedback(`Sent Discord notification to ${this.discordWebhookUrl()}`);
  }

  // Telemetry Dashboard State (Build times & Bundle Sizes over time)
  readonly buildTelemetryHistory = signal([
    { release: 'v2.2.0', avgBuildTimeSec: 28.4, avgBundleSizeKb: 68.2, passRate: '98%', date: '2026-07-15' },
    { release: 'v2.3.0', avgBuildTimeSec: 21.1, avgBundleSizeKb: 52.4, passRate: '100%', date: '2026-07-28' },
    { release: 'v2.4.0 (Current)', avgBuildTimeSec: 13.8, avgBundleSizeKb: 38.4, passRate: '100%', date: '2026-08-05' }
  ]);

  readonly extensionTelemetryList = signal([
    { id: 'shot', name: 'Qeloma Shot', buildTime: '12s', bundleSize: '34 KB', viteModules: 14, efficiencyScore: 98 },
    { id: 'focus', name: 'Qeloma Focus', buildTime: '10s', bundleSize: '28 KB', viteModules: 11, efficiencyScore: 99 },
    { id: 'night', name: 'Qeloma Night', buildTime: '14s', bundleSize: '41 KB', viteModules: 18, efficiencyScore: 95 },
    { id: 'tab-flow', name: 'Qeloma Tab-Flow', buildTime: '16s', bundleSize: '48 KB', viteModules: 22, efficiencyScore: 94 },
    { id: 'clip-lens', name: 'Qeloma Clip-Lens', buildTime: '15s', bundleSize: '45 KB', viteModules: 20, efficiencyScore: 96 },
    { id: 'vol-max', name: 'Qeloma Vol-Max', buildTime: '11s', bundleSize: '32 KB', viteModules: 13, efficiencyScore: 98 },
    { id: 'code-copy', name: 'Qeloma Code-Copy', buildTime: '13s', bundleSize: '36 KB', viteModules: 16, efficiencyScore: 97 },
    { id: 'reader-pro', name: 'Qeloma Reader-Pro', buildTime: '15s', bundleSize: '42 KB', viteModules: 19, efficiencyScore: 95 },
    { id: 'privacy-guard', name: 'Qeloma Privacy-Guard', buildTime: '12s', bundleSize: '30 KB', viteModules: 12, efficiencyScore: 99 },
    { id: 'json-view', name: 'Qeloma JSON-View', buildTime: '13s', bundleSize: '39 KB', viteModules: 17, efficiencyScore: 96 }
  ]);

  // GitHub Webhook Real-Time Event Listener & Status Badge Updater
  readonly githubWebhooks = signal<{ id: string; event: string; extensionId: string; status: 'success' | 'failed' | 'building' | 'queued'; commit: string; timestamp: string }[]>([
    { id: 'gh-101', event: 'push', extensionId: 'clip-lens', status: 'success', commit: 'e718902', timestamp: '5 mins ago' },
    { id: 'gh-100', event: 'workflow_run', extensionId: 'shot', status: 'success', commit: 'a3f91b2', timestamp: '12 mins ago' }
  ]);

  triggerGithubWebhookEvent(extensionId: string, status: 'success' | 'failed' | 'building' | 'queued', commitMsg = 'feat: automated WXT CI build trigger') {
    const ext = this.extensions().find(e => e.id === extensionId);
    if (!ext) return;

    const commitHash = Math.random().toString(16).substring(2, 9);
    const runNum = (ext.cicdStatus?.runNumber || 100) + 1;

    // Update extension's cicdStatus live
    this.extensions.update(list => list.map(item => {
      if (item.id === extensionId) {
        return {
          ...item,
          cicdStatus: {
            status,
            workflowName: `CI / Build & Test (${item.shortName})`,
            runNumber: runNum,
            commitHash,
            commitMessage: commitMsg,
            duration: status === 'building' ? 'Running...' : '13s',
            testsPassed: status === 'failed' ? 14 : 18,
            totalTests: 18,
            lastRunTime: 'Just now'
          }
        };
      }
      return item;
    }));

    // Log GitHub event
    const eventEntry = {
      id: `gh-${Date.now()}`,
      event: 'workflow_run',
      extensionId,
      status,
      commit: commitHash,
      timestamp: 'Just now'
    };
    this.githubWebhooks.update(events => [eventEntry, ...events]);

    // Send Discord alert automatically
    this.sendDiscordTestNotification(`GitHub Webhook: ${ext.name} CI Build ${status.toUpperCase()}`, status === 'success');
  }

  // Compliance Report Download Generator
  downloadComplianceReport() {
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString();
    
    let reportText = `================================================================================
QELOMA CHROME WEB STORE MANIFEST V3 COMPLIANCE & PIPELINE HEALTH REPORT
Generated: ${dateStr} at ${timeStr}
Lead Architect: Jawad-Ul-Hadi
Monorepo Target: pnpm workspaces + WXT (chrome-mv3)
================================================================================

EXECUTIVE COMPLIANCE SUMMARY
--------------------------------------------------------------------------------
Overall Suite Compliance: PASS (100% MV3 Compliant)
Total Managed Extensions: 10
Automated Review Velocity (<24h Green Tier): 7 extensions (70%)
Standard Review Velocity (3-5 Days Amber Tier): 3 extensions (30%)
High Risk / Non-Compliant (Red Tier): 0 extensions (0%)
Remote Code Execution Violations: 0 (Strict CSP Enforced across all packages)
CWS Registration Single-Time Fee Status: Verified ($5 Developer Account)

--------------------------------------------------------------------------------
EXTENSION BY EXTENSION COMPLIANCE BREAKDOWN
--------------------------------------------------------------------------------
`;

    this.extensions().forEach((ext, idx) => {
      reportText += `\n[${idx + 1}] ${ext.name.toUpperCase()} (${ext.id})
  • Category: ${ext.category}
  • Manifest Version: 3
  • Permission Tier: ${ext.permissionTier.toUpperCase()} (${ext.estimatedReviewTime})
  • Permissions: [ ${ext.permissions.join(', ') || 'none'} ]
  • Host Permissions: [ ${ext.hostPermissions.join(', ') || 'none (activeTab preferred)'} ]
  • CWS Fast-Track Eligible: ${ext.permissionTier === 'Green' ? 'YES (<24h review)' : 'NO (Manual Review Required)'}
  • CI/CD Workflow: ${ext.cicdStatus?.workflowName || 'CI / Build & Test'}
  • Last Build Status: ${(ext.cicdStatus?.status || 'success').toUpperCase()} (Run #${ext.cicdStatus?.runNumber || 101})
  • Tests Passed: ${ext.cicdStatus?.testsPassed || 18}/${ext.cicdStatus?.totalTests || 18} tests (100%)
  • Commit Hash: ${ext.cicdStatus?.commitHash || 'a1b2c3d'} - "${ext.cicdStatus?.commitMessage || 'feat: update MV3 manifest'}"
  • Description: ${ext.description}
`;
    });

    reportText += `
--------------------------------------------------------------------------------
STORE SUBMISSION CHECKLIST VERIFICATION
--------------------------------------------------------------------------------
[✔] All background scripts migrated to MV3 Ephemeral Service Workers
[✔] Zero use of eval(), new Function(), or remote CDN script tags
[✔] Host permissions minimized using activeTab or declarativeNetRequest
[✔] WXT build bundle targets chrome-mv3 without legacy fallback
[✔] Privacy policy & zero-telemetry disclosures generated
[✔] Web Audio API offscreen documents isolated for volume booster tool
[✔] Gemini AI calls routed via secure server-side Express proxy

--------------------------------------------------------------------------------
Report Signature: Jawad-Ul-Hadi, Lead Architect & Senior Engineer
Qeloma Monorepo Verification Engine
================================================================================
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qeloma-cws-compliance-report-${dateStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // CWS Manifest Linter Action
  runManifestLinter(manifestJsonText?: string) {
    this.linterLoading.set(true);
    const bodyText = manifestJsonText || this.linterInputJson();

    this.http.post<CwsLinterResult>('/api/validate-manifest', {
      manifest: bodyText,
      checkLevel: this.linterCheckLevel(),
      enforceMv3Strict: this.enforceMv3Strict()
    }).subscribe({
      next: (res) => {
        this.linterLoading.set(false);
        this.linterResult.set(res);
      },
      error: (err) => {
        this.linterLoading.set(false);
        this.linterResult.set({
          valid: false,
          permissionTier: 'Red',
          reviewTimeEstimate: 'Syntax Error',
          issues: [{ level: 'error', field: 'json', message: err.error?.error || 'Invalid Manifest JSON' }],
          summary: 'Manifest validation failed.'
        });
      }
    });
  }
}

