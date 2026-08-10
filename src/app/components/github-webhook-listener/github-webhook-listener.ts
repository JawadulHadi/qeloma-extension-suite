import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-github-webhook-listener',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './github-webhook-listener.html'
})
export class GithubWebhookListenerComponent {
  store = inject(ExtensionStoreService);

  selectedExt = signal<string>('shot');
  selectedStatus = signal<'success' | 'failed' | 'building' | 'queued'>('success');

  triggerWebhook() {
    this.store.triggerGithubWebhookEvent(this.selectedExt(), this.selectedStatus());
  }
}
