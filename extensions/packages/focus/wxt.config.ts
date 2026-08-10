import { defineConfig } from 'wxt';

export default defineConfig({
  imports: { dirs: [] },
  manifest: {
    name: 'Qeloma Focus',
    short_name: 'Focus',
    description: 'Domain blocker powered by Chrome declarativeNetRequest, Pomodoro timer, and session tracking.',
    version: '1.0.0',
    permissions: ['declarativeNetRequest', 'storage', 'alarms'],
    // Asked for per domain, when the user adds one to their block list — a
    // redirect rule needs host access to the site it redirects. Keeping this
    // optional keeps the install prompt free of an all-sites warning.
    optional_host_permissions: ['*://*/*'],
    // A declarativeNetRequest redirect to an extension page only fires if the
    // page is web-accessible.
    web_accessible_resources: [
      {
        resources: ['blocked.html'],
        matches: ['<all_urls>'],
      },
    ],
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
