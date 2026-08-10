import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Reader',
    short_name: 'Reader',
    description: 'Distraction-free article reader stripping clutter into a clean typography view with font adjustments and Markdown export.',
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
