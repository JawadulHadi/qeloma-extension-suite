import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Clip → Lens',
    short_name: 'Clip → Lens',
    description: 'Contextual page region capture connected directly to Gemini 2.5 Flash AI for streaming summaries and verdicts.',
    version: '1.0.0',
    permissions: ['activeTab', 'scripting', 'storage'],
    options_ui: {
      open_in_tab: true,
    },
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
