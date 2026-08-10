export type QelomaExtensionId =
  | 'shot'
  | 'focus'
  | 'night'
  | 'clip-lens'
  | 'volume'
  | 'timebox'
  | 'webtime'
  | 'inspect'
  | 'reader'
  | 'palette';

export type ExtensionMessage =
  | { type: 'CAPTURE_VISIBLE_TAB' }
  | { type: 'SCROLL_STEP_CAPTURED'; payload: { dataUrl: string; scrollY: number; devicePixelRatio: number } }
  | { type: 'START_REGION_CAPTURE' }
  | { type: 'REGION_SELECTED'; payload: { x: number; y: number; width: number; height: number; devicePixelRatio: number } }
  | { type: 'START_FULLPAGE_CAPTURE' }
  | { type: 'TOGGLE_NIGHT'; payload: { enabled: boolean } }
  | { type: 'UPDATE_NIGHT_SETTINGS'; payload: NightSettings }
  | { type: 'ANALYZE_CLIP'; payload: { content: string; pageTitle: string; pageUrl: string; action: 'summarize' | 'extract' | 'verdict' } }
  | { type: 'SET_GAIN'; payload: { gain: number } }
  | { type: 'SET_EQ'; payload: { bassBoost: number; balance: number } }
  | { type: 'STOP_VOLUME_BOOST' }
  | { type: 'BLOCK_DOMAIN'; payload: { domain: string } }
  | { type: 'UNBLOCK_DOMAIN'; payload: { domain: string } }
  | { type: 'EXTRACT_PAGE_META' }
  | { type: 'EXTRACT_ARTICLE' }
  | { type: 'GET_DOMINANT_COLORS' };

export interface NightSettings {
  enabled: boolean;
  invert: number;
  contrast: number;
  sepia: number;
  brightness: number;
  warmth: number;
  whitelist: string[];
}

export const DEFAULT_NIGHT_SETTINGS: NightSettings = {
  enabled: true,
  invert: 90,
  contrast: 100,
  sepia: 10,
  brightness: 100,
  warmth: 0,
  whitelist: [],
};

export interface FocusSession {
  id: string;
  startedAt: number;
  endedAt: number | null;
  plannedMinutes: number;
  completed: boolean;
}

export interface FocusState {
  blockedDomains: string[];
  strictMode: boolean;
  activeSession: FocusSession | null;
  history: FocusSession[];
}

export interface WebtimeEntry {
  domain: string;
  totalSeconds: number;
  lastVisit: number;
}

export interface PageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  headings: { level: number; text: string }[];
  jsonLd: unknown[];
}

export interface ArticleExtract {
  title: string;
  byline: string | null;
  siteName: string | null;
  contentHtml: string;
  textContent: string;
  excerpt: string;
  length: number;
}

export interface DominantColor {
  hex: string;
  ratio: number;
}
