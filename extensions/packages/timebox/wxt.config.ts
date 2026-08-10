import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Timebox',
    short_name: 'Timebox',
    description: 'Visual hourly time-blocking grid with live countdown timers, task status toggles, and local storage persistence.',
    version: '1.0.0',
    permissions: ['storage'],
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
