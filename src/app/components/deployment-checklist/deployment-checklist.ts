import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { QelomaLogoComponent } from '../qeloma-logo';

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  completed: boolean;
  codeSnippet?: string;
  essentialLink?: string;
}

@Component({
  selector: 'app-deployment-checklist',
  standalone: true,
  imports: [MatIconModule, QelomaLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deployment-checklist.html'
})
export class DeploymentChecklistComponent {
  store = inject(ExtensionStoreService);

  items = signal<ChecklistItem[]>([
    {
      id: 'cws-acc',
      category: '1. Setup & Registration',
      title: 'Chrome Developer Account Setup',
      description: 'Register for a Google Chrome Web Store Developer account and complete the one-time $5.00 registration fee payment.',
      completed: true,
      essentialLink: 'https://chrome.google.com/webstore/devconsole'
    },
    {
      id: 'mv3-audit',
      category: '2. Manifest V3 Audit',
      title: 'Validate Manifest V3 Format & Schema',
      description: 'Ensure manifest_version is 3, background uses service_worker, and action is defined without legacy browser_action.',
      completed: true,
      codeSnippet: `"manifest_version": 3,\n"action": { "default_popup": "popup.html" }`
    },
    {
      id: 'perm-tier',
      category: '2. Manifest V3 Audit',
      title: 'Minimize MV3 Permission Declarations',
      description: 'Review permissions to ensure strict compliance with the Single Purpose Policy. Prefer activeTab over broad host permissions.',
      completed: true
    },
    {
      id: 'asset-icons',
      category: '3. Asset Management',
      title: 'Generate Transparent PNG Icons (16, 48, 128px)',
      description: 'Create high-resolution PNG icon assets using the Qeloma slate & indigo vector emblem for toolbar and store display.',
      completed: true
    },
    {
      id: 'asset-shots',
      category: '3. Asset Management',
      title: 'Prepare 1280x800 px Store Screenshots',
      description: 'Capture clean, dark-mode screenshots of each extension popup running in action on realistic web pages.',
      completed: true
    },
    {
      id: 'asset-privacy',
      category: '3. Asset Management',
      title: 'Draft Single Privacy Policy & Hosting URL',
      description: 'Publish a clear, single-page Privacy Policy stating zero third-party data selling and local chrome.storage usage.',
      completed: false,
      essentialLink: 'https://qeloma.io/privacy'
    },
    {
      id: 'monorepo-build',
      category: '4. Packaging & Signing',
      title: 'Run Monorepo Production Build',
      description: 'Execute pnpm build:all to compile TypeScript and bundle 10 individual extension ZIP packages in dist/zip/.',
      completed: false,
      codeSnippet: 'pnpm build:all'
    },
    {
      id: 'cws-upload',
      category: '5. CWS Listing & Submission',
      title: 'Upload ZIP Package to Chrome Developer Console',
      description: 'Create a new item in the CWS Console for each of the 10 tools and upload its matching .zip file.',
      completed: false
    },
    {
      id: 'cws-review',
      category: '5. CWS Listing & Submission',
      title: 'Submit for Review & Monitor Developer Console',
      description: 'Submit listing for review. Green Tier extensions typically approve in under 24 hours; Amber Tier takes 1-2 days.',
      completed: false
    }
  ]);

  completedCount = computed(() => this.items().filter(i => i.completed).length);
  totalCount = computed(() => this.items().length);
  progressPercent = computed(() => Math.round((this.completedCount() / this.totalCount()) * 100));

  toggleItem(id: string) {
    this.items.update(list => 
      list.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  }

  resetAll() {
    this.items.update(list => list.map(item => ({ ...item, completed: false })));
  }

  completeAll() {
    this.items.update(list => list.map(item => ({ ...item, completed: true })));
  }
}
