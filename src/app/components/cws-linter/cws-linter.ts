import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ManifestFactoryComponent } from '../manifest-factory/manifest-factory';

@Component({
  selector: 'app-cws-linter',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, ManifestFactoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cws-linter.html'
})
export class CwsLinterComponent {
  store = inject(ExtensionStoreService);
  jsonInput = new FormControl(this.store.linterInputJson());
  activeSubTab = signal<'linter' | 'factory'>('linter');

  downloadComplianceReport() {
    this.store.downloadComplianceReport();
  }

  runLinter() {
    if (this.jsonInput.value) {
      this.store.linterInputJson.set(this.jsonInput.value);
      this.store.runManifestLinter(this.jsonInput.value);
    }
  }

  downloadManifest() {
    const text = this.jsonInput.value || this.store.linterInputJson();
    this.store.downloadManifestConfig(undefined, text);
  }

  setCheckLevel(level: 'strict' | 'fastTrack' | 'privacy' | 'singlePurpose' | 'all') {
    this.store.linterCheckLevel.set(level);
    this.runLinter();
  }

  toggleStrictMv3() {
    this.store.enforceMv3Strict.update(v => !v);
    this.runLinter();
  }

  lintExtension(extId: string) {
    const ext = this.store.extensions().find(e => e.id === extId);
    if (ext) {
      this.jsonInput.setValue(ext.manifestSnippet);
      this.store.linterInputJson.set(ext.manifestSnippet);
      this.store.runManifestLinter(ext.manifestSnippet);
    }
  }

  loadSample(type: 'green' | 'amber' | 'red') {
    let json = '';
    if (type === 'green') {
      json = `{
  "manifest_version": 3,
  "name": "Qeloma Shot",
  "version": "1.0.0",
  "description": "One-click, full-page & region screenshots",
  "action": { "default_popup": "popup.html" },
  "permissions": ["activeTab", "storage", "downloads"]
}`;
    } else if (type === 'amber') {
      json = `{
  "manifest_version": 3,
  "name": "Qeloma Night",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["activeTab", "scripting", "storage"]
}`;
    } else {
      json = `{
  "manifest_version": 3,
  "name": "Legacy Broad Crawler",
  "version": "1.0.0",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "sw.js" },
  "permissions": ["tabs", "cookies", "webRequest"],
  "host_permissions": ["<all_urls>"]
}`;
    }
    this.jsonInput.setValue(json);
    this.runLinter();
  }
}
