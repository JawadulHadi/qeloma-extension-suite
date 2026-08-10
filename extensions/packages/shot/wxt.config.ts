import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Shot',
    short_name: 'Shot',
    description: 'One-click viewport capture, region crop, and auto-scroll full-page screenshot stitching with canvas annotation.',
    version: '1.0.0',
    permissions: ['activeTab', 'storage', 'downloads', 'scripting'],
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
