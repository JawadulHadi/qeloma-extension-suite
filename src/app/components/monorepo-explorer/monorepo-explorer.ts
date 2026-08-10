import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { MonorepoFile } from '../../models/extension.model';
import { DependencyGraphComponent } from '../dependency-graph/dependency-graph';
import { IntegratedTerminalComponent } from '../integrated-terminal/integrated-terminal';
import { SharedPackagesReadmeComponent } from '../shared-packages-readme/shared-packages-readme';
import { DiscordWebhookConfigComponent } from '../discord-webhook-config/discord-webhook-config';
import { TelemetryDashboardComponent } from '../telemetry-dashboard/telemetry-dashboard';
import { GithubWebhookListenerComponent } from '../github-webhook-listener/github-webhook-listener';
import { SocialPreviewCardComponent } from '../social-preview-card/social-preview-card';

@Component({
  selector: 'app-monorepo-explorer',
  standalone: true,
  imports: [
    MatIconModule, 
    DependencyGraphComponent, 
    IntegratedTerminalComponent,
    SharedPackagesReadmeComponent,
    DiscordWebhookConfigComponent,
    TelemetryDashboardComponent,
    GithubWebhookListenerComponent,
    SocialPreviewCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './monorepo-explorer.html'
})
export class MonorepoExplorerComponent {
  store = inject(ExtensionStoreService);

  activeSubTab = signal<'files' | 'graph' | 'terminal' | 'shared-pkgs' | 'telemetry' | 'discord' | 'github-webhook' | 'social-card'>('files');

  selectedFile = signal<MonorepoFile>({
    name: 'pnpm-workspace.yaml',
    path: '/pnpm-workspace.yaml',
    type: 'file',
    language: 'yaml',
    content: `packages:
  - 'extensions/*'
  - 'shared/*'`
  });

  setSubTab(tab: 'files' | 'graph' | 'terminal' | 'shared-pkgs' | 'telemetry' | 'discord' | 'github-webhook' | 'social-card') {
    this.activeSubTab.set(tab);
  }

  selectFile(file: MonorepoFile) {
    if (file.type === 'file') {
      this.selectedFile.set(file);
    }
  }

  copyCode() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.selectedFile().content || '');
    }
  }

  downloadMonorepoZip() {
    this.store.downloadSuiteZip();
  }
}

