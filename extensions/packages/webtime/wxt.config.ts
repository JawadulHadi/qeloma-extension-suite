import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Webtime',
    short_name: 'Webtime',
    description: 'Private browsing time tracker with per-site breakdown charts, idle state auto-pausing, and zero telemetry.',
    version: '1.0.0',
    permissions: ['storage', 'tabs', 'idle'],
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
