import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Palette',
    short_name: 'Palette',
    description: 'Native EyeDropper pixel color sampler, page dominant color clusterer, and one-click CSS/Tailwind value generator.',
    version: '1.0.0',
    permissions: ['activeTab', 'storage'],
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
