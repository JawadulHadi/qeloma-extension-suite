import { Readability } from '@mozilla/readability';
import { onStorageChange, storageGet } from '@qeloma/shared';
import DOMPurify from 'dompurify';
import TurndownService from 'turndown';
import { DEFAULT_READER_SETTINGS, READER_STORAGE_KEY, ReaderSettings } from '../lib/settings';

const OVERLAY_ID = 'qeloma-reader-overlay';

const THEME_COLORS: Record<ReaderSettings['theme'], { bg: string; fg: string }> = {
  light: { bg: '#ffffff', fg: '#1e293b' },
  dark: { bg: '#0f172a', fg: '#e2e8f0' },
  sepia: { bg: '#f4ecd8', fg: '#3f3527' },
};

const FONT_STACKS: Record<ReaderSettings['fontFamily'], string> = {
  serif: 'Georgia, "Times New Roman", serif',
  sans: '"Segoe UI", system-ui, sans-serif',
  mono: '"Cascadia Code", Consolas, monospace',
};

let article: { title: string; contentHtml: string; textContent: string; byline: string | null } | null = null;

function extractArticle(): typeof article {
  const clone = document.cloneNode(true) as Document;
  const parsed = new Readability(clone).parse();
  if (!parsed) return null;
  return {
    title: parsed.title,
    contentHtml: DOMPurify.sanitize(parsed.content, { ADD_ATTR: ['target'] }),
    textContent: parsed.textContent,
    byline: parsed.byline,
  };
}

function applyStyles(settings: ReaderSettings): void {
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;
  const theme = THEME_COLORS[settings.theme];
  overlay.style.background = theme.bg;
  overlay.style.color = theme.fg;
  const body = overlay.querySelector<HTMLElement>('.qeloma-reader-body');
  if (body) {
    body.style.fontFamily = FONT_STACKS[settings.fontFamily];
    body.style.fontSize = `${settings.fontSize}px`;
  }
}

function exportMarkdown(): void {
  if (!article) return;
  const turndown = new TurndownService({ headingStyle: 'atx' });
  const markdown = `# ${article.title}\n\n${turndown.turndown(article.contentHtml)}`;
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${article.title.replace(/[^\w\-]+/g, '-').slice(0, 60) || 'article'}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

async function renderOverlay(): Promise<void> {
  article = extractArticle();
  if (!article) {
    alert('Qeloma Reader could not find an article on this page.');
    return;
  }

  const settings = await storageGet<ReaderSettings>(READER_STORAGE_KEY, DEFAULT_READER_SETTINGS);

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.innerHTML = `
    <div class="qeloma-reader-topbar">
      <span class="qeloma-reader-brand">Qeloma Reader</span>
      <div class="qeloma-reader-actions">
        <button data-action="export">Export .md</button>
        <button data-action="close">Close</button>
      </div>
    </div>
    <div class="qeloma-reader-body">
      <h1>${DOMPurify.sanitize(article.title)}</h1>
      ${article.byline ? `<p class="qeloma-reader-byline">${DOMPurify.sanitize(article.byline)}</p>` : ''}
      <div class="qeloma-reader-content">${article.contentHtml}</div>
    </div>
  `;

  injectBaseStyles();
  document.documentElement.appendChild(overlay);
  applyStyles(settings);

  overlay.querySelector('[data-action="close"]')!.addEventListener('click', () => overlay.remove());
  overlay.querySelector('[data-action="export"]')!.addEventListener('click', exportMarkdown);

  onStorageChange(READER_STORAGE_KEY, (value) => applyStyles((value as ReaderSettings) ?? DEFAULT_READER_SETTINGS));
}

function injectBaseStyles(): void {
  if (document.getElementById('qeloma-reader-base-style')) return;
  const style = document.createElement('style');
  style.id = 'qeloma-reader-base-style';
  style.textContent = `
    #${OVERLAY_ID} { position: fixed; inset: 0; z-index: 2147483647; overflow-y: auto; }
    .qeloma-reader-topbar { position: sticky; top: 0; display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: rgba(0,0,0,0.08); backdrop-filter: blur(6px); }
    .qeloma-reader-brand { font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; font-size: 12px; }
    .qeloma-reader-actions button { margin-left: 8px; padding: 6px 12px; border-radius: 6px; border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; font-size: 12px; }
    .qeloma-reader-body { max-width: 680px; margin: 0 auto; padding: 40px 24px 80px; line-height: 1.7; }
    .qeloma-reader-body h1 { font-size: 1.8em; margin-bottom: 4px; }
    .qeloma-reader-byline { opacity: 0.6; font-size: 0.9em; margin-bottom: 24px; }
    .qeloma-reader-content img { max-width: 100%; border-radius: 8px; }
    .qeloma-reader-content a { color: #38bdf8; }
  `;
  document.head.appendChild(style);
}

function toggle(): void {
  const existing = document.getElementById(OVERLAY_ID);
  if (existing) {
    existing.remove();
  } else {
    renderOverlay();
  }
}

export default defineUnlistedScript(() => {
  toggle();
});
