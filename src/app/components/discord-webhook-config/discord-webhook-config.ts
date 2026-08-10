import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ExtensionStoreService } from '../../services/extension-store.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-discord-webhook-config',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './discord-webhook-config.html'
})
export class DiscordWebhookConfigComponent {
  store = inject(ExtensionStoreService);

  webhookControl = new FormControl(this.store.discordWebhookUrl());

  saveWebhook() {
    if (this.webhookControl.value) {
      this.store.updateDiscordWebhookUrl(this.webhookControl.value);
    }
  }

  triggerSuccessNotification() {
    this.store.sendDiscordTestNotification('Manual CI Pipeline Execution (Qeloma Shot)', true);
  }

  triggerFailureNotification() {
    this.store.sendDiscordTestNotification('CI/CD Manifest Audit Error (Qeloma Night)', false);
  }
}
