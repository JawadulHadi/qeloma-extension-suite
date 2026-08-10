import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Inspect',
    short_name: 'Inspect',
    description: 'On-page SEO inspector rendering H1–H6 heading hierarchies, OpenGraph preview cards, and structured JSON-LD data.',
    version: '1.0.0',
    permissions: ['activeTab', 'scripting', 'storage'],
    icons: {
      16: 'icon-16.png',
      48: 'icon-48.png',
      128: 'icon-128.png',
    },
    action: {
      default_icon: {
        16: 'icon-16.png',
        48: 'icon-48.png',
        128: 'icon-128.png',
      },
    },
  },
});
