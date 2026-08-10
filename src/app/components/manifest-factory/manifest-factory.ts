import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manifest-factory',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manifest-factory.html'
})
export class ManifestFactoryComponent {
  store = inject(ExtensionStoreService);

  extName = signal('My Custom MV3 Extension');
  extVersion = signal('1.0.0');
  extDescription = signal('Generated using Qeloma Manifest Factory');
  
  // Extension Types/Modes
  hasPopup = signal(true);
  hasServiceWorker = signal(true);
  hasContentScript = signal(false);
  hasSidePanel = signal(false);
  hasOffscreen = signal(false);

  // Permissions Selection
  availablePermissions = [
    { id: 'activeTab', name: 'activeTab', desc: 'Temporary access to active tab (Fast-track Green Tier)', tier: 'Green' },
    { id: 'storage', name: 'storage', desc: 'Persist settings in chrome.storage.local', tier: 'Green' },
    { id: 'declarativeNetRequest', name: 'declarativeNetRequest', desc: 'Fast domain blocking without webRequest scripts', tier: 'Green' },
    { id: 'scripting', name: 'scripting', desc: 'Inject dynamic content scripts into active page', tier: 'Green' },
    { id: 'alarms', name: 'alarms', desc: 'Schedule periodic background timers', tier: 'Green' },
    { id: 'downloads', name: 'downloads', desc: 'Trigger file downloads directly from background worker', tier: 'Green' },
    { id: 'contextMenus', name: 'contextMenus', desc: 'Add items to right-click context menu', tier: 'Green' },
    { id: 'sidePanel', name: 'sidePanel', desc: 'Chrome side panel companion view', tier: 'Green' },
    { id: 'offscreen', name: 'offscreen', desc: 'Isolated offscreen document for Web Audio / DOM APIs', tier: 'Amber' },
    { id: 'tabCapture', name: 'tabCapture', desc: 'Capture tab audio or video streams', tier: 'Amber' }
  ];

  selectedPermissions = signal<string[]>(['activeTab', 'storage']);

  // Host Permissions
  availableHosts = [
    { id: 'all_urls', pattern: '<all_urls>', label: 'All URLs (Requires CWS Manual Review)', tier: 'Amber' },
    { id: 'http_https', pattern: 'https://*/*', label: 'All HTTPS Web Pages', tier: 'Amber' },
    { id: 'github', pattern: 'https://*.github.com/*', label: 'GitHub Pages Only', tier: 'Green' }
  ];

  selectedHosts = signal<string[]>([]);

  // Template Saving Form State
  templateNameInput = signal('');

  // Toggle Permission
  togglePermission(permId: string) {
    this.selectedPermissions.update(list => {
      if (list.includes(permId)) {
        return list.filter(p => p !== permId);
      } else {
        return [...list, permId];
      }
    });
  }

  // Toggle Host Permission
  toggleHost(hostPattern: string) {
    this.selectedHosts.update(list => {
      if (list.includes(hostPattern)) {
        return list.filter(h => h !== hostPattern);
      } else {
        return [...list, hostPattern];
      }
    });
  }

  // Computed Real-Time Manifest JSON Output
  readonly generatedManifestJson = computed(() => {
    const config: Record<string, unknown> = {
      manifest_version: 3,
      name: this.extName(),
      version: this.extVersion(),
      description: this.extDescription(),
      action: this.hasPopup() ? { default_popup: 'popup.html', default_icon: 'icon.png' } : undefined,
      background: this.hasServiceWorker() ? { service_worker: 'background.js', type: 'module' } : undefined,
      permissions: this.selectedPermissions(),
      host_permissions: this.selectedHosts().length ? this.selectedHosts() : undefined
    };

    if (this.hasSidePanel()) {
      config['side_panel'] = { default_path: 'sidepanel.html' };
    }

    if (this.hasContentScript()) {
      config['content_scripts'] = [
        {
          matches: ['<all_urls>'],
          js: ['content.js'],
          run_at: 'document_idle'
        }
      ];
    }

    if (this.selectedPermissions().includes('declarativeNetRequest')) {
      config['declarative_net_request'] = {
        rule_resources: [{ id: 'rules', enabled: true, path: 'rules.json' }]
      };
    }

    return JSON.stringify(config, null, 2);
  });

  // Preset Loaders
  loadPreset(presetType: 'ai' | 'dnr' | 'shot') {
    if (presetType === 'ai') {
      this.extName.set('Qeloma AI Lens');
      this.extDescription.set('Gemini 2.5 Flash on-page summaries');
      this.hasPopup.set(true);
      this.hasServiceWorker.set(true);
      this.hasContentScript.set(true);
      this.selectedPermissions.set(['activeTab', 'scripting', 'storage']);
      this.selectedHosts.set([]);
    } else if (presetType === 'dnr') {
      this.extName.set('Qeloma Focus Shield');
      this.extDescription.set('Declarative net request domain blocker');
      this.hasPopup.set(true);
      this.hasServiceWorker.set(true);
      this.hasContentScript.set(false);
      this.selectedPermissions.set(['declarativeNetRequest', 'storage', 'alarms']);
      this.selectedHosts.set([]);
    } else if (presetType === 'shot') {
      this.extName.set('Qeloma Shot Capture');
      this.extDescription.set('One-click region & full-page screenshot tool');
      this.hasPopup.set(true);
      this.hasServiceWorker.set(true);
      this.hasContentScript.set(false);
      this.selectedPermissions.set(['activeTab', 'storage', 'downloads']);
      this.selectedHosts.set([]);
    }
  }

  saveAsTemplate() {
    const name = this.templateNameInput().trim() || this.extName();
    this.store.saveManifestTemplate(name, this.extDescription(), this.generatedManifestJson());
    this.templateNameInput.set('');
    this.store.submitFeedback(`Saved manifest factory template: ${name}`);
  }

  loadTemplate(jsonText: string) {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed.name) this.extName.set(parsed.name);
      if (parsed.description) this.extDescription.set(parsed.description);
      if (parsed.version) this.extVersion.set(parsed.version);
      if (parsed.permissions) this.selectedPermissions.set(parsed.permissions);
      if (parsed.host_permissions) this.selectedHosts.set(parsed.host_permissions);
    } catch (err) {
      console.debug('JSON parse error:', err);
    }
  }

  downloadManifest() {
    this.store.downloadManifestConfig(undefined, this.generatedManifestJson());
  }

  copyManifestJson() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.generatedManifestJson());
      this.store.submitFeedback('Copied manifest.json to clipboard!');
    }
  }
}
