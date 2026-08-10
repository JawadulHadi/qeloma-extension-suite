import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Volume',
    short_name: 'Volume',
    description: 'Per-tab Web Audio GainNode booster (up to 600%), bass booster equalizer, and stereo balance controls.',
    version: '1.0.0',
    permissions: ['activeTab', 'tabCapture', 'storage', 'offscreen'],
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
