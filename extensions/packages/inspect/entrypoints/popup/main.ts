import type { PageMeta } from '@qeloma/shared';

const app = document.getElementById('app')!;

function extractPageMetaInPage(): PageMeta {
  const getMeta = (selector: string) => document.querySelector(selector)?.getAttribute('content') ?? '';
  const headings: { level: number; text: string }[] = [];
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    const text = el.textContent?.trim();
    if (text) headings.push({ level: Number(el.tagName[1]), text });
  });

  const jsonLd: unknown[] = [];
  document.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
    try {
      jsonLd.push(JSON.parse(el.textContent ?? ''));
    } catch {
      // ignore malformed JSON-LD blocks
    }
  });

  return {
    title: document.title,
    description: getMeta('meta[name="description"]'),
    ogTitle: getMeta('meta[property="og:title"]'),
    ogDescription: getMeta('meta[property="og:description"]'),
    ogImage: getMeta('meta[property="og:image"]'),
    headings,
    jsonLd,
  };
}

function escapeHtml(value: string): string {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

function toast(message: string): void {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, 1200);
}

function buildReport(meta: PageMeta): string {
  const lines = [
    `# SEO Report`,
    `Title: ${meta.title}`,
    `Description: ${meta.description || '(none)'}`,
    '',
    `## Headings`,
    ...meta.headings.map((h) => `${'  '.repeat(h.level - 1)}H${h.level}: ${h.text}`),
    '',
    `## OpenGraph`,
    `og:title: ${meta.ogTitle || '(none)'}`,
    `og:description: ${meta.ogDescription || '(none)'}`,
    `og:image: ${meta.ogImage || '(none)'}`,
    '',
    `## JSON-LD blocks: ${meta.jsonLd.length}`,
  ];
  return lines.join('\n');
}

function render(meta: PageMeta | null, error?: string): void {
  if (error) {
    app.innerHTML = `<h1>Qeloma Inspect</h1><div class="card empty">${escapeHtml(error)}</div>`;
    return;
  }
  if (!meta) {
    app.innerHTML = `<h1>Qeloma Inspect</h1><div class="card empty">Analyzing page…</div>`;
    return;
  }

  app.innerHTML = `
    <h1>Qeloma Inspect</h1>

    <div class="section-title">Title &amp; description</div>
    <div class="card">
      <div><strong>${escapeHtml(meta.title || '(no title)')}</strong></div>
      <div style="margin-top:4px;color:#94a3b8">${escapeHtml(meta.description || '(no meta description)')}</div>
    </div>

    <div class="section-title">OpenGraph preview</div>
    <div class="og-card">
      ${meta.ogImage ? `<img src="${meta.ogImage}" alt="" />` : ''}
      <div class="og-body">
        <div class="og-title">${escapeHtml(meta.ogTitle || meta.title || '(no og:title)')}</div>
        <div class="og-desc">${escapeHtml(meta.ogDescription || '(no og:description)')}</div>
      </div>
    </div>

    <div class="section-title">Heading hierarchy (${meta.headings.length})</div>
    <div class="card">
      ${
        meta.headings.length
          ? meta.headings
              .map((h) => `<div class="heading-row" style="padding-left:${(h.level - 1) * 12}px">H${h.level} · ${escapeHtml(h.text)}</div>`)
              .join('')
          : '<span class="empty">No headings found.</span>'
      }
    </div>

    <div class="section-title">Structured data (JSON-LD)</div>
    ${
      meta.jsonLd.length
        ? `<div class="jsonld">${escapeHtml(JSON.stringify(meta.jsonLd, null, 2))}</div>`
        : '<div class="card empty">No JSON-LD found on this page.</div>'
    }

    <button class="copy-report" id="copy-report">Copy SEO report</button>
  `;

  document.getElementById('copy-report')!.addEventListener('click', async () => {
    await navigator.clipboard.writeText(buildReport(meta));
    toast('Report copied to clipboard');
  });
}

async function run(): Promise<void> {
  render(null);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    render(null, 'No active tab found.');
    return;
  }
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageMetaInPage,
    });
    render(result as PageMeta);
  } catch {
    render(null, 'This page cannot be inspected (browser-internal or restricted page).');
  }
}

run();
